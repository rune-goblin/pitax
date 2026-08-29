import type { FactionData } from './types';

// Source: Kingmaker "War of the River Kings" ch. 8 pt. 4 — Infiltration, cross-checked
// against the structured rulebook-pipeline extraction.
export const FACTIONS: FactionData[] = [
  { id: 'vascari-family', name: 'Vascari Family', type: 'Bandit House', hq: 'b3', color: '#8fb6d9', symbol: "a heron", skills: 'Society or Mercantile Lore' },
  { id: 'liacenza-family', name: 'Liacenza Family', type: 'Bandit House', hq: 'b18', color: '#a44b45', symbol: "a fox's head", skills: 'Society or Mercantile Lore' },
  { id: 'strocalle-family', name: 'Strocalle Family', type: 'Bandit House', hq: 'b10', color: '#8e5fa8', symbol: 'a cracked coin', skills: 'Society or Mercantile Lore', note: '+5 DC while allied with Irovetti — waived once the other three Bandit Houses are already favored.' },
  { id: 'cattanei-family', name: 'Cattanei Family', type: 'Bandit House', hq: 'b9', color: '#5f9e6f', symbol: 'a coiled snake', skills: 'Society or Mercantile Lore' },
  { id: 'calistrians', name: 'Calistrians', type: 'Faith', hq: 'b13', color: '#c9a83f', symbol: 'three daggers', skills: 'Religion or Calistria Lore' },
  { id: 'desnans', name: 'Desnans', type: 'Faith', hq: 'b8', color: '#7fa8d9', symbol: 'a butterfly', skills: 'Religion or Desna Lore' },
  { id: 'dealers-of-pitax', name: 'Dealers of Pitax', type: 'Criminals', hq: 'b6', color: '#8a8a90', symbol: 'two X marks', skills: 'Intimidation or Underworld Lore' },
  { id: 'red-crescent-troupe', name: 'Red Crescent Troupe', type: 'Entertainers', hq: 'b17', color: '#c95f56', symbol: 'a crescent', skills: 'Performance or Theater Lore' },
];

export const factionById: Record<string, FactionData> = Object.fromEntries(FACTIONS.map((f) => [f.id, f]));
