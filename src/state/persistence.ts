import { MODULE_ID, STATE_DOC_FLAG, STATE_DOC_NAME, STATE_FLAG_KEY } from '@/constants';
import type { LiberationState } from './types';

let cachedDocId: string | null = null;

export function isStateDoc(doc: JournalEntry): boolean {
  return doc.getFlag(MODULE_ID, STATE_DOC_FLAG) === true;
}

function findStateDoc(): JournalEntry | undefined {
  return game.journal?.find((j) => isStateDoc(j));
}

export function getStateDoc(): JournalEntry | undefined {
  if (cachedDocId) {
    const cached = game.journal?.get(cachedDocId);
    if (cached) return cached;
  }
  const found = findStateDoc();
  if (found) cachedDocId = found.id;
  return found;
}

// The tracker's own state lives on a module-created JournalEntry rather than the AP's
// "8b. Liberating Pitax" journal or the Pitax scene, so it works in any world (no dependency
// on that content existing) and never touches documents the GM authored by hand.
export async function ensureStateDoc(): Promise<JournalEntry> {
  const existing = getStateDoc();
  if (existing) return existing;
  if (!game.user.isGM) {
    throw new Error('Pitax Liberation tracker has not been opened by the GM yet.');
  }
  const JournalEntryCls = getDocumentClass('JournalEntry');
  const created = (await JournalEntryCls.create({
    name: STATE_DOC_NAME,
    ownership: { default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER },
    flags: { [MODULE_ID]: { [STATE_DOC_FLAG]: true } },
  })) as JournalEntry | undefined;
  if (!created) throw new Error('Failed to create the Pitax Liberation tracker data document.');
  cachedDocId = created.id;
  return created;
}

export async function loadState(): Promise<LiberationState | undefined> {
  const doc = getStateDoc();
  if (!doc) return undefined;
  return doc.getFlag(MODULE_ID, STATE_FLAG_KEY) as LiberationState | undefined;
}

export async function persistState(state: LiberationState): Promise<void> {
  if (!game.user.isGM) return;
  const doc = await ensureStateDoc();
  await doc.setFlag(MODULE_ID, STATE_FLAG_KEY, state);
}
