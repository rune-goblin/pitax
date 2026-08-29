import { mount, unmount } from 'svelte';
import GmLedger from './components/GmLedger.svelte';

const { ApplicationV2 } = foundry.applications.api;

export class GmLedgerApp extends ApplicationV2 {
  static override DEFAULT_OPTIONS = {
    id: 'pitax-gm-ledger',
    tag: 'section',
    classes: ['pitax', 'pitax-gm-ledger'],
    window: { title: 'pitax.ledger.title', icon: 'fa-solid fa-scroll', resizable: true, minimizable: true },
    position: { width: 460, height: 560 },
  };

  static #instance?: GmLedgerApp;

  #component?: ReturnType<typeof mount>;
  #root?: HTMLElement;

  static open(): GmLedgerApp | undefined {
    if (!game.user.isGM) {
      ui.notifications?.warn(game.i18n.localize('pitax.ledger.gmOnly'));
      return undefined;
    }
    if (this.#instance) {
      void this.#instance.render({ force: true });
      this.#instance.bringToFront();
      return this.#instance;
    }
    this.#instance = new GmLedgerApp();
    void this.#instance.render({ force: true });
    return this.#instance;
  }

  protected override async _renderHTML(): Promise<HTMLElement> {
    if (!this.#component) {
      this.#root = document.createElement('div');
      this.#component = mount(GmLedger, { target: this.#root, props: {} });
    }
    return this.#root!;
  }

  protected override _replaceHTML(result: HTMLElement, content: HTMLElement): void {
    content.replaceChildren(result);
  }

  protected override async _preClose(): Promise<void> {
    if (this.#component) {
      unmount(this.#component);
      this.#component = undefined;
      this.#root = undefined;
    }
    GmLedgerApp.#instance = undefined;
  }
}
