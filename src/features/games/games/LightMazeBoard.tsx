'use client';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import type { PlayProps } from '../components/GameShell';
import { useSound } from '@/components/sound/SoundProvider';
import { MAZE_LEVELS, canGo, walkerCell, walkerPos, type Dir } from '../data/lightMaze';
import { LM_ACTOR_ART, LM_ITEM_ART, LM_MANIFEST, LM_PALETTES, LM_PROP_ART, LM_THEME_ART } from '../data/lightMazeArt';
import { beadsLeft, createSim, powered, slowed, steer, stepSim, type Sim, type SimEvent } from '../engine/lightMazeSim';
import { MazeRenderer, type ArtSet, type IslandFit, type Sprite } from '../render/lightMazeRenderer';
import { useSfx, type SfxSet } from '../audio/useSfx';

/* เกมเขาวงกตแสง 2.5D — กล้อง isometric แบบภาพ tests/MockOrbGame.png วาดบน Canvas (render/lightMazeRenderer.ts)
 * ตรรกะอยู่ engine/lightMazeSim.ts ส่วนนี้แค่ต่อ input ลูปเวลา เสียงพูด และ HUD
 * ปุ่มทิศเป็น 4 ปุ่มทแยงตามแนวทางเดินของกล้องเฉียง (ขวาบน = −r, ขวาล่าง = +c, ซ้ายล่าง = +r, ซ้ายบน = −c)
 */
const PAD: { dir: Dir; th: string; en: string; rotate: number }[] = [
  { dir: 'left', th: 'ซ้ายบน', en: 'Up-left', rotate: -63.4 }, { dir: 'up', th: 'ขวาบน', en: 'Up-right', rotate: 63.4 },
  { dir: 'down', th: 'ซ้ายล่าง', en: 'Down-left', rotate: -116.6 }, { dir: 'right', th: 'ขวาล่าง', en: 'Down-right', rotate: 116.6 },
];
const KEYS: Record<string, Dir> = { ArrowUp: 'up', ArrowRight: 'right', ArrowDown: 'down', ArrowLeft: 'left', w: 'up', d: 'right', s: 'down', a: 'left', e: 'up', c: 'right', z: 'down', q: 'left' };
/** ทิศบนจอของแต่ละทิศโลก (หน่วยเวกเตอร์ของแกน 2:1 เอียง 26.6°) ใช้แปลงการปัดนิ้วเป็นทิศ และหมุนลูกศรบนปุ่มให้ตรงแนวทางเดิน */
const SCREEN: Record<Dir, [number, number]> = { up: [0.894, -0.447], right: [0.894, 0.447], down: [-0.894, 0.447], left: [-0.894, -0.447] };

/* บทพูดของหุ่นยนต์ (จาก output/orbmaze-plan/PLAN.md §7) key = ไฟล์ public/audio/th/<key>.mp3 เมื่ออัดและอนุมัติแล้ว
 * ลงทะเบียนไฟล์ใน RECORDED_CLIPS (src/lib/speech.ts) แล้ว ถ้าไฟล์เล่นไม่ได้ จะใช้เสียงสังเคราะห์ของเบราว์เซอร์อ่านข้อความแทน */
