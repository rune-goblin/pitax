import { mount, unmount } from 'svelte';
import HeroPanel from './components/HeroPanel.svelte';

const { ApplicationV2 } = foundry.applications.api;

// Standard framed AppV2 window: `window.resizable: true` gets drag (titlebar) and resize
// (corner handle) for free — no hand-rolled pointer-capture code needed, unlike the HTML
// concept prototype this ports.
export class HeroPanelApp extends ApplicationV2 {
  static override DEFAULT_OPTIONS = {
    id: 'pitax-hero-panel',
    tag: 'section',
    classes: ['pitax', 'pitax-hero-panel'],
    window: { title: 'pitax.hero.title', icon: 'fa-solid fa-mask', resizable: true, minimizable: true },
    position: { width: 560, height: 'auto' as const },
  };

  static #instance?: HeroPanelApp;

  #component?: ReturnType<typeof mount>;
  #root?: HTMLElement;

  static toggle(): void {
    if (this.#instance) {
      void this.#instance.close();
      return;
    }
    this.#instance = new HeroPanelApp();
    void this.#instance.render({ force: true });
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
