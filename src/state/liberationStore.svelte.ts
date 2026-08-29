import { locationById } from '@/data/locations';
import { ACTIVITIES } from '@/data/activities';
import { clampLp, favorFromDegree } from '@/data/rules';
import type { Degree, FavorStatus } from '@/data/types';
import type { LiberationState, LogEntry } from './types';
import { DEFAULT_STATE } from './types';
import { persistState } from './persistence';

class LiberationStore {
  lp = $state(DEFAULT_STATE.lp);
  locStatus = $state<Record<string, Degree | null>>({});
  favor = $state<Record<string, FavorStatus>>({});
  log = $state<LogEntry[]>([]);

  apply(next: LiberationState): void {
    this.lp = next.lp;
    this.locStatus = { ...next.locStatus };
    this.favor = { ...next.favor };
    this.log = [...next.log];
  }

  snapshot(): LiberationState {
    return {
      version: 1,
      lp: this.lp,
      locStatus: { ...this.locStatus },
      favor: { ...this.favor },
      log: [...this.log],
    };
  }

  #publish(): void {
    void persistState(this.snapshot());
  }

  #logAndSetLp(delta: number, text: string): void {
    const before = this.lp;
    let next = before + delta;
    let note = text;
    if (next < 0) {
      next = 0;
      note += ' — would drop below 0: GM choice (Warden patrol or extended penalty)';
    }
    this.lp = clampLp(next);
    this.log = [
      { id: foundry.utils.randomID(), text: note, delta: this.lp - before, at: Date.now() },
      ...this.log,
    ].slice(0, 60);
  }

  adjustLp(delta: number, text: string): void {
    if (!game.user.isGM) return;
    this.#logAndSetLp(delta, text);
    this.#publish();
  }

  markLocation(locationId: string, result: Degree): void {
    if (!game.user.isGM) return;
    const loc = locationById[locationId];
    if (!loc) return;
    const act = loc.kind === 'favor' ? ACTIVITIES.gainFactionFavor : ACTIVITIES.pursueOpportunity;
    const delta =
      result === 'critical-success' ? (act.crit ?? 0) :
      result === 'success' ? (act.success ?? 0) :
      result === 'critical-failure' ? (act.critFail ?? 0) : 0;
    this.locStatus = { ...this.locStatus, [locationId]: result };
    if ((loc.kind === 'favor' || loc.kind === 'both') && loc.faction) {
      const current = this.favor[loc.faction] ?? 'none';
      this.favor = { ...this.favor, [loc.faction]: favorFromDegree(result, current) };
    }
    this.#logAndSetLp(delta, `${loc.code} ${loc.name} — ${result.replace('-', ' ')}`);
    this.#publish();
  }

  resetLocation(locationId: string): void {
    if (!game.user.isGM) return;
    const loc = locationById[locationId];
    if (!loc) return;
    const { [locationId]: _removed, ...rest } = this.locStatus;
    this.locStatus = rest;
    if (loc.faction) this.favor = { ...this.favor, [loc.faction]: 'none' };
    this.#publish();
  }

  applyFactionResult(factionId: string, result: Degree): void {
    if (!game.user.isGM) return;
    const act = ACTIVITIES.gainFactionFavor;
    const delta =
      result === 'critical-success' ? (act.crit ?? 0) :
      result === 'success' ? (act.success ?? 0) :
      result === 'critical-failure' ? (act.critFail ?? 0) : 0;
    const current = this.favor[factionId] ?? 'none';
    this.favor = { ...this.favor, [factionId]: favorFromDegree(result, current) };
    this.#logAndSetLp(delta, `Gain Favor — ${result.replace('-', ' ')}`);
    this.#publish();
  }

  setFavor(factionId: string, status: FavorStatus): void {
    if (!game.user.isGM) return;
    this.favor = { ...this.favor, [factionId]: status };
    this.#publish();
  }

  logWardenPatrol(text: string): void {
    if (!game.user.isGM) return;
    this.#logAndSetLp(0, text);
    this.#publish();
  }
}

export const liberation = new LiberationStore();
