import type { Degree, FavorStatus, FactionData } from './types';

export const BASE_DC = 32;
export const LP_STREETS_TURN = 30;

export interface MoodTier {
  tier: 'crisis' | 'low' | 'mid' | 'high' | 'won';
  label: string;
}

export function moodFor(lp: number): MoodTier {
  if (lp === 0) return { tier: 'crisis', label: 'City on Edge' };
  if (lp >= LP_STREETS_TURN) return { tier: 'won', label: 'Streets Have Turned' };
  if (lp >= 20) return { tier: 'high', label: 'Emboldened' };
  if (lp >= 10) return { tier: 'mid', label: 'Stirring' };
  return { tier: 'low', label: 'Simmering' };
}

export const MOOD_INFO: Record<MoodTier['tier'], string> = {
  crisis: 'City on Edge — LP cannot go below 0. While at 0 LP, every Liberation activity check takes a −4 status penalty. If an event would drop LP further, the GM chooses: two Warden patrols (Severe threat), or extend the penalty another 24 hours.',
  low: 'Simmering — discontent is spreading, but Irovetti’s Wardens still patrol freely. Every Liberation Point counts toward turning the streets.',
  mid: 'Stirring — the resistance is gaining real ground. Keep pushing toward 30 LP, where the streets turn against Irovetti for good.',
  high: 'Emboldened — Pitax openly whispers against its king. The 30-LP tipping point is close.',
  won: 'Streets Have Turned — at 30 LP, Warden patrols vanish from the streets and the palace’s defenses are stripped down for the final assault.',
};

export function clampLp(v: number): number {
  return Math.max(0, Math.round(v));
}

// B5 critical success drops all four Bandit Houses' DC by 2; B7 critical success does the
// same for the Calistrians and Desnans. Strocalle carries a +5 penalty while it's allied with
// Irovetti, waived once the other three Bandit Houses are already favored.
export function factionDc(
  faction: FactionData,
  locStatus: Record<string, Degree | null | undefined>,
  favor: Record<string, FavorStatus | undefined>,
): number {
  let dc = BASE_DC;
  if (faction.type === 'Bandit House' && locStatus.b5 === 'critical-success') dc -= 2;
  if ((faction.id === 'calistrians' || faction.id === 'desnans') && locStatus.b7 === 'critical-success') dc -= 2;
  if (faction.id === 'strocalle-family') {
    const others = ['vascari-family', 'liacenza-family', 'cattanei-family'];
    const allFavored = others.every((id) => favor[id] === 'favored' || favor[id] === 'allied');
    if (!allFavored) dc += 5;
  }
  return dc;
}

export function favorFromDegree(degree: Degree, current: FavorStatus): FavorStatus {
  if (degree === 'critical-success') return 'allied';
  if (degree === 'success') return 'favored';
  if (degree === 'critical-failure') return 'hostile';
  return current;
}
