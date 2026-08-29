<script lang="ts">
  import { liberation } from '@/state/liberationStore.svelte';
  import { LOCATIONS } from '@/data/locations';
  import { factionById } from '@/data/factions';
  import { factionDc, BASE_DC } from '@/data/rules';
  import { getSkillOptions } from '@/data/skills';
  import { openLocationJournalPage } from '@/state/journalLink';
  import DcRollChip from '../DcRollChip.svelte';
  import type { Degree } from '@/data/types';

  const KIND_LABEL: Record<string, string> = {
    opportunity: 'Opportunity',
    favor: 'Favor',
    both: 'Opportunity + Favor',
    quest: 'Quest',
    palace: 'Palace',
  };

  let openRow = $state<string | null>(null);

  function toggle(id: string): void {
    openRow = openRow === id ? null : id;
  }

  const RESULTS: { id: Degree; label: string }[] = [
    { id: 'critical-success', label: 'Critical success' },
    { id: 'success', label: 'Success' },
    { id: 'failure', label: 'Failure' },
    { id: 'critical-failure', label: 'Critical failure' },
  ];
</script>

<div class="loc-header">B1 – B19 · every Gain Faction Favor / Pursue Opportunity is DC {BASE_DC} unless noted</div>

<div class="loc-list">
  {#each LOCATIONS as loc (loc.id)}
    {@const status = liberation.locStatus[loc.id]}
    {@const dc = loc.kind === 'favor' || loc.kind === 'both' ? factionDc(factionById[loc.faction ?? ''], liberation.locStatus, liberation.favor) : BASE_DC}
    <div class="loc-row" class:open={openRow === loc.id}>
      <button type="button" class="loc-row-head" onclick={() => toggle(loc.id)}>
        <span class="chev">▸</span>
        <span class="loc-num">{loc.code}</span>
        <span class="status-dot" data-status={status ?? ''}></span>
        <span class="loc-name">{loc.name}</span>
        <span class="kind-badge">{KIND_LABEL[loc.kind]}</span>
        <span
          class="journal-btn"
          role="button"
          tabindex="0"
          title="Open journal page"
          onclick={(e) => { e.stopPropagation(); openLocationJournalPage(loc.id); }}
          onkeydown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); openLocationJournalPage(loc.id); } }}
        >📖</span>
      </button>
      {#if openRow === loc.id}
        <div class="loc-row-body">
          <p>{loc.text}</p>
          <div class="loc-meta-line">
            {#if loc.kind !== 'palace'}
              <DcRollChip {dc} skills={getSkillOptions(loc)} label={`${loc.code} ${loc.name} — ${KIND_LABEL[loc.kind]}`} />
            {/if}
            {#if loc.npc}<span class="npc-chip">{loc.npc}</span>{/if}
          </div>
          {#if loc.bonus}
            <div class="bonus-line"><b>Critical success bonus —</b> {loc.bonus}</div>
          {/if}
          {#if loc.kind !== 'palace'}
            <div class="result-btns">
              {#each RESULTS as r (r.id)}
                <button type="button" class="result-btn {r.id}" onclick={() => liberation.markLocation(loc.id, r.id)}>
                  {r.label}
                </button>
              {/each}
            </div>
            {#if status}
              <button type="button" class="reset-link" onclick={() => liberation.resetLocation(loc.id)}>reset outcome</button>
            {/if}
          {/if}
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .loc-header {
    font-family: var(--pitax-font-display);
    font-size: 0.66rem;
    letter-spacing: 0.06em;
    color: var(--pitax-ink-faint);
    margin-bottom: 0.5rem;
  }
  .loc-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .loc-row {
    border: 1px solid var(--pitax-line);
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.15);
    overflow: visible;
  }
  .loc-row-head {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.5rem 0.6rem;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
  }
  .chev {
    color: var(--pitax-ink-faint);
    transition: transform 140ms ease;
  }
  .loc-row.open .chev {
    transform: rotate(90deg);
  }
  .loc-num {
    font-family: var(--pitax-font-mono);
    font-size: 0.68rem;
    color: var(--pitax-ink-faint);
    width: 2.4ch;
  }
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--pitax-ink-faint);
    opacity: 0.5;
  }
  .status-dot[data-status='critical-success'] { background: var(--pitax-gold-bright); opacity: 1; }
  .status-dot[data-status='success'] { background: var(--pitax-good); opacity: 1; }
  .status-dot[data-status='failure'] { background: var(--pitax-warn); opacity: 1; }
  .status-dot[data-status='critical-failure'] { background: var(--pitax-danger); opacity: 1; }
  .loc-name {
    flex: 1;
    font-weight: 600;
    font-size: 0.86rem;
    color: var(--pitax-ink);
  }
  .kind-badge {
    font-family: var(--pitax-font-mono);
    font-size: 0.6rem;
    padding: 0.14rem 0.42rem;
    border-radius: 4px;
    color: var(--pitax-ink-faint);
    background: rgba(236, 227, 230, 0.06);
    border: 1px solid var(--pitax-line);
    white-space: nowrap;
  }
  .journal-btn {
    width: 1.5rem;
    height: 1.5rem;
    display: grid;
    place-items: center;
    border-radius: 5px;
    color: var(--pitax-ink-faint);
    cursor: pointer;
  }
  .journal-btn:hover {
    background: var(--pitax-panel-2);
    color: var(--pitax-gold-bright);
  }
  .loc-row-body {
    padding: 0 0.7rem 0.7rem;
    font-size: 0.78rem;
    color: var(--pitax-ink-dim);
    line-height: 1.5;
  }
  .loc-row-body p {
    margin: 0.2rem 0 0;
  }
  .loc-meta-line {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin: 0.4rem 0 0.5rem;
  }
  .npc-chip {
    background: rgba(236, 227, 230, 0.05);
    color: var(--pitax-ink-dim);
    border: 1px solid var(--pitax-line);
    padding: 0.14rem 0.45rem;
    border-radius: 4px;
    font-family: var(--pitax-font-mono);
    font-size: 0.68rem;
  }
  .bonus-line {
    margin-top: 0.4rem;
    padding: 0.4rem 0.5rem;
    border-left: 2px solid var(--pitax-gold-dim);
    background: rgba(201, 162, 75, 0.06);
    font-size: 0.74rem;
    color: var(--pitax-ink);
  }
  .bonus-line b {
    color: var(--pitax-gold-bright);
  }
  .result-btns {
    display: flex;
    gap: 0.35rem;
    margin-top: 0.55rem;
    flex-wrap: wrap;
  }
  .result-btn {
    font-family: var(--pitax-font-mono);
    font-size: 0.66rem;
    padding: 0.3rem 0.55rem;
    border-radius: 5px;
    border: 1px solid var(--pitax-line-strong);
    color: var(--pitax-ink-dim);
  }
  .result-btn:hover {
    border-color: var(--pitax-gold-dim);
    color: var(--pitax-ink);
  }
  .result-btn.critical-success { color: var(--pitax-gold-bright); }
  .result-btn.success { color: var(--pitax-good); }
  .result-btn.failure { color: var(--pitax-warn); }
  .result-btn.critical-failure { color: var(--pitax-danger); }
  .reset-link {
    font-family: var(--pitax-font-mono);
    font-size: 0.64rem;
    color: var(--pitax-ink-faint);
    text-decoration: underline;
    margin-top: 0.5rem;
    background: none;
    border: none;
  }
  .reset-link:hover {
    color: var(--pitax-ink);
  }
</style>
