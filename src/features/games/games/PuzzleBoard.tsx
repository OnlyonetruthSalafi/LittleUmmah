'use client';
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { PlayProps } from '../components/GameShell';
import { GameImage as Image } from '../components/GameImage';
import { IslandBoard } from '../components/diorama/IslandBoard';
import { DragItem } from '../components/DragItem';
import { boardContent } from '../data/content';
import { gamePresentation } from '../data/presentation';
import { canPlace, levelComplete, shuffle } from '../engine/rules';
import { BOARD, PUZZLE_ISLAND, TRAY, benchLayout, homography, pieceBox, piecePath, planeAffine, project, screenDown, trayMatrix } from '../data/puzzleArt';

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
/** ช่องไฟระหว่างชิ้นบนถาดวางชิ้น เทียบกับขนาดชิ้น */
const BENCH_GAP = 0.14;
const wallColor = (t: number) => `hsl(40 ${62 + t * 10}% ${30 + t * 26}%)`;

/** part: 'wall' = เงา + ผนังข้าง, 'face' = ผิวบน, ไม่ใส่ = ทั้งชิ้น
 *  ชิ้นในถาดบนเกาะวาดผนังทุกชิ้นก่อนแล้วค่อยวางผิวบน หัวจิ๊กซอว์ที่สลับกันจึงไม่มีผนังของชิ้นหนึ่งทับภาพของอีกชิ้น */
function PieceSvg({ index, cols, rows, src, down, uid, part }: { index: number; cols: number; rows: number; src: string; down: { x: number; y: number }; uid: string; part?: 'wall' | 'face' }) {
  const col = index % cols, row = Math.floor(index / cols);
  const d = piecePath(col, row, cols, rows), box = pieceBox(col, row, cols, rows, THICKNESS);
  const clip = `${uid}-clip-${index}`;
  return <svg className="pz-piece-art" viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`} aria-hidden="true" focusable="false">
    <defs><clipPath id={clip}><path d={d} /></clipPath></defs>
    {/* ฐานของชิ้นตรงกับช่องบนพื้นถาดพอดี หน้าบนยกขึ้นตามความหนา
        ผนังข้างคือเส้นรอบชิ้นเดียวกันซ้อนหลายชั้นจากฐานขึ้นไปถึงหน้าบน กลายเป็นแผ่นทองหนาแบบ 2.5D */}
    {part !== 'face' && <><path d={d} className="pz-contact" />
    <g className="pz-wall">{Array.from({ length: WALL_LAYERS }, (_, k) => {
      const t = k / (WALL_LAYERS - 1); // t = 0 คือฐาน
      return <path key={k} d={d} transform={`translate(${+(-down.x * t).toFixed(2)} ${+(-down.y * t).toFixed(2)})`} fill={wallColor(t)} stroke={wallColor(t)} />;
    })}</g></>}
    {part !== 'wall' && <g transform={`translate(${-down.x} ${-down.y})`}>
      <image href={src} x={0} y={0} width={BOARD} height={BOARD} preserveAspectRatio="none" clipPath={`url(#${clip})`} />
      <path d={d} className="pz-rim" />
      <path d={d} className="pz-shine" />
    </g>}
  </svg>;
}

