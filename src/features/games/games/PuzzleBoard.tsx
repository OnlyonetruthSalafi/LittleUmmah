'use client';
import { fmt } from '@/i18n/dict';
import { useDict } from '@/i18n/LocaleProvider';

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { PlayProps } from '../components/GameShell';
import { GameImage as Image } from '../components/GameImage';
import { IslandBoard } from '../components/diorama/IslandBoard';
import { DragItem } from '../components/DragItem';
import { boardContent } from '../data/content';
import { gamePresentation } from '../data/presentation';
import { canPlace, levelComplete, shuffle } from '../engine/rules';
import { puzzlePicture } from '../data/puzzlePictures';
import { BOARD, PUZZLE_ISLAND, TRAY, type Affine, homography, pieceBox, piecePath, planeAffine, project, screenDown, trayMatrix } from '../data/puzzleArt';

/* เกมจิ๊กซอว์แบบ 2.5D — ตามภาพเกาะตัวอย่าง public/games/hub/puzzle.png
 *
 * ถาดขอบทองบนเกาะคือกระดาน ภาพของด่านถูกตัดเป็นชิ้นจิ๊กซอว์ (SVG) บนระนาบ 1000×1000
 * แล้วเอียงลงพื้นถาดด้วย matrix3d จากมุมถาดที่วัดจากภาพ (data/puzzleArt.ts)
 * ชิ้นที่รอวางเรียงใต้เกาะ เอียงแบบเดียวกับถาดเพื่อให้เด็กเทียบรูปทรงกับช่องได้ตรงๆ
 * ไม่มีตัวหนังสือบนเกาะ (เหมือนเกมหยอดรูปทรง/เรียงลำดับ) เลขช่องอยู่ใน aria-label
 */
/** ความหนาของชิ้น (หน่วยกระดาน) — บนมือถือราว 10px เห็นเป็นแผ่นหนาแบบภาพตัวอย่าง */
const THICKNESS = 56;
/** จำนวนชั้นที่ซ้อนเป็นผนังข้าง ยิ่งมากผนังยิ่งเนียน ไล่สีทองเข้มล่าง → ทองอ่อนบน */
const WALL_LAYERS = 14;
const wallColor = (t: number) => `hsl(40 ${62 + t * 10}% ${30 + t * 26}%)`;

/** part: 'wall' = เงา + ผนังข้าง, 'face' = ผิวบน, ไม่ใส่ = ทั้งชิ้น
 *  ชิ้นในถาดบนเกาะวาดผนังทุกชิ้นก่อนแล้วค่อยวางผิวบน หัวจิ๊กซอว์ที่สลับกันจึงไม่มีผนังของชิ้นหนึ่งทับภาพของอีกชิ้น */
function PieceSvg({ index, cols, rows, src, down, uid, part, projection }: { index: number; cols: number; rows: number; src: string; down: { x: number; y: number }; uid: string; part?: 'wall' | 'face'; projection?: Affine }) {
  const col = index % cols, row = Math.floor(index / cols);
  const outline = piecePath(col, row, cols, rows), box = pieceBox(col, row, cols, rows, THICKNESS);
  const clip = `${uid}-clip-${index}`;
  let viewBox = `${box.x} ${box.y} ${box.w} ${box.h}`;
  let transform: string | undefined;
  if (projection) {
    // Fit loose pieces in screen-aligned cells, with the same camera angle as the island.
    const { a, b, c, d } = projection;
    const w = BOARD / cols, h = BOARD / rows;
    const cx = (col + .5) * w, cy = (row + .5) * h;
    const gutter = .16 * Math.min(w, h);
    const spanX = Math.abs(a) * w + Math.abs(c) * h + 2 * gutter;
    const spanY = Math.abs(b) * w + Math.abs(d) * h + 2 * gutter;
    const rise = b * down.x + d * down.y;
    viewBox = `${a * cx + c * cy - spanX / 2} ${b * cx + d * cy - spanY / 2 - rise} ${spanX} ${spanY + rise}`;
    transform = `matrix(${a} ${b} ${c} ${d} 0 0)`;
  }
  return <svg className="pz-piece-art" viewBox={viewBox} aria-hidden="true" focusable="false">
    <defs><clipPath id={clip}><path d={outline} /></clipPath></defs>
    {/* ฐานของชิ้นตรงกับช่องบนพื้นถาดพอดี หน้าบนยกขึ้นตามความหนา
        ผนังข้างคือเส้นรอบชิ้นเดียวกันซ้อนหลายชั้นจากฐานขึ้นไปถึงหน้าบน กลายเป็นแผ่นทองหนาแบบ 2.5D */}
    <g transform={transform}>
      {part !== 'face' && <><path d={outline} className="pz-contact" />
      <g className="pz-wall">{Array.from({ length: WALL_LAYERS }, (_, k) => {
        const t = k / (WALL_LAYERS - 1); // t = 0 คือฐาน
        return <path key={k} d={outline} transform={`translate(${+(-down.x * t).toFixed(2)} ${+(-down.y * t).toFixed(2)})`} fill={wallColor(t)} stroke={wallColor(t)} />;
      })}</g></>}
      {part !== 'wall' && <g transform={`translate(${-down.x} ${-down.y})`}>
        <image href={src} x={0} y={0} width={BOARD} height={BOARD} preserveAspectRatio="none" clipPath={`url(#${clip})`} />
        <path d={outline} className="pz-rim" />
        <path d={outline} className="pz-shine" />
      </g>}
    </g>
  </svg>;
}

