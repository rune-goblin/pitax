import { skillLabelToSlug } from '@/data/skills';

export interface RollRequestOptions {
  skillLabel: string;
  dc: number;
  label: string;
  showDcToPlayers?: boolean;
}

// Posts a PF2e inline-check request (`@Check[...]`) to chat — a clickable card any player can
// click to roll their own selected/assigned character against the DC. The system's own
// TextEditor enricher (registered globally by PF2e) and its click handler do the rest; this
// module never rolls on the players' behalf.
export async function postRollRequest({ skillLabel, dc, label, showDcToPlayers = true }: RollRequestOptions): Promise<void> {
  const type = skillLabelToSlug(skillLabel);
  const showDc = showDcToPlayers ? 'all' : 'gm';
  const checkText = `@Check[type:${type}|dc:${dc}|showDC:${showDc}]{${label}}`;
  const content = await foundry.applications.ux.TextEditor.enrichHTML(checkText);
  const ChatMessageCls = getDocumentClass('ChatMessage');
  await ChatMessageCls.create({ content, speaker: ChatMessageCls.getSpeaker() });
}
