<script lang="ts">
  import { liberation } from '@/state/liberationStore.svelte';
  import { FACTIONS } from '@/data/factions';
  import { LOCATIONS } from '@/data/locations';
  import { moodFor, MOOD_INFO, LP_STREETS_TURN } from '@/data/rules';

  let moodOpen = $state(false);

  const mood = $derived(moodFor(liberation.lp));
  const pct = $derived(Math.min(liberation.lp / LP_STREETS_TURN, 1) * 100);

  const refugeCount = $derived(
    LOCATIONS.filter((l) => liberation.locStatus[l.id] === 'critical-success' && l.bonus).length +
      FACTIONS.filter((f) => liberation.favor[f.id] === 'allied').length,
  );
  const wardenCount = $derived(liberation.log.filter((entry) => entry.text.startsWith('⚔')).length);
</script>

<div class="hero-body">
  <div class="hero-title-row">
    <div class="hero-title">{game.i18n.localize('pitax.hero.heading')}</div>
    <div class="mood-wrap">
      <button type="button" class="hero-mood" data-tier={mood.tier} onclick={() => (moodOpen = !moodOpen)}>
        {mood.label}
      </button>
      {#if moodOpen}
        <div class="mood-pop" role="note">{MOOD_INFO[mood.tier]}</div>
      {/if}
    </div>
  </div>

  <div class="lp-gauge-row">
    <div class="lp-number">{liberation.lp}<small>&nbsp;LP</small></div>
    <div class="lp-track-wrap">
      <div class="lp-track">
        <div class="lp-fill" class:crisis={liberation.lp === 0} style:width={`${pct}%`}></div>
        <div class="lp-mark"></div>
        <div class="lp-mark-label">{LP_STREETS_TURN} — streets turn</div>
      </div>
    </div>
  </div>

  <details class="faction-disclosure">
    <summary>{game.i18n.localize('pitax.hero.factions')}</summary>
    <div class="faction-row">
      {#each FACTIONS as f (f.id)}
        <div class="faction-chip" data-favor={liberation.favor[f.id] ?? 'none'} title={`${f.name} — ${f.symbol}`}>
          <span class="faction-swatch" style:background={f.color}></span>
          <span>{f.name.replace(' Family', '')}</span>
        </div>
      {/each}
    </div>
  </details>

  <div class="hero-foot">
    {refugeCount} {refugeCount === 1 ? 'refuge' : 'refuges'} discovered · {wardenCount} warden {wardenCount === 1 ? 'encounter' : 'encounters'}
  </div>
</div>

<style>
  .hero-body {
    padding: 0.9rem 1.2rem 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    background: var(--pitax-marquee);
  }
  .hero-title-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
  }
  .hero-title {
    font-family: var(--pitax-font-display);
    font-weight: 600;
    font-size: 1.4rem;
    color: var(--pitax-gold-bright);
  }
  .mood-wrap {
    position: relative;
  }
  .hero-mood {
    font-family: var(--pitax-font-mono);
    font-size: 0.72rem;
    letter-spacing: 0.04em;
    padding: 0.22em 0.6em;
    border-radius: 20px;
    white-space: nowrap;
    border: 1px solid transparent;
    background: none;
    cursor: pointer;
  }
  .hero-mood[data-tier='crisis'] { color: var(--pitax-danger); background: var(--pitax-danger-dim); border-color: rgba(189, 85, 85, 0.4); }
  .hero-mood[data-tier='low'] { color: var(--pitax-ink-dim); background: rgba(236, 227, 230, 0.06); border-color: var(--pitax-line-strong); }
  .hero-mood[data-tier='mid'] { color: var(--pitax-warn); background: var(--pitax-warn-dim); border-color: rgba(201, 138, 63, 0.4); }
  .hero-mood[data-tier='high'] { color: var(--pitax-gold-bright); background: var(--pitax-gold-dim); border-color: rgba(201, 162, 75, 0.5); }
  .hero-mood[data-tier='won'] { color: #eafff0; background: var(--pitax-good-dim); border-color: rgba(107, 165, 121, 0.55); }
  .mood-pop {
    position: absolute;
    z-index: 5;
    top: calc(100% + 6px);
    right: 0;
    width: 240px;
    background: var(--pitax-panel-2);
    border: 1px solid var(--pitax-gold-dim);
    border-radius: 8px;
    padding: 0.6rem 0.7rem;
    font-size: 0.74rem;
    line-height: 1.45;
    color: var(--pitax-ink-dim);
    box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.6);
  }
  .lp-gauge-row {
    display: flex;
    align-items: flex-end;
    gap: 0.8rem;
  }
  .lp-number {
    font-family: var(--pitax-font-mono);
    font-weight: 600;
    font-size: 2.2rem;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .lp-number small {
    font-size: 0.85rem;
    color: var(--pitax-ink-faint);
    font-weight: 400;
  }
  .lp-track-wrap {
    flex: 1;
    padding-bottom: 0.35rem;
  }
  .lp-track {
    position: relative;
    height: 10px;
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid var(--pitax-line);
  }
  .lp-fill {
    position: absolute;
    inset: 0;
    border-radius: 6px;
    background: linear-gradient(90deg, #8a6a2c, var(--pitax-gold) 60%, var(--pitax-gold-bright));
    transition: width 420ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .lp-fill.crisis {
    background: linear-gradient(90deg, #6b2c2c, var(--pitax-danger));
  }
  .lp-mark {
    position: absolute;
    top: -3px;
    bottom: -3px;
    right: 0;
    width: 2px;
    background: var(--pitax-good);
    opacity: 0.9;
  }
  .lp-mark-label {
    position: absolute;
    top: 12px;
    right: 0;
    font-family: var(--pitax-font-mono);
    font-size: 0.62rem;
    color: var(--pitax-ink-faint);
    white-space: nowrap;
  }
  .faction-disclosure summary {
    cursor: pointer;
    font-family: var(--pitax-font-mono);
    font-size: 0.68rem;
    color: var(--pitax-ink-faint);
  }
  .faction-row {
    display: flex;
    gap: 0.45rem;
    flex-wrap: wrap;
    margin-top: 0.45rem;
  }
  .faction-chip {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.28rem 0.55rem 0.28rem 0.4rem;
    border-radius: 20px;
    background: rgba(0, 0, 0, 0.22);
    border: 1px solid var(--pitax-line);
    font-size: 0.72rem;
    color: var(--pitax-ink-dim);
  }
  .faction-chip[data-favor='favored'] { border-color: var(--pitax-gold-dim); color: var(--pitax-ink); }
  .faction-chip[data-favor='allied'] { border-color: var(--pitax-gold); background: var(--pitax-gold-dim); color: var(--pitax-gold-bright); }
  .faction-chip[data-favor='hostile'] { border-color: rgba(189, 85, 85, 0.5); color: var(--pitax-danger); text-decoration: line-through; }
  .faction-swatch {
    width: 12px;
    height: 12px;
    border-radius: 3px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.4) inset;
  }
  .hero-foot {
    font-family: var(--pitax-font-mono);
    font-size: 0.68rem;
    color: var(--pitax-ink-faint);
    border-top: 1px solid var(--pitax-line);
    padding-top: 0.6rem;
  }
</style>
