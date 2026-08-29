<script lang="ts">
  import { liberation } from '@/state/liberationStore.svelte';
  import { FACTIONS } from '@/data/factions';
  import { locationById } from '@/data/locations';
  import { factionDc, BASE_DC } from '@/data/rules';
  import { parseSkillList, ALL_SKILLS } from '@/data/skills';
  import DcRollChip from '../DcRollChip.svelte';
  import type { FavorStatus } from '@/data/types';

  const FAVOR_OPTS: { id: FavorStatus; label: string }[] = [
    { id: 'none', label: 'None' },
    { id: 'favored', label: 'Favored' },
    { id: 'allied', label: 'Allied' },
    { id: 'hostile', label: 'Hostile' },
  ];
</script>

<div class="loc-header">Eight factions · base DC {BASE_DC}, modifiers applied live</div>

<div class="faction-list">
  {#each FACTIONS as f (f.id)}
    {@const dc = factionDc(f, liberation.locStatus, liberation.favor)}
    {@const favor = liberation.favor[f.id] ?? 'none'}
    {@const skills = parseSkillList(f.skills)}
    <div class="faction-card">
      <div class="faction-card-head">
        <span class="faction-swatch" style:background={f.color}></span>
        <span class="fname">{f.name}</span>
        <DcRollChip {dc} skills={skills.length ? skills : ALL_SKILLS} label={`${f.name} — Gain Faction Favor`} />
      </div>
      <div class="faction-card-meta">
        <span>{f.type}</span><span>·</span><span>HQ {locationById[f.hq].code} {locationById[f.hq].name}</span><span>·</span><span>{f.skills}</span>
      </div>
      {#if f.note}<div class="bonus-line">{f.note}</div>{/if}
      <div class="favor-select">
        {#each FAVOR_OPTS as opt (opt.id)}
          <button
            type="button"
            class="favor-opt"
            class:active={favor === opt.id}
            data-v={opt.id}
            onclick={() => liberation.setFavor(f.id, opt.id)}
          >{opt.label}</button>
        {/each}
      </div>
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
  .faction-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .faction-card {
    border: 1px solid var(--pitax-line);
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.15);
    padding: 0.6rem 0.7rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .faction-card-head {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .faction-swatch {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.4) inset;
  }
  .fname {
    font-weight: 600;
    font-size: 0.86rem;
    color: var(--pitax-ink);
    flex: 1;
  }
  .faction-card-meta {
    font-family: var(--pitax-font-mono);
    font-size: 0.68rem;
    color: var(--pitax-ink-faint);
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .bonus-line {
    padding: 0.4rem 0.5rem;
    border-left: 2px solid var(--pitax-gold-dim);
    background: rgba(201, 162, 75, 0.06);
    font-size: 0.74rem;
    color: var(--pitax-ink);
  }
  .favor-select {
    display: flex;
    gap: 0.3rem;
  }
  .favor-opt {
    flex: 1;
    text-align: center;
    font-family: var(--pitax-font-mono);
    font-size: 0.64rem;
    padding: 0.3rem 0.2rem;
    border-radius: 5px;
    border: 1px solid var(--pitax-line-strong);
    color: var(--pitax-ink-faint);
    background: none;
  }
  .favor-opt.active[data-v='none'] { border-color: var(--pitax-ink-faint); color: var(--pitax-ink); }
  .favor-opt.active[data-v='favored'] { border-color: var(--pitax-good); color: var(--pitax-good); background: var(--pitax-good-dim); }
  .favor-opt.active[data-v='allied'] { border-color: var(--pitax-gold); color: var(--pitax-gold-bright); background: var(--pitax-gold-dim); }
  .favor-opt.active[data-v='hostile'] { border-color: var(--pitax-danger); color: var(--pitax-danger); background: var(--pitax-danger-dim); }
</style>