type LineId = SimEvent | 'half';
const LINES: Partial<Record<LineId, { key: string; th: string }>> = {
  star: { key: 'orbmaze-star', th: 'ได้พลังแสงแล้ว เพื่อนหุ่นยนต์จะหลบให้สักครู่นะ' },
  clock: { key: 'orbmaze-slow', th: 'เพื่อนหุ่นยนต์เดินช้าลงแล้ว ค่อยๆ เลือกทางนะ' },
  shield: { key: 'orbmaze-shield', th: 'ได้โล่แล้ว ช่วยกันการแตะได้หนึ่งครั้ง' },
  warp: { key: 'orbmaze-warp', th: 'ประตูนี้พาไปอีกจุด ลองเลือกทางต่อได้เลย' },
  bump: { key: 'orbmaze-bump', th: 'ไม่เป็นไร แสงยังอยู่ครบ เราไปต่อกันนะ' },
  half: { key: 'orbmaze-praise', th: 'มาชาอัลลอฮ์ ตั้งใจเก็บแสงได้ดีเลย' },
  complete: { key: 'orbmaze-complete', th: 'อัลฮัมดุลิลลาฮ์ เก็บแสงครบแล้ว' },
};
/* เสียงเอฟเฟค (scripts/make-lightmaze-sfx.mjs — ElevenLabs, no music) เม็ดแสงเกิดบ่อยมากจึงเบาที่สุด */
type Sfx = 'bead' | 'star' | 'clock' | 'shield' | 'warp' | 'bump';
const SFX: SfxSet<Sfx> = {
  bead: { file: '/audio/sfx/orbmaze-bead.mp3', volume: 0.35 },
  star: { file: '/audio/sfx/orbmaze-star.mp3', volume: 0.6 },
  clock: { file: '/audio/sfx/orbmaze-clock.mp3', volume: 0.55 },
  shield: { file: '/audio/sfx/orbmaze-shield.mp3', volume: 0.55 },
  warp: { file: '/audio/sfx/orbmaze-warp.mp3', volume: 0.55 },
  bump: { file: '/audio/sfx/orbmaze-bump.mp3', volume: 0.5 },
};
const EVENT_SFX: Partial<Record<SimEvent, Sfx>> = { bead: 'bead', star: 'star', clock: 'clock', shield: 'shield', shieldUsed: 'bump', warp: 'warp', bump: 'bump' };
const TOAST: Partial<Record<SimEvent, string>> = {
  star: 'พลังแสง! เพื่อนหุ่นหลบให้ • Light power!', clock: 'เพื่อนเดินช้าลง • Robots slow down', shield: 'ได้โล่ 1 ครั้ง • Shield on',
  shieldUsed: 'โล่ช่วยไว้แล้ว • Shield used', warp: 'วาร์ป! • Warp!', checkpoint: 'ถึงจุดพัก • Rest spot saved', bump: 'ไม่เป็นไร แสงยังอยู่ครบ • Your lights are safe',
};

