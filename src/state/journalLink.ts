import { PITAX_JOURNAL_NAME_HINT } from '@/constants';
import { locationById } from '@/data/locations';
import type { NpcData } from '@/data/types';

// Best-effort: the GM's own "8b. Liberating Pitax" journal isn't guaranteed to exist (or to be
// named identically) in every world, so this degrades to a notification rather than failing.
function findAdventureJournal(): JournalEntry | undefined {
  return game.journal?.find((j) => j.name.toLowerCase().includes(PITAX_JOURNAL_NAME_HINT));
}

// The v2 JournalEntrySheet still accepts a `pageId` render option to jump straight to a page
// (as v1's JournalSheet did), but the typedefs only model the v1 shape here — cast rather than
// drop the option.
type JournalSheetLike = { render: (force?: boolean, options?: { pageId?: string }) => unknown };

function openPage(journal: JournalEntry, matchers: string[], fallbackName: string): void {
  const sheet = journal.sheet as unknown as JournalSheetLike | null;
  const page = journal.pages.find((p) => matchers.some((m) => p.name.includes(m)));
  if (page) {
    sheet?.render(true, { pageId: page.id });
    return;
  }
  ui.notifications?.warn(game.i18n.format('pitax.journal.pageMissing', { name: fallbackName }));
  sheet?.render(true);
}

export function openLocationJournalPage(locationId: string): void {
  const loc = locationById[locationId];
  if (!loc) return;
  const journal = findAdventureJournal();
  if (!journal) {
    ui.notifications?.warn(game.i18n.format('pitax.journal.missing', { name: loc.name }));
    return;
  }
  openPage(journal, [loc.code, loc.name], loc.name);
}

export function openNpcJournalPage(npc: NpcData): void {
  if (npc.loc) {
    openLocationJournalPage(npc.loc);
    return;
  }
  const journal = findAdventureJournal();
  if (!journal) {
    ui.notifications?.warn(game.i18n.format('pitax.journal.missing', { name: npc.name }));
    return;
  }
  openPage(journal, [npc.journalPage ?? npc.name], npc.name);
}
