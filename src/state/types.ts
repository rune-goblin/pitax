import type { Degree, FavorStatus } from '@/data/types';

export interface LogEntry {
  id: string;
  text: string;
  delta: number;
  at: number;
}

export interface LiberationState {
  version: 1;
  lp: number;
  locStatus: Record<string, Degree | null>;
  favor: Record<string, FavorStatus>;
  log: LogEntry[];
  visible: boolean;
}

export const DEFAULT_STATE: LiberationState = {
  version: 1,
  lp: 1,
  locStatus: {},
  favor: {},
  log: [],
  visible: false,
};
