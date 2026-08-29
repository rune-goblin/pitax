import { describe, it, expect } from 'vitest';
import { parseSkillList, getSkillOptions, skillLabelToSlug, ALL_SKILLS } from '@/data/skills';
import { locationById } from '@/data/locations';

describe('skillLabelToSlug', () => {
  it('maps a known skill to its fixed slug', () => {
    expect(skillLabelToSlug('Diplomacy')).toBe('diplomacy');
  });
  it('derives a lore slug from the label', () => {
    expect(skillLabelToSlug('Mercantile Lore')).toBe('mercantile-lore');
  });
});

describe('parseSkillList', () => {
  it('splits an "or" list', () => {
    expect(parseSkillList('Society or Mercantile Lore')).toEqual(['Society', 'Mercantile Lore']);
  });
  it('splits a "then" list and strips training notes', () => {
    expect(parseSkillList('Perception, then Deception')).toEqual(['Perception', 'Deception']);
    expect(parseSkillList('Thievery (trained)')).toEqual(['Thievery']);
  });
  it('returns an empty array for nothing', () => {
    expect(parseSkillList(undefined)).toEqual([]);
  });
});

describe('getSkillOptions', () => {
  it('uses the location skill for a plain opportunity', () => {
    expect(getSkillOptions(locationById.b1)).toEqual(['Diplomacy']);
  });
  it('pulls the faction skill list for a favor-only location', () => {
    expect(getSkillOptions(locationById.b3)).toEqual(['Society', 'Mercantile Lore']);
  });
  it('falls back to every skill when nothing is specified', () => {
    const opts = getSkillOptions({ ...locationById.b1, skills: undefined });
    expect(opts).toEqual(ALL_SKILLS);
  });
});
