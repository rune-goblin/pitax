import { mount, unmount } from 'svelte';
import HeroPanel from './components/HeroPanel.svelte';

const { ApplicationV2 } = foundry.applications.api;

// Standard framed AppV2 window: `window.resizable: true` gets drag (titlebar) and resize
// (corner handle) for free — no hand-rolled pointer-capture code needed, unlike the HTML
// concept prototype this ports.
//
// Visibility is GM-controlled and shared across the table (liberation.visible, synced via
// state/sync.ts), not a per-client toggle — sync() is the only open/close path, and close()
// swallows anything that didn't come through it (Esc, the titlebar X, another module) so no
// client can dismiss it out from under the rest of the table.
export class HeroPanelApp extends ApplicationV2 {
  static override DEFAULT_OPTIONS = {
    id: 'pitax-hero-panel',
    tag: 'section',
    classes: ['pitax', 'pitax-hero-panel'],
    window: { title: 'pitax.hero.title', icon: 'fa-solid fa-mask', resizable: true, minimizable: false },
    position: { width: 560, height: 'auto' as const },
  };

  static #instance?: HeroPanelApp;

  #component?: ReturnType<typeof mount>;
  #root?: HTMLElement;
  #allowClose = false;

  static sync(visible: boolean): void {
    if (visible) {
      if (!this.#instance) {
        this.#instance = new HeroPanelApp();
        void this.#instance.render({ force: true });
      }
    } else if (this.#instance) {
      const app = this.#instance;
      app.#allowClose = true;
      void app.close();
    }
  }

  override close(options?: Parameters<InstanceType<typeof ApplicationV2>['close']>[0]): Promise<this> {
    if (!this.#allowClose) return Promise.resolve(this);
    return super.close(options) as Promise<this>;
  }

  protected override async _renderHTML(): Promise<HTMLElement> {
    if (!this.#component) {
      this.#root = document.createElement('div');
      this.#component = mount(HeroPanel, { target: this.#root, props: {} });
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
    HeroPanelApp.#instance = undefined;
  }
}
