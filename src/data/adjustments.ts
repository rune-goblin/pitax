import type { AdjustmentDef } from './types';

export const ADJUSTMENTS: AdjustmentDef[] = [
  { id: 'civilian', label: 'PCs slay a Pitax civilian', delta: -5 },
  { id: 'army-defeated', label: 'A Pitax field army is defeated', delta: 2 },
  { id: 'army-lost', label: 'A Pitax field army wins a battle', delta: -2 },
  { id: 'destruction-minor', label: 'Public destruction — minor', delta: -1 },
  { id: 'destruction-severe', label: 'Public destruction — severe', delta: -5 },
  { id: 'no-lie-low', label: 'Skipped Lie Low after a Warden encounter', roll: '1d4+2' },
];
