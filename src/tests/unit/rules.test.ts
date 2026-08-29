import { describe, it, expect } from 'vitest';
import { factionDc, moodFor, clampLp, favorFromDegree, BASE_DC, LP_STREETS_TURN } from '@/data/rules';
import { factionById } from '@/data/factions';

describe('clampLp', () => {
  it('never goes below 0', () => {
    expect(clampLp(-3)).toBe(0);
  });
  it('rounds fractional deltas', () => {
    expect(clampLp(4.6)).toBe(5);
  });
});

describe('moodFor', () => {
  it('is crisis at exactly 0', () => {
    expect(moodFor(0).tier).toBe('crisis');
  });
  it('is won at the streets-turn threshold', () => {
    expect(moodFor(LP_STREETS_TURN).tier).toBe('won');
  });
  it('is simmering below 10', () => {
    expect(moodFor(5).tier).toBe('low');
  });
});

describe('factionDc', () => {
  const vascari = factionById['vascari-family'];
  const strocalle = factionById['strocalle-family'];

  it('is the base DC with no modifiers', () => {
    expect(factionDc(vascari, {}, {})).toBe(BASE_DC);
  });

  it('drops by 2 for Bandit Houses once B5 is a critical success', () => {
    expect(factionDc(vascari, { b5: 'critical-success' }, {})).toBe(BASE_DC - 2);
  });

  it('does not affect non-Bandit-House factions', () => {
    const desnans = factionById.desnans;
    expect(factionDc(desnans, { b5: 'critical-success' }, {})).toBe(BASE_DC);
  });

  it('adds +5 to Strocalle unless the other three Bandit Houses are favored', () => {
    expect(factionDc(strocalle, {}, {})).toBe(BASE_DC + 5);
    expect(
      factionDc(strocalle, {}, {
        'vascari-family': 'favored',
        'liacenza-family': 'allied',
        'cattanei-family': 'favored',
      }),
    ).toBe(BASE_DC);
  });
});

describe('favorFromDegree', () => {
  it('upgrades to allied on a critical success', () => {
    expect(favorFromDegree('critical-success', 'none')).toBe('allied');
  });
  it('upgrades to favored on a success', () => {
    expect(favorFromDegree('success', 'none')).toBe('favored');
  });
  it('turns hostile on a critical failure', () => {
    expect(favorFromDegree('critical-failure', 'favored')).toBe('hostile');
  });
  it('leaves favor unchanged on a plain failure', () => {
    expect(favorFromDegree('failure', 'favored')).toBe('favored');
  });
});
