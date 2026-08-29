import { MODULE_ID, STATE_FLAG_KEY } from '@/constants';
import { liberation } from './liberationStore.svelte';
import { loadState, isStateDoc } from './persistence';
import type { LiberationState } from './types';

let initialized = false;

function applyIfStateDoc(doc: JournalEntry): void {
  if (!isStateDoc(doc)) return;
  const state = doc.getFlag(MODULE_ID, STATE_FLAG_KEY) as LiberationState | undefined;
  if (state) liberation.apply(state);
}

function applyChangedState(doc: JournalEntry, changes: Record<string, unknown>): void {
  if (!isStateDoc(doc)) return;
  const state = foundry.utils.getProperty(changes, `flags.${MODULE_ID}.${STATE_FLAG_KEY}`) as
    | LiberationState
    | undefined;
  if (state) liberation.apply(state);
}

// Liberation state is a flag on a module-owned JournalEntry (see persistence.ts), not a raw
// socket broadcast: the GM's write fans out to every client via Foundry's own document-update
// hooks, so there's nothing else to wire here.
export async function initLiberationSync(): Promise<void> {
  if (initialized) return;
  initialized = true;

  Hooks.on('createJournalEntry', applyIfStateDoc);
  Hooks.on('updateJournalEntry', applyChangedState);

  const state = await loadState();
  if (state) liberation.apply(state);
}
