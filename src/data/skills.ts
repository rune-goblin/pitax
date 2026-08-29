import type { LocationData } from './types';
import { factionById } from './factions';

export const ALL_SKILLS = [
  'Acrobatics', 'Arcana', 'Athletics', 'Crafting', 'Deception', 'Diplomacy', 'Intimidation',
  'Medicine', 'Nature', 'Occultism', 'Perception', 'Performance', 'Religion', 'Society',
  'Stealth', 'Survival', 'Thievery', 'Lore',
];

const KNOWN_SLUGS: Record<string, string> = {
  Acrobatics: 'acrobatics', Arcana: 'arcana', Athletics: 'athletics', Crafting: 'crafting',
  Deception: 'deception', Diplomacy: 'diplomacy', Intimidation: 'intimidation', Medicine: 'medicine',
  Nature: 'nature', Occultism: 'occultism', Perception: 'perception', Performance: 'performance',
  Religion: 'religion', Society: 'society', Stealth: 'stealth', Survival: 'survival', Thievery: 'thievery',
};

// PF2e lore skills slug as "<name>-lore" (e.g. "Mercantile Lore" -> "mercantile-lore"); every
// other skill has a fixed slug the system recognizes for @Check.
export function skillLabelToSlug(label: string): string {
  return KNOWN_SLUGS[label] ?? label.toLowerCase().replace(/\s+/g, '-');
}

export function parseSkillList(text: string | undefined): string[] {
  if (!text) return [];
  return text
    .replace(/\(trained\)/gi, '')
    .split(/,| or | then /i)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function getSkillOptions(loc: LocationData): string[] {
  let opts: string[] = [];
  if ((loc.kind === 'favor' || loc.kind === 'both') && loc.faction) {
    opts = opts.concat(parseSkillList(factionById[loc.faction]?.skills));
  }
  if (loc.skills) opts = opts.concat(parseSkillList(loc.skills));
  const deduped = [...new Set(opts)];
  return deduped.length ? deduped : ALL_SKILLS.slice();
}
