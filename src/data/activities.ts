import type { ActivityDef } from './types';

export const ACTIVITIES = {
  gainFactionFavor: { name: 'Gain Faction Favor', dc: 32, crit: 2, success: 1, critFail: -1 } satisfies ActivityDef,
  pursueOpportunity: { name: 'Pursue Opportunity', dc: 32, crit: 2, success: 1, critFail: -1 } satisfies ActivityDef,
  clandestineActivity: { name: 'Clandestine Activity', note: 'Deception/Society/Stealth to avoid a Warden patrol while doing ordinary business.' } satisfies ActivityDef,
  lieLow: { name: 'Lie Low', dc: 30, note: 'Stealth; automatic success in a safe spot.' } satisfies ActivityDef,
  researchFaction: { name: 'Research Faction', dc: 32, note: 'Society, secret check.' } satisfies ActivityDef,
  seekOpportunity: { name: 'Seek Opportunity', dc: 34, note: 'Perception DC 34 or Society DC 30.' } satisfies ActivityDef,
} as const;
