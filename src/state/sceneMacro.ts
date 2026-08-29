import { PITAX_SCENE_NAME } from '@/constants';

// The Pitax scene lives in the GM's local Kingmaker world and is never run on this machine, so
// this looks the scene up by name (never touching it) and only imports a compendium copy as a
// last resort — it does not assume any particular server has the scene pre-placed in the world.
export async function openPitaxScene(sceneName: string = PITAX_SCENE_NAME): Promise<void> {
  const direct = game.scenes?.getName(sceneName);
  if (direct) {
    await direct.view();
    return;
  }

  if (!game.user.isGM) {
    ui.notifications?.warn(game.i18n.format('pitax.scene.missing', { name: sceneName }));
    return;
  }

  for (const pack of game.packs) {
    if (pack.documentName !== 'Scene') continue;
    const index = await pack.getIndex();
    const entry = index.find((i) => i.name === sceneName);
    if (!entry) continue;
    const source = (await pack.getDocument(entry._id)) as Scene | undefined;
    if (!source) continue;
    ui.notifications?.info(game.i18n.format('pitax.scene.importing', { name: sceneName }));
    const SceneCls = getDocumentClass('Scene');
    const [imported] = (await SceneCls.createDocuments([source.toObject()])) as Scene[];
    await imported?.view();
    return;
  }

  ui.notifications?.warn(game.i18n.format('pitax.scene.missing', { name: sceneName }));
}
