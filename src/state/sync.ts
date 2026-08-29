import { MODULE_ID, STATE_FLAG_KEY } from '@/constants';
import { liberation } from './liberationStore.svelte';
import { loadState, isStateDoc } from './persistence';
import type { LiberationState } from './types';

let initialized = false;

export interface LiberationSyncOptions {
  // Fires after every applied state — initial load, and any later create/update — so the UI
  // layer (e.g. showing/hiding the shared marquee for this client) can react without this
  // module depending on `src/ui/*`.
  onSync?: () => void;
}

// Liberation state is a flag on a module-owned JournalEntry (see persistence.ts), not a raw
// socket broadcast: the GM's write fans out to every client via Foundry's own document-update
// hooks, so there's nothing else to wire here.
export async function initLiberationSync(options: LiberationSyncOptions = {}): Promise<void> {
  if (initialized) return;
  initialized = true;

  const { onSync } = options;

  Hooks.on('createJournalEntry', (doc: JournalEntry) => {
    if (!isStateDoc(doc)) return;
    const state = doc.getFlag(MODULE_ID, STATE_FLAG_KEY) as LiberationState | undefined;
    if (!state) return;
    liberation.apply(state);
    onSync?.();
  });

  Hooks.on('updateJournalEntry', (doc: JournalEntry, changes: Record<string, unknown>) => {
    if (!isStateDoc(doc)) return;
    // `changes` is a diff: Foundry omits nested flag keys that didn't change (e.g. toggling
    // `visible` alone drops `log`), so read the full flag off the document instead of the diff.
    const touched = foundry.utils.hasProperty(changes, `flags.${MODULE_ID}.${STATE_FLAG_KEY}`);
    if (!touched) return;
    const state = doc.getFlag(MODULE_ID, STATE_FLAG_KEY) as LiberationState | undefined;
    if (!state) return;
    liberation.apply(state);
    onSync?.();
  });

  const state = await loadState();
  if (state) liberation.apply(state);
  onSync?.();
}
