/* ภาพของเกมเขาวงกตแสง 2.5D — ภาพจาก Codex ดู output/orbmaze-art/README.md และ CODEX_ORBMAZE_ART_BRIEF.md
 * ผนังและพื้นวาดด้วยโค้ด (render/lightMazeRenderer.ts) แล้ว map texture หน้าตรงลงแต่ละหน้าของปริซึม
 * จุดยึดของ sprite และมุมข้าวหลามตัดบนเกาะ วัดด้วย scripts/measure-orbmaze-art.mjs → v2/manifest.json ห้ามกะด้วยตา
 */
import type { SeekerId, Theme } from './lightMaze';

export const LM_BASE = '/games/light-maze/v2';

/** สีของแต่ละธีม ใช้ทั้งเป็นสีทับ texture และเป็นภาพสำรองตอนภาพยังโหลดไม่เสร็จ */
/** floorDim / topLift = ปรับแสงทับ texture (0–1): พื้นมืดลง หน้าบนผนังสว่างขึ้น ให้หน้าบนเด่นกว่าหน้าข้างแบบ Mock */
export type Palette = { floor: string; floorAlt: string; top: string; side: string; glow: string; rim: string; cliff: string; sky: string; floorDim: number; topLift: number };
export const LM_PALETTES: Record<Theme, Palette> = {
  // แบบภาพ Mock: หินน้ำเงินเทาเข้ม ร่องแสงส้มทอง
  neon: { floor: '#3d4f7a', floorAlt: '#46598a', top: '#56668f', side: '#2c3658', glow: '#ffb547', rim: '#d7a53c', cliff: '#27365e', sky: '#1d2b57', floorDim: 0.3, topLift: 0.14 },
  grove: { floor: '#2f6b6a', floorAlt: '#37797a', top: '#4f8f8a', side: '#1f4c4f', glow: '#7af0c8', rim: '#d7b04a', cliff: '#1f4a4f', sky: '#163a4a', floorDim: 0.2, topLift: 0.12 },
  sky: { floor: '#8fb3d9', floorAlt: '#9cc0e4', top: '#dce9f6', side: '#7d9cc4', glow: '#6fd8ff', rim: '#e3b84e', cliff: '#6d8fbd', sky: '#4a6fae', floorDim: 0.08, topLift: 0.05 },
};

export const LM_THEME_ART = (theme: Theme) => ({
  backdrop: `${LM_BASE}/backdrop-${theme}.webp`,
  island: `${LM_BASE}/island-${theme}.webp`,
  floor: `${LM_BASE}/textures/${theme}-floor.webp`,
  wallTop: `${LM_BASE}/textures/${theme}-walltop.webp`,
  wallSide: `${LM_BASE}/textures/${theme}-wallside.webp`,
});

export const LM_ACTOR_ART = (id: 'orb' | SeekerId) => ({
  se: `${LM_BASE}/actors/${id}-se.webp`,
  ne: `${LM_BASE}/actors/${id}-ne.webp`,
  rest: id === 'orb' ? null : `${LM_BASE}/actors/${id}-rest.webp`,
});

export const LM_ITEM_ART = { star: `${LM_BASE}/items/star.webp`, clock: `${LM_BASE}/items/clock.webp`, shield: `${LM_BASE}/items/shield.webp`, portal: `${LM_BASE}/items/portal.webp` };
export const LM_PROP_ART = { crystal: `${LM_BASE}/props/crystal.webp`, arch: `${LM_BASE}/props/arch.webp`, lantern: `${LM_BASE}/props/lantern.webp`, charger: `${LM_BASE}/props/charger.webp`, palm: `${LM_BASE}/props/palm.webp`, shrub: `${LM_BASE}/props/shrub.webp`, post: `${LM_BASE}/props/post.webp` };
export const LM_MANIFEST = `${LM_BASE}/manifest.json`;
