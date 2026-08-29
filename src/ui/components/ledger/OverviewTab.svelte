<script lang="ts">
  import { liberation } from '@/state/liberationStore.svelte';
  import { LOCATIONS } from '@/data/locations';
  import { FACTIONS } from '@/data/factions';
  import { ADJUSTMENTS } from '@/data/adjustments';

  function rollAdjustment(roll: string): number {
    // "1d4+2" style — the only rolled adjustment in the book (skipped Lie Low).
    const m = /^(\d+)d(\d+)([+-]\d+)?$/.exec(roll);
    if (!m) return 0;
    const count = Number(m[1]);
    const sides = Number(m[2]);
    const mod = m[3] ? Number(m[3]) : 0;
    let total = mod;
    for (let i = 0; i < count; i++) total += 1 + Math.floor(Math.random() * sides);
    return -total;
  }

  function applyAdjustment(id: string): void {
    const adj = ADJUSTMENTS.find((a) => a.id === id);
    if (!adj) return;
    const delta = adj.roll ? rollAdjustment(adj.roll) : (adj.delta ?? 0);
    liberation.adjustLp(delta, adj.label);
  }

  function triggerWarden(): void {
    liberation.logWardenPatrol('⚔ Warden Patrol triggered — Low 14, 3× Pitax Wardens (Perception 22)');
  }

  const refuges = $derived([
    ...LOCATIONS.filter((l) => liberation.locStatus[l.id] === 'critical-success' && l.bonus).map((l) => l.name),
    ...FACTIONS.filter((f) => liberation.favor[f.id] === 'allied').map((f) => `${f.name} HQ`),
  ]);
</script>

<div class="overview">
  <div class="section-label">Liberation Points</div>
  <div class="lp-control">
    <button type="button" class="step-btn" onclick={() => liberation.adjustLp(-1, 'Manual adjustment')}>−</button>
    <div class="big">{liberation.lp}</div>
    <button type="button" class="step-btn" onclick={() => liberation.adjustLp(1, 'Manual adjustment')}>+</button>
    <div class="meta">0 LP: −4 penalty · 30 LP: wardens gone</div>
  </div>

  <div class="section-label">Quick adjustments</div>
  <div class="chip-grid">
    {#each ADJUSTMENTS as adj (adj.id)}
      <button type="button" class="adj-btn" onclick={() => applyAdjustment(adj.id)}>
        <span>{adj.label}</span>
        <span class="delta" class:pos={(adj.delta ?? -1) > 0} class:neg={adj.roll || (adj.delta ?? 0) < 0}>
          {adj.roll ? `−${adj.roll}` : `${(adj.delta ?? 0) > 0 ? '+' : ''}${adj.delta} LP`}
        </span>
      </button>
    {/each}
  </div>

  <button type="button" class="warden-btn" onclick={triggerWarden}>
    ⚔ Trigger Warden Patrol — Low 14 (3× Pitax Warden, Perception 22)
  </button>

  <div class="section-label">Refuges &amp; boons unlocked</div>
  <div class="refuge-list">
    {#if refuges.length}
      {#each refuges as r (r)}<span class="refuge-pill">{r}</span>{/each}
    {:else}
      <span class="empty">None yet — critical successes at locations or factions grant safe havens.</span>
    {/if}
  </div>

  <div class="section-label">Activity log</div>
  <div class="log">
    {#if liberation.log.length}
      {#each liberation.log as entry (entry.id)}
        <div class="log-row">
          <span>{entry.text}</span>
          <span class="d" class:pos={entry.delta > 0} class:neg={entry.delta < 0}>
            {entry.delta !== 0 ? `${entry.delta > 0 ? '+' : ''}${entry.delta}` : '—'}
          </span>
        </div>
      {/each}
    {:else}
      <div class="empty">No adjustments logged yet.</div>
    {/if}
  </div>
</div>

<style>
  .overview {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }
  .section-label {
    font-family: var(--pitax-font-display);
    font-size: 0.66rem;
    letter-spacing: 0.06em;
    color: var(--pitax-ink-faint);
    margin: 0.2rem 0 -0.15rem;
  }
  .lp-control {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid var(--pitax-line);
    border-radius: 8px;
    padding: 0.6rem 0.7rem;
  }
  .big {
    font-family: var(--pitax-font-mono);
    font-size: 1.9rem;
    font-weight: 600;
    color: var(--pitax-gold-bright);
    min-width: 2.6ch;
    text-align: center;
  }
  .step-btn {
    width: 2rem;
    height: 2rem;
    border-radius: 6px;
    background: var(--pitax-panel-2);
    border: 1px solid var(--pitax-line-strong);
  }
  .meta {
    flex: 1;
    font-size: 0.72rem;
    color: var(--pitax-ink-faint);
    font-family: var(--pitax-font-mono);
  }
  .chip-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.4rem;
  }
  .adj-btn {
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    padding: 0.45rem 0.6rem;
    border-radius: 7px;
    border: 1px solid var(--pitax-line);
    background: rgba(0, 0, 0, 0.15);
    font-size: 0.72rem;
    color: var(--pitax-ink-dim);
  }
  .adj-btn:hover {
    border-color: var(--pitax-gold-dim);
  }
  .delta {
    font-family: var(--pitax-font-mono);
    font-weight: 600;
    font-size: 0.8rem;
    color: var(--pitax-warn);
  }
  .delta.pos {
    color: var(--pitax-good);
  }
  .delta.neg {
    color: var(--pitax-danger);
  }
  .warden-btn {
    padding: 0.55rem;
    border-radius: 8px;
    border: 1px dashed rgba(189, 85, 85, 0.5);
    color: var(--pitax-danger);
    font-family: var(--pitax-font-mono);
    font-size: 0.74rem;
  }
  .warden-btn:hover {
    background: var(--pitax-danger-dim);
  }
  .refuge-list {
    font-size: 0.74rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }
  .refuge-pill {
    background: var(--pitax-good-dim);
    color: var(--pitax-good);
    border: 1px solid rgba(107, 165, 121, 0.4);
    padding: 0.16rem 0.55rem;
    border-radius: 20px;
    font-size: 0.68rem;
  }
  .empty {
    color: var(--pitax-ink-faint);
    font-size: 0.72rem;
    font-style: italic;
  }
  .log {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    max-height: 190px;
    overflow: auto;
    border: 1px solid var(--pitax-line);
    border-radius: 8px;
    padding: 0.5rem 0.6rem;
    background: rgba(0, 0, 0, 0.18);
  }
  .log-row {
    display: flex;
    justify-content: space-between;
    gap: 0.6rem;
    font-size: 0.72rem;
    color: var(--pitax-ink-dim);
    line-height: 1.4;
  }
  .log-row .d {
    font-family: var(--pitax-font-mono);
    flex: 0 0 auto;
  }
  .log-row .d.pos {
    color: var(--pitax-good);
  }
  .log-row .d.neg {
    color: var(--pitax-danger);
  }
</style>
