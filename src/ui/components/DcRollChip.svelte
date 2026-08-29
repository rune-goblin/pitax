<script lang="ts">
  import { postRollRequest } from '@/state/rollRequest';

  let { dc, skills, label }: { dc: number; skills: string[]; label: string } = $props();

  let open = $state(false);
  let skillOverride = $state<string | undefined>(undefined);
  const skill = $derived(skillOverride && skills.includes(skillOverride) ? skillOverride : (skills[0] ?? 'Perception'));

  const chipLabel = $derived(skills.length <= 2 ? skills.join(' / ') : 'Pick skill');

  async function post(): Promise<void> {
    await postRollRequest({ skillLabel: skill, dc, label });
    open = false;
  }
</script>

<div class="dc-chip-wrap">
  <button type="button" class="dc-chip" onclick={(e) => { e.stopPropagation(); open = !open; }}>
    {chipLabel} DC {dc} 🎲
  </button>
  {#if open}
    <div class="roll-pop" role="dialog" aria-label="Request a check">
      <div class="roll-pop-label">{label}</div>
      <div class="roll-pop-dc">DC {dc}</div>
      <label class="roll-pop-skill-row">
        <span>Skill</span>
        <select value={skill} onchange={(e) => (skillOverride = e.currentTarget.value)}>
          {#each skills as s (s)}<option value={s}>{s}</option>{/each}
        </select>
      </label>
      <div class="roll-pop-actions">
        <button type="button" class="cancel" onclick={(e) => { e.stopPropagation(); open = false; }}>Cancel</button>
        <button type="button" class="go" onclick={(e) => { e.stopPropagation(); void post(); }}>🎲 Post check to chat</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .dc-chip-wrap {
    position: relative;
    display: inline-block;
  }
  .dc-chip {
    background: rgba(201, 162, 75, 0.12);
    color: var(--pitax-gold-bright);
    border: 1px solid var(--pitax-gold-dim);
    padding: 0.14rem 0.45rem;
    border-radius: 4px;
    font-family: var(--pitax-font-mono);
    font-size: 0.68rem;
    cursor: pointer;
  }
  .dc-chip:hover {
    background: rgba(201, 162, 75, 0.26);
  }
  .roll-pop {
    position: absolute;
    z-index: 10;
    top: calc(100% + 6px);
    left: 0;
    width: 220px;
    background: var(--pitax-panel-2);
    border: 1px solid var(--pitax-gold-dim);
    border-radius: 8px;
    padding: 0.6rem 0.65rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 0.74rem;
    box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.6);
  }
  .roll-pop-label {
    font-weight: 600;
    color: var(--pitax-ink);
    line-height: 1.3;
  }
  .roll-pop-dc {
    font-family: var(--pitax-font-mono);
    color: var(--pitax-gold-bright);
    font-size: 0.7rem;
  }
  .roll-pop-skill-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .roll-pop-skill-row select {
    flex: 1;
    font-family: var(--pitax-font-mono);
    font-size: 0.72rem;
    background: rgba(0, 0, 0, 0.3);
    color: var(--pitax-ink);
    border: 1px solid var(--pitax-line-strong);
    border-radius: 4px;
    padding: 0.25em 0.4em;
  }
  .roll-pop-actions {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .roll-pop-actions .cancel {
    font-family: var(--pitax-font-mono);
    font-size: 0.68rem;
    color: var(--pitax-ink-faint);
    background: none;
    border: none;
  }
  .roll-pop-actions .go {
    flex: 1;
    background: var(--pitax-gold-dim);
    color: var(--pitax-gold-bright);
    border: 1px solid var(--pitax-gold);
    border-radius: 6px;
    padding: 0.35rem 0.5rem;
    font-family: var(--pitax-font-mono);
    font-size: 0.66rem;
  }
  .roll-pop-actions .go:hover {
    background: var(--pitax-gold);
    color: #1c1425;
  }
</style>