export default function PuzzleBoard({ paused, level, pictureId, onProgress, onFeedback, onComplete, onTap }: PlayProps) {
  const { t, sub, pick, pickSub } = useDict();
  const uid = useId().replace(/:/g, '');
  const [round] = useState(() => { const data = boardContent('puzzle', level); return { ...data, tray: shuffle(data.items) }; });
  const { columns: cols, rows } = round.puzzle!;
  const art = gamePresentation.puzzle.levelArt!, selectedPicture = puzzlePicture(pictureId);
  const picture = selectedPicture.src ? selectedPicture : art[level - 1] ?? art[0], src = picture.src!;
  const H = useMemo(() => homography(TRAY), []);
  const down = useMemo(() => screenDown(H, THICKNESS), [H]);
  const A = useMemo(() => planeAffine(H), [H]);
  const [placed, setPlaced] = useState<string[]>([]);
  const current = useRef<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [hint, setHint] = useState<number | null>(null);
  const [landed, setLanded] = useState<number | null>(null);
  const [guide, setGuide] = useState(true);
  const [notice, setNotice] = useState(t.games.puzzle.help);
  const [width, setWidth] = useState(0);
  const layer = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const total = round.items.length;
  useLayoutEffect(() => {
    const element = layer.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { onProgress(placed.length, total); }, [placed.length, total, onProgress]);
  useEffect(() => {
    if (paused || !levelComplete(total, placed.length)) return;
    const timer = setTimeout(onComplete, 1200);
    return () => clearTimeout(timer);
  }, [placed.length, total, onComplete, paused]);

  const indexOf = (id: string) => Number(id.split('-')[1]);
  function place(itemId: string, targetId: string) {
    if (current.current.includes(itemId)) return;
    const correct = canPlace(round.items, round.targets, current.current, itemId, targetId);
    onFeedback(correct);
    if (!correct) { setNotice(t.games.puzzle.retry); return; }
    const next = [...current.current, itemId];
    current.current = next;
    setPlaced(next); setSelected(null); setHint(null); setLanded(indexOf(itemId));
    setNotice(fmt(t.games.puzzle.placedCount, { done: next.length, total: total }));
    const nextItem = round.tray.find(item => !next.includes(item.id));
    if (nextItem) requestAnimationFrame(() => scene.current?.querySelector<HTMLButtonElement>(`[data-item-id="${nextItem.id}"]`)?.focus({ preventScroll: true }));
  }

  /* ชิ้นที่อยู่ต่ำกว่าบนจอ (ใกล้คนดู) วาดทีหลัง ผนังข้างของมันจึงบังชิ้นที่อยู่ไกลกว่าอย่างถูกต้อง */
  const depth = (i: number) => Math.round(project(H, ((i % cols) + 0.5) / cols, (Math.floor(i / cols) + 0.5) / rows).y * 1000);
  const tapCell = (targetId: string) => { if (selected) place(selected, targetId); else setNotice(t.games.puzzle.selectFirst); };
  const hintAt = hint === null ? null : project(H, ((hint % cols) + 0.5) / cols, (Math.floor(hint / cols) + 0.5) / rows);
  const done = placed.length === total;

  return <div className="pz-scene" ref={scene} data-level={level} data-picture-id={selectedPicture.id} data-done={done || undefined} style={{ '--pz-cols': cols } as CSSProperties}>
    <p className="sr-only" role="status" aria-live="polite">{notice}</p>

    <IslandBoard {...PUZZLE_ISLAND} className="pz-island" label={fmt(t.games.puzzle.tray, { name: pick(picture.label), secondary: pickSub(picture.label)! })}>
      <div className="pz-layer" ref={layer}>
        {width > 0 && <div className="pz-plane" style={{ width, height: width, transform: trayMatrix(H, width, width) }}>
          <Image className="pz-ghost" src={src} alt="" width={900} height={900} unoptimized data-show={guide || undefined} draggable={false} />
          <svg className="pz-outlines" viewBox={`0 0 ${BOARD} ${BOARD}`} aria-hidden="true" focusable="false">
            {/* รูปจิ๊กซอว์ของช่องที่ยังว่างคือพื้นที่รับการแตะ/ปล่อยนิ้วจริง หัวที่ยื่นข้ามเส้นตารางจึงนับเป็นช่องของมันเอง
                ปุ่มสี่เหลี่ยมด้านล่างไว้ให้คีย์บอร์ดกับเครื่องอ่านหน้าจอเท่านั้น (pointer-events: none) */}
            {round.items.map((item, i) => !placed.includes(item.id) && <path key={item.id} d={piecePath(i % cols, Math.floor(i / cols), cols, rows)} data-drop-id={round.targets[i].id} data-hint={hint === i || undefined} onClick={() => tapCell(round.targets[i].id)} />)}
          </svg>
          {round.targets.map((target, i) => {
            const filled = placed.includes(round.items[i].id);
            return <button type="button" key={target.id} className="pz-cell" data-drop-id={target.id} disabled={filled}
              style={{ left: `${(i % cols) * 100 / cols}%`, top: `${Math.floor(i / cols) * 100 / rows}%`, width: `${100 / cols}%`, height: `${100 / rows}%` }}
              aria-label={fmt(t.games.puzzle.slot, { index: i + 1, placed: filled ? t.games.puzzle.placed : '' })}
              onClick={() => tapCell(target.id)} />;
          })}
          {(['wall', 'face'] as const).map(part => round.items.map((item, i) => {
            if (!placed.includes(item.id)) return null;
            const box = pieceBox(i % cols, Math.floor(i / cols), cols, rows, THICKNESS);
            return <span key={`${part}-${item.id}`} className="pz-placed" data-part={part} data-landed={landed === i || undefined}
              style={{ left: `${box.x / 10}%`, top: `${box.y / 10}%`, width: `${box.w / 10}%`, height: `${box.h / 10}%`, zIndex: (part === 'face' ? 2000 : 0) + depth(i) }}>
              <PieceSvg index={i} cols={cols} rows={rows} src={src} down={down} uid={`${uid}${part}`} part={part} />
            </span>;
          }))}
        </div>}
        {hintAt && <span className="gc-hint-arrow pz-hint-arrow" aria-hidden="true" style={{ left: `${hintAt.x * 100}%`, top: `${hintAt.y * 100}%` }}>↓</span>}
      </div>
    </IslandBoard>

    <div className="pz-stock">
      <div className="pz-tools">
        <button type="button" className="gc-button" aria-pressed={guide} onClick={() => { onTap(); setGuide(g => !g); }}>
          {guide ? t.games.puzzle.hide : t.games.puzzle.show}{sub && <small lang="en">{sub.games.puzzle.pictureGuide}</small>}
        </button>
        <button type="button" className="gc-button" disabled={done} onClick={() => {
          const item = round.items.find(i => i.id === selected) ?? round.tray.find(i => !current.current.includes(i.id));
          if (!item) return;
          onTap(); setSelected(item.id); setHint(indexOf(item.id));
          setNotice(fmt(t.games.puzzle.hintSlot, { index: indexOf(item.id) + 1 }));
        }}>{t.games.puzzle.hint}{sub && <small lang="en">{sub.games.puzzle.hint}</small>}</button>
      </div>
      <div className="pz-bench">
        <div className="pz-tray" role="group" aria-label={t.games.puzzle.pieces}>
          {round.tray.map(item => {
            const i = indexOf(item.id);
            return <div className="pz-tray-cell" key={item.id}>
              {!placed.includes(item.id) && <DragItem id={item.id} label={fmt(t.games.puzzle.piece, { index: i + 1, name: pick(picture.label), secondary: pickSub(picture.label)! })} selected={selected === item.id}
                onSelect={() => { onTap(); setSelected(item.id); setHint(null); setNotice(t.games.puzzle.selected); }} onDrop={place}>
                <span className="pz-toy"><PieceSvg index={i} cols={cols} rows={rows} src={src} down={down} uid={`${uid}t`} projection={A} /></span>
              </DragItem>}
            </div>;
          })}
        </div>
      </div>
    </div>
  </div>;
}
