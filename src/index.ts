import './styles.css';
import { MODULE_ID } from './constants';
import { initLiberationSync } from './state/sync';
import { liberation } from './state/liberationStore.svelte';
import { openPitaxScene } from './state/sceneMacro';
import { HeroPanelApp } from './ui/HeroPanelApp';
import { GmLedgerApp } from './ui/GmLedgerApp';

interface ModuleApi {
  version: string;
  showHeroPanel: () => void;
  hideHeroPanel: () => void;
  openGmLedger: () => void;
  openPitaxScene: (sceneName?: string) => Promise<void>;
}

Hooks.once('init', () => {
  console.log(`${MODULE_ID} | init`);
});

Hooks.once('ready', () => {
  // The shared marquee's visibility lives in the synced state (liberation.visible), not a
  // per-client toggle — every client (GM and players alike) reacts here, so a GM show/hide
  // reaches the whole table, and a client that joins or reloads mid-session picks up
  // whatever's already showing.
  void initLiberationSync({ onSync: () => HeroPanelApp.sync(liberation.visible) });

  const module = game.modules.get(MODULE_ID);
  const version = module?.version ?? '0.0.0';
  const api: ModuleApi = {
    version,
    showHeroPanel: () => {
      if (!game.user.isGM) {
        ui.notifications?.warn(game.i18n.localize('pitax.hero.gmOnly'));
        return;
      }
      liberation.showHeroPanel();
    },
    hideHeroPanel: () => liberation.hideHeroPanel(),
    openGmLedger: () => {
      GmLedgerApp.open();
    },
    openPitaxScene: (sceneName) => openPitaxScene(sceneName),
  };
  // `api` is the Foundry convention for a public API, but isn't a typed field on Module.
  if (module) (module as { api?: ModuleApi }).api = api;
  console.log(`${MODULE_ID} | ready (v${version})`);
});