function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>(resolve => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export default function LightMazeBoard({ level, paused, onProgress, onComplete }: PlayProps) {
  const lv = MAZE_LEVELS[level - 1];
  const { speak } = useSound();
  const [sim] = useState<Sim>(() => createSim(lv));
  const total = sim.maze.lights.length;
  const [left, setLeft] = useState(total);
  const [toast, setToast] = useState('');
  const [hud, setHud] = useState({ power: false, slow: false, shield: 0 });
  const canvas = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const renderer = useRef<MazeRenderer | null>(null);
  const sfx = useSfx(SFX);
  const callbacks = useRef({ onComplete, speak, sfx });
  useEffect(() => { callbacks.current = { onComplete, speak, sfx }; });
  // ระหว่างนับถอยหลังของ GameShell (paused) ฉากวาดอยู่แต่เวลาในเกมยังไม่เดิน และกดเดินไม่ได้
  const counting = useRef(paused);
  useEffect(() => { counting.current = paused; }, [paused]);
  useEffect(() => { onProgress(total - left, total); }, [left, total, onProgress]);

  const fit = useRef(() => {
    const cv = canvas.current, box = wrap.current, r = renderer.current;
    if (!cv || !box || !r) return;
    const dpr = Math.min(window.devicePixelRatio || 1, box.clientWidth < 640 ? 1.5 : 2);
    cv.width = Math.round(box.clientWidth * dpr); cv.height = Math.round(box.clientHeight * dpr);
    // เห็นเวทีทั้งเกาะเสมอ รวมถึงมือถือ — เดิมมือถือบังคับช่อง 44px แล้วให้กล้องตามหุ่น เกาะจึงล้นขอบจอ
    // เจ้าของโปรเจกต์ให้เห็นทั้งเวที (1 ต.ค. 2026) เด็กเดินด้วยปุ่มทิศ 64px ไม่ต้องแตะช่องบนเกาะ
    r.resize(cv.width, cv.height);
  });

  // โหลดภาพของธีม (ภาพไหนยังไม่มี ตัววาดใช้สีธีมแทน เกมเล่นได้ตั้งแต่ก่อนภาพเสร็จ)
  useEffect(() => {
    let alive = true;
    const theme = LM_THEME_ART(lv.theme);
    const want: Record<string, string> = { 'tex-floor': theme.floor, 'tex-top': theme.wallTop, 'tex-side': theme.wallSide, island: theme.island, ...LM_ITEM_ART, ...LM_PROP_ART };
    for (const id of ['orb', ...sim.maze.homes.map(h => h.id)] as const) {
      const a = LM_ACTOR_ART(id);
      want[`${id}-se`] = a.se; want[`${id}-ne`] = a.ne;
      if (a.rest) want[`${id}-rest`] = a.rest;
    }
    (async () => {
      // manifest จาก Codex: assets[ชื่อ] = { file, anchor (จุดกลางฐาน), surface.corners (มุมข้าวหลามตัดขอบทองบนเกาะ) } พิกเซลของ WebP จริง
      type Asset = { file: string; anchor?: { x: number; y: number }; surface?: { corners: IslandFit } };
      const manifest = await fetch(LM_MANIFEST).then(r => r.ok ? r.json() : null).catch(() => null) as { assets?: Record<string, Asset> } | null;
      const byFile = new Map(Object.values(manifest?.assets ?? {}).map(a => [a.file, a]));
      const art: ArtSet = new Map();
      await Promise.all(Object.entries(want).map(async ([key, src]) => {
        const img = await loadImage(src);
        if (!img) return;
        const anchor = byFile.get(src)?.anchor;
        const s: Sprite = { img, w: img.naturalWidth, h: img.naturalHeight, ax: anchor?.x ?? img.naturalWidth / 2, ay: anchor?.y ?? img.naturalHeight * 0.84 };
        art.set(key, s);
      }));
      if (!alive) return;
      renderer.current = new MazeRenderer(sim.maze, LM_PALETTES[lv.theme], art, byFile.get(theme.island)?.surface?.corners ?? null);
      fit.current();
    })();
    return () => { alive = false; };
  }, [lv, sim]);

  useEffect(() => {
    const box = wrap.current;
    if (!box) return;
    const ro = new ResizeObserver(() => fit.current());
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  // ลูปเกม: ก้าวละไม่เกิน 50ms กันทะลุผนังเมื่อกลับมาที่แท็บ; rAF หยุดเองตอนแท็บถูกซ่อน
  useEffect(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let last = performance.now(), raf = 0, finish: ReturnType<typeof setTimeout> | undefined, toastTimer: ReturnType<typeof setTimeout> | undefined;
    let saidHalf = false, shown = { power: false, slow: false, shield: 0 };
    const said = new Set<LineId>();
    const say = (id: LineId, once = true) => {
      const line = LINES[id];
      if (!line || (once && said.has(id))) return;
      said.add(id);
      callbacks.current.speak(line.th, line.key);
    };
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      for (const e of counting.current ? [] : stepSim(sim, dt)) {
        const cue = EVENT_SFX[e];
        if (cue) callbacks.current.sfx(cue);
        const text = TOAST[e];
        if (text) { setToast(text); clearTimeout(toastTimer); toastTimer = setTimeout(() => setToast(''), 2400); }
        if (e === 'bead') {
          const n = beadsLeft(sim);
          setLeft(n);
          if (!saidHalf && n <= total / 2 && n > 0) { saidHalf = true; say('half'); }
        } else if (e === 'bump') say('bump', false);
        else if (e === 'complete') { say('complete', false); finish = setTimeout(() => callbacks.current.onComplete(), 2600); }
        else say(e);
      }
      const next = { power: powered(sim), slow: slowed(sim), shield: sim.shield };
      if (next.power !== shown.power || next.slow !== shown.slow || next.shield !== shown.shield) { shown = next; setHud(next); }
      const g = canvas.current?.getContext('2d'), r = renderer.current, box = wrap.current, cv = canvas.current;
      if (g && r) r.draw(g, sim, now / 1000, still, dt);
      // ตำแหน่งหุ่นบนจอและขนาดช่อง ให้สคริปต์ตรวจในเบราว์เซอร์อ่านได้
      if (r && box && cv) { const p = walkerPos(sim.player), at = r.iso(p.x, p.y), k = box.clientWidth / cv.width; box.dataset.robot = `${Math.round(at.x * k)},${Math.round(at.y * k)}`; box.dataset.tile = String(Math.round(r.T * k)); }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); clearTimeout(finish); clearTimeout(toastTimer); };
  }, [sim, total]);

  const go = useRef((dir: Dir) => {
    if (counting.current) return;
    steer(sim, dir);
  });
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const dir = KEYS[e.key.length === 1 ? e.key.toLowerCase() : e.key];
      if (!dir || e.altKey || e.ctrlKey || e.metaKey) return;
      if ((e.target as HTMLElement | null)?.closest?.('input,select,textarea')) return;
      if (e.key.startsWith('Arrow')) e.preventDefault();
      go.current(dir);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);

  /* ปัดนิ้ว: เลือกทิศโลกที่ใกล้ทิศที่ปัดบนจอที่สุด ถ้าก้ำกึ่งสองทิศ (เช่น ปัดขึ้นตรงๆ) เลือกทางที่เดินได้จริงจากช่องปัจจุบัน
   * ไม่ทิ้ง input ที่ก้ำกึ่ง เพราะเด็กที่ปัดแล้วไม่มีอะไรเกิดขึ้นจะเลิกลอง */
  const swipe = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  function toward(dx: number, dy: number): Dir {
    const len = Math.hypot(dx, dy) || 1;
    const ranked = (Object.keys(SCREEN) as Dir[]).map(d => ({ d, v: (dx * SCREEN[d][0] + dy * SCREEN[d][1]) / len })).sort((a, b) => b.v - a.v);
    if (ranked[0].v - ranked[1].v > 0.12) return ranked[0].d;
    const here = walkerCell(sim.player), open = ranked.slice(0, 2).filter(o => canGo(sim.maze, here, o.d));
    if (open.length === 1) return open[0].d;
    const current = sim.player.dir;
    return current && ranked.slice(0, 2).some(o => o.d === current) ? current : ranked[0].d;
  }
  function down(e: ReactPointerEvent<HTMLDivElement>) { swipe.current = { x: e.clientX, y: e.clientY, moved: false }; e.currentTarget.setPointerCapture(e.pointerId); }
  function move(e: ReactPointerEvent<HTMLDivElement>) {
    const s = swipe.current;
    if (!s) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (Math.hypot(dx, dy) < 18) return;
    go.current(toward(dx, dy));
    swipe.current = { x: e.clientX, y: e.clientY, moved: true };
  }
  function up(e: ReactPointerEvent<HTMLDivElement>) {
    const s = swipe.current;
    swipe.current = null;
    const r = renderer.current, cv = canvas.current, box = wrap.current;
    if (!s || s.moved || !r || !cv || !box) return;
    // แตะเฉยๆ = เดินไปทางจุดที่แตะ (เทียบกับหุ่นลูกกลมบนจอ)
    const rect = box.getBoundingClientRect(), k = cv.width / rect.width, p = walkerPos(sim.player), at = r.iso(p.x, p.y);
    const dx = (e.clientX - rect.left) * k - at.x, dy = (e.clientY - rect.top) * k - at.y;
    if (Math.hypot(dx, dy) > r.T * 0.3) go.current(toward(dx, dy));
  }

  return <div className="lm-scene" data-theme={lv.theme}>
    <div ref={wrap} className="lm-stage" data-beads-left={left} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={() => { swipe.current = null; }}
      role="group" aria-label={`เขาวงกตแสง ${lv.th} เหลือเม็ดแสง ${left} เม็ด ใช้ปุ่มทิศหรือลูกศรพาหุ่นลูกกลมเดิน / Light maze, ${left} lights left`}>
      <canvas ref={canvas} className="lm-canvas" aria-hidden="true" />
      <div className="lm-hud" aria-hidden="true">
        <span className="lm-chip">✦ {total - left}/{total}</span>
        {hud.power && <span className="lm-chip lm-chip-power">★ พลังแสง</span>}
        {hud.slow && <span className="lm-chip lm-chip-slow">◷ ช้าลง</span>}
        {hud.shield > 0 && <span className="lm-chip lm-chip-shield">◈ โล่ 1</span>}
      </div>
      {toast && <p className="lm-toast" aria-hidden="true">{toast}</p>}
    </div>
    <p className="sr-only" role="status">{toast}</p>
    <div className="lm-pad" role="group" aria-label="ปุ่มพาหุ่นลูกกลมเดิน / Move the robot">
      {PAD.map(p => <button key={p.dir} type="button" className={`lm-pad-${p.dir}`} aria-label={`${p.th} / ${p.en}`} onPointerDown={e => { e.preventDefault(); go.current(p.dir); }} onClick={() => go.current(p.dir)}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" style={{ transform: `rotate(${p.rotate}deg)` }}><path d="M12 2 20.5 11.5H15V22H9V11.5H3.5z" /></svg>
        <span>{p.th}</span>
      </button>)}
    </div>
  </div>;
}
