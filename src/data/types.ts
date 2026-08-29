export type LocationKind = 'opportunity' | 'favor' | 'both' | 'quest' | 'palace';
export type Degree = 'critical-success' | 'success' | 'failure' | 'critical-failure';
export type FavorStatus = 'none' | 'favored' | 'allied' | 'hostile';

export interface FactionData {
  id: string;
  name: string;
  type: string;
  hq: string;
  color: string;
  symbol: string;
  skills: string;
  note?: string;
}

export interface LocationData {
  code: string;
  id: string;
  name: string;
  kind: LocationKind;
  skills?: string;
  faction?: string;
  npc?: string;
  text: string;
  bonus?: string;
}

export interface NpcData {
  id: string;
  name: string;
  meta: string;
  role?: string;
  loc?: string;
  blurb: string;
  journalPage?: string;
}

export interface ActivityDef {
  name: string;
  dc?: number;
  crit?: number;
  success?: number;
  critFail?: number;
  note?: string;
}

export interface AdjustmentDef {
  id: string;
  label: string;
  delta?: number;
  roll?: string;
}
