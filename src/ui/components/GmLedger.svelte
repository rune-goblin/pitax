<script lang="ts">
  import { liberation } from '@/state/liberationStore.svelte';
  import { openPitaxScene } from '@/state/sceneMacro';
  import OverviewTab from './ledger/OverviewTab.svelte';
  import LocationsTab from './ledger/LocationsTab.svelte';
  import FactionsTab from './ledger/FactionsTab.svelte';
  import NpcsTab from './ledger/NpcsTab.svelte';

  type TabId = 'overview' | 'locations' | 'factions' | 'npcs';
  const TABS: { id: TabId; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'locations', label: 'Locations' },
    { id: 'factions', label: 'Factions' },
    { id: 'npcs', label: 'NPCs' },
  ];

  let activeTab = $state<TabId>('overview');
</script>

<div class="ledger">
  <div class="toolbar">
    <button type="button" class="scene-btn" onclick={() => void openPitaxScene()}>
      🎭 {game.i18n.localize('pitax.ledger.openScene')}
    </button>
    <div class="lp-mini">LP <b>{liberation.lp}</b></div>
  </div>

  <nav class="tabs">
    {#each TABS as tab (tab.id)}
      <button type="button" class="tab-btn" class:active={activeTab === tab.id} onclick={() => (activeTab = tab.id)}>
        {tab.label}
      </button>
    {/each}
  </nav>

  <div class="tab-body pitax-scroll">
    {#if activeTab === 'overview'}
      <OverviewTab />
    {:else if activeTab === 'locations'}
      <LocationsTab />
    {:else if activeTab === 'factions'}
      <FactionsTab />
    {:else if activeTab === 'npcs'}
      <NpcsTab />
    {/if}
  </div>
</div>

<style>
  .ledger {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--pitax-panel);
  }
  .toolbar {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.6rem;
    border-bottom: 1px solid var(--pitax-line);
    background: var(--pitax-panel-2);
  }
  .scene-btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-family: var(--pitax-font-mono);
    font-size: 0.68rem;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid var(--pitax-line-strong);
    padding: 0.32rem 0.6rem;
    border-radius: 6px;
  }
  .scene-btn:hover {
    border-color: var(--pitax-gold-dim);
    color: var(--pitax-gold-bright);
  }
  .lp-mini {
    margin-left: auto;
    font-family: var(--pitax-font-mono);
    font-size: 0.78rem;
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid var(--pitax-line-strong);
    border-radius: 6px;
    padding: 0.28rem 0.6rem;
  }
  .lp-mini b {
    color: var(--pitax-gold-bright);
  }
  .tabs {
    display: flex;
    gap: 2px;
    padding: 0.4rem 0.6rem 0;
    border-bottom: 1px solid var(--pitax-line);
  }
  .tab-btn {
    font-family: var(--pitax-font-display);
    font-size: 0.66rem;
    letter-spacing: 0.04em;
    color: var(--pitax-ink-faint);
    padding: 0.45rem 0.7rem;
    border-radius: 6px 6px 0 0;
    border-bottom: 2px solid transparent;
    background: none;
  }
  .tab-btn:hover {
    color: var(--pitax-ink-dim);
  }
  .tab-btn.active {
    color: var(--pitax-gold-bright);
    border-bottom-color: var(--pitax-gold);
  }
  .tab-body {
    flex: 1;
    min-height: 0;
    padding: 0.75rem 0.8rem 1rem;
  }
</style>