/** ถาดวางชิ้นบนระนาบ S×S: ผนังหินอ่อนคาดทองซ้อนหลายชั้นลงจอ · ขอบทองหนา · พื้นครีม (เข้าชุดกับถาดบนเกาะ) */
function BenchTray({ S, pad, wall, uid }: { S: number; pad: number; wall: { x: number; y: number }; uid: string }) {
  const r = pad * 0.9, rim = pad * 0.55;
  const rect = (inset: number, radius: number) => <rect x={inset} y={inset} width={S - 2 * inset} height={S - 2 * inset} rx={radius} />;
  const layers = 12;
  return <svg className="pz-bench-tray" width={S} height={S} viewBox={`0 0 ${S} ${S}`} aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={`${uid}-rim`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffe28a" /><stop offset=".5" stopColor="#f2c24f" /><stop offset="1" stopColor="#c98f22" /></linearGradient>
      <linearGradient id={`${uid}-floor`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fffaf0" /><stop offset="1" stopColor="#f1e7d2" /></linearGradient>
    </defs>
    {/* ผนังด้านข้าง: ล่างสุดเป็นแถบทอง เหนือขึ้นมาเป็นหินอ่อนขาว แบบหน้าผาเกาะ */}
    {Array.from({ length: layers }, (_, k) => {
      const t = k / (layers - 1), fill = t < 0.28 ? `hsl(40 70% ${36 + t * 60}%)` : `hsl(40 30% ${88 + t * 8}%)`;
      return <g key={k} transform={`translate(${+(wall.x * (1 - t)).toFixed(2)} ${+(wall.y * (1 - t)).toFixed(2)})`} fill={fill}>{rect(0, r)}</g>;
    })}
    <g fill={`url(#${uid}-rim)`}>{rect(0, r)}</g>
    <g fill="none" stroke="#fff4c4" strokeWidth={Math.max(1.5, rim * 0.12)}>{rect(rim * 0.18, r * 0.95)}</g>
    <g fill={`url(#${uid}-floor)`} stroke="#d9b45a" strokeWidth={Math.max(1.5, rim * 0.14)}>{rect(rim, r - rim * 0.6)}</g>
  </svg>;
}

export default function PuzzleBoard({ level, onProgress, onFeedback, onComplete, onTap }: PlayProps) {
  const uid = useId().replace(/:/g, '');
  const [round] = useState(() => { const data = boardContent('puzzle', level); return { ...data, tray: shuffle(data.items) }; });
  const { columns: cols, rows } = round.puzzle!;
  const art = gamePresentation.puzzle.levelArt!, picture = art[level - 1] ?? art[0], src = picture.src;
  const H = useMemo(() => homography(TRAY), []);
  const down = useMemo(() => screenDown(H, THICKNESS), [H]);
  const A = useMemo(() => planeAffine(H), [H]);
  const [placed, setPlaced] = useState<string[]>([]);
  const current = useRef<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [hint, setHint] = useState<number | null>(null);
  const [landed, setLanded] = useState<number | null>(null);
  const [guide, setGuide] = useState(true);
  const [notice, setNotice] = useState('แตะชิ้นภาพ แล้วแตะช่องในถาด หรือลากไปวาง');
  const [width, setWidth] = useState(0);
  const layer = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const total = round.items.length;
  const [benchWidth, setBenchWidth] = useState(0);
  const benchRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = layer.current;
    if (!element) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) (entry.target === element ? setWidth : setBenchWidth)(entry.contentRect.width);
    });
    observer.observe(element);
    if (benchRef.current) observer.observe(benchRef.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { onProgress(placed.length, total); }, [placed.length, total, onProgress]);
  useEffect(() => {
    if (!levelComplete(total, placed.length)) return;
    const timer = setTimeout(onComplete, 1200);
    return () => clearTimeout(timer);
  }, [placed.length, total, onComplete]);

  const indexOf = (id: string) => Number(id.split('-')[1]);
  function place(itemId: string, targetId: string) {
    if (current.current.includes(itemId)) return;
    const correct = canPlace(round.items, round.targets, current.current, itemId, targetId);
    onFeedback(correct);
    if (!correct) { setNotice('ยังไม่ใช่ช่องนี้ ดูภาพช่วยในถาดแล้วลองใหม่นะ'); return; }
    const next = [...current.current, itemId];
    current.current = next;
    setPlaced(next); setSelected(null); setHint(null); setLanded(indexOf(itemId));
    setNotice(`วางแล้ว ${next.length} จาก ${total} ชิ้น`);
    const nextItem = round.tray.find(item => !next.includes(item.id));
    if (nextItem) requestAnimationFrame(() => scene.current?.querySelector<HTMLButtonElement>(`[data-item-id="${nextItem.id}"]`)?.focus({ preventScroll: true }));
  }

  /* ชิ้นที่อยู่ต่ำกว่าบนจอ (ใกล้คนดู) วาดทีหลัง ผนังข้างของมันจึงบังชิ้นที่อยู่ไกลกว่าอย่างถูกต้อง */
  const depth = (i: number) => Math.round(project(H, ((i % cols) + 0.5) / cols, (Math.floor(i / cols) + 0.5) / rows).y * 1000);
  const tapCell = (targetId: string) => { if (selected) place(selected, targetId); else setNotice('แตะเลือกชิ้นภาพก่อน แล้วแตะช่องในถาด'); };
  /* ถาดวางชิ้นใต้เกาะ: เอียงแบบเดียวกับถาดบนเกาะ กว้างเกือบเต็มกล่อง ช่องใหญ่สุด 130px */
  const bench = benchWidth > 0 ? benchLayout(A, cols, rows, benchWidth * 0.97, 130) : null;
  /* ชิ้นบนระนาบถาดวางชิ้น: หน่วยกระดาน → px บนระนาบ เว้นช่องไฟ BENCH_GAP ระหว่างชิ้น
     ไม่งั้นชิ้นที่สลับที่กันแล้วชิดกันจะดูเหมือนภาพต่อสำเร็จอีกภาพ */
  const toyScale = bench ? bench.cw / (1 + BENCH_GAP) / (BOARD / cols) : 0;
  const hintAt = hint === null ? null : project(H, ((hint % cols) + 0.5) / cols, (Math.floor(hint / cols) + 0.5) / rows);
  const done = placed.length === total;

  return <div className="pz-scene" ref={scene} data-level={level} data-done={done || undefined} style={{ '--pz-cols': cols } as CSSProperties}>
    <div className="pz-tools">
      <button type="button" className="gc-button" aria-pressed={guide} onClick={() => { onTap(); setGuide(g => !g); }}>
        {guide ? 'ซ่อนภาพช่วย' : 'ดูภาพช่วย'}<small lang="en">Picture guide</small>
      </button>
      <button type="button" className="gc-button" disabled={done} onClick={() => {
        const item = round.items.find(i => i.id === selected) ?? round.tray.find(i => !current.current.includes(i.id));
        if (!item) return;
        onTap(); setSelected(item.id); setHint(indexOf(item.id));
        setNotice(`ลองวางชิ้นที่เลือกในช่องที่มีลูกศร ช่องที่ ${indexOf(item.id) + 1}`);
      }}>คำใบ้<small lang="en">Hint</small></button>
    </div>
    <p className="sr-only" role="status" aria-live="polite">{notice}</p>

    <IslandBoard {...PUZZLE_ISLAND} className="pz-island" label={`ถาดจิ๊กซอว์ ภาพ${picture.label.th} / Puzzle tray: ${picture.label.en}`}>
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
              aria-label={`ช่องที่ ${i + 1} / Slot ${i + 1}${filled ? ' วางแล้ว / placed' : ''}`}
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

    {/* ชิ้นที่รอวางอยู่บนถาดใต้เกาะ ถาดกับชิ้นเอียงบนระนาบเดียวกับถาดบนเกาะ ชิ้นจึงใหญ่และเอียงเท่าช่องจริง
        ปุ่มของแต่ละชิ้นเป็นกล่องตรงบนจอ (ลากตามนิ้วได้ตรง) ≥ 64px ศูนย์กลางอยู่ที่กลางช่องบนระนาบ
        ช่องของชิ้นที่วางแล้วยังเว้นไว้ ชิ้นอื่นจึงไม่เลื่อนขณะเด็กเล็ง */}
    <div className="pz-bench" ref={benchRef} style={bench ? { height: bench.height } : undefined}>
      {bench && <>
        <div className="pz-bench-plane" style={{ width: bench.S, height: bench.S, transform: bench.matrix }}>
          <BenchTray S={bench.S} pad={bench.pad} wall={bench.wall} uid={`${uid}bench`} />
        </div>
        <div className="pz-tray" role="group" aria-label="ชิ้นภาพที่รอวาง / Puzzle pieces">
          {round.tray.map((item, slot) => {
            const i = indexOf(item.id), at = bench.center(slot);
            const size = Math.max(64, Math.min(bench.cw, bench.ch) * 0.95);
            const box = pieceBox(i % cols, Math.floor(i / cols), cols, rows, THICKNESS);
            return <div className="pz-tray-cell" key={item.id} style={{ left: at.x - size / 2, top: at.y - size / 2, width: size, height: size, zIndex: Math.round(at.y) }}>
              {!placed.includes(item.id) && <DragItem id={item.id} label={`ชิ้นภาพที่ ${i + 1} ของภาพ${picture.label.th} / Piece ${i + 1} of ${picture.label.en}`} selected={selected === item.id}
                onSelect={() => { onTap(); setSelected(item.id); setHint(null); setNotice('เลือกชิ้นภาพแล้ว แตะช่องในถาดที่รูปร่างตรงกัน'); }} onDrop={place}>
                <span className="pz-toy" style={{ width: box.w * toyScale, height: box.h * toyScale, transform: `translate(-50%, -50%) matrix(${A.a},${A.b},${A.c},${A.d},0,0)` }}>
                  <PieceSvg index={i} cols={cols} rows={rows} src={src} down={down} uid={`${uid}t`} />
                </span>
              </DragItem>}
            </div>;
          })}
        </div>
      </>}
    </div>
  </div>;
}
