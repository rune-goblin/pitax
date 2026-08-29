import './styles.css';
import { MODULE_ID } from './constants';
import { initLiberationSync } from './state/sync';
import { openPitaxScene } from './state/sceneMacro';
import { HeroPanelApp } from './ui/HeroPanelApp';
import { GmLedgerApp } from './ui/GmLedgerApp';

interface ModuleApi {
  version: string;
  openHeroPanel: () => void;
  openGmLedger: () => void;
  openPitaxScene: (sceneName?: string) => Promise<void>;
}

Hooks.once('init', () => {
  console.log(`${MODULE_ID} | init`);
});

Hooks.once('ready', () => {
  void initLiberationSync();

  const module = game.modules.get(MODULE_ID);
  const version = module?.version ?? '0.0.0';
  const api: ModuleApi = {
    version,
    openHeroPanel: () => HeroPanelApp.toggle(),
    openGmLedger: () => {
      GmLedgerApp.open();
    },
    openPitaxScene: (sceneName) => openPitaxScene(sceneName),
  };
  // `api` is the Foundry convention for a public API, but isn't a typed field on Module.
  if (module) (module as { api?: ModuleApi }).api = api;
  console.log(`${MODULE_ID} | ready (v${version})`);
});
