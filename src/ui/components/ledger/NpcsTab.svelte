<script lang="ts">
  import { NPCS } from '@/data/npcs';
  import { locationById } from '@/data/locations';
  import { openNpcJournalPage } from '@/state/journalLink';
</script>

<div class="loc-header">Named contacts, by location</div>

<div class="npc-list">
  {#each NPCS as n (n.id)}
    {@const loc = n.loc ? locationById[n.loc] : undefined}
    <div class="npc-row">
      <div class="npc-info">
        <span class="n-name">{n.name}</span>
        <span class="n-meta">{n.meta}</span>
        {#if n.role}<span class="npc-role">{n.role}</span>{/if}
        <span class="npc-blurb">{n.blurb}</span>
      </div>
      <div class="n-loc">{loc ? loc.code : '—'}</div>
      <button type="button" class="journal-btn" title="Open journal page" onclick={() => openNpcJournalPage(n)}>📖</button>
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
  .npc-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .npc-row {
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;
    padding: 0.45rem 0.55rem;
    border-radius: 6px;
    border: 1px solid var(--pitax-line);
    background: rgba(0, 0, 0, 0.12);
    font-size: 0.76rem;
  }
  .npc-info {
    flex: 1;
  }
  .n-name {
    font-weight: 600;
    color: var(--pitax-ink);
  }
  .n-meta {
    font-family: var(--pitax-font-mono);
    font-size: 0.66rem;
    color: var(--pitax-ink-faint);
    margin-left: 0.4rem;
  }
  .npc-role {
    display: block;
    font-size: 0.68rem;
    color: var(--pitax-ink-dim);
    margin-top: 0.1rem;
  }
  .npc-blurb {
    display: block;
    font-size: 0.74rem;
    color: var(--pitax-ink-dim);
    margin-top: 0.3rem;
    line-height: 1.45;
  }
  .n-loc {
    font-family: var(--pitax-font-mono);
    font-size: 0.66rem;
    color: var(--pitax-gold-dim);
    padding-top: 0.15rem;
  }
  .journal-btn {
    width: 1.5rem;
    height: 1.5rem;
    display: grid;
    place-items: center;
    border-radius: 5px;
    color: var(--pitax-ink-faint);
    background: none;
    border: none;
  }
  .journal-btn:hover {
    background: var(--pitax-panel-2);
    color: var(--pitax-gold-bright);
  }
</style>
