'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { ArrowLeftIcon } from '@/components/icons/ArrowLeftIcon';
import { ChevronRightIcon } from '@/components/icons/ChevronRightIcon';
import { ReplayIcon } from '@/components/icons/ReplayIcon';
import { BackLink } from '@/components/ui/BackLink';
import { useDict } from '@/i18n/LocaleProvider';
import type { Text } from '@/i18n/config';
import { useGameAudio } from '@/features/games/audio/useGameAudio';
import { RotateGate, usePortraitGate } from '@/features/games/components/RotateGate';
import { enterGameFullscreen, exitGameFullscreen, keepGameFullscreen } from '@/features/games/engine/fullscreen';
import { ART_COLORS, ART_DIFFICULTY, ART_PICTURES, ART_TEXT, type ArtColor, type ArtPicture } from '../data';
import { BRUSH_TIP, PAINT_WELLS } from '../paint-assets';
import type { Point } from '../paint';
import { PaintSurface, type PaintSurfaceHandle } from './PaintSurface';

type Fills = Record<string, string>;
const PAPER = '#fffdf6';

function TwoLine({ text }: { text: Text }) {
  const { pick, pickSub, sub } = useDict();
  return <>{pick(text)}{sub && <small lang="en">{pickSub(text)}</small>}</>;
}

function PictureSvg({ picture, fills, label }: { picture: ArtPicture; fills: Fills; label: string }) {
  return <svg viewBox="0 0 400 300" preserveAspectRatio="none" className="art-picture" role="img" aria-label={label}>
    {picture.regions.map(region => <path key={region.id} d={region.d} fill={fills[region.id] ?? PAPER} fillRule="evenodd" />)}
  </svg>;
}

const SHAPES: Record<ArtColor['shape'], string> = {
  diamond: 'M24 3 45 24 24 45 3 24Z',
  hexagon: 'M13 5H35L46 24 35 43H13L2 24Z',
  triangle: 'M24 5 46 43H2Z',
  square: 'M7 5H41a2 2 0 0 1 2 2V41a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z',
  circle: 'M45 24a21 21 0 1 1-42 0a21 21 0 1 1 42 0Z',
  drop: 'M24 3C32 15 42 23 42 31a18 15 0 0 1-36 0C6 23 16 15 24 3Z',
  star: 'M24 3 30 17 45 19 34 29 37 44 24 37 11 44 14 29 3 19 18 17Z',
  heart: 'M24 43C8 31 3 24 3 16C3 8 9 4 15 4C19 4 22 6 24 10C26 6 29 4 33 4C39 4 45 8 45 16C45 24 40 31 24 43Z',
};

function exampleFills(picture: ArtPicture): Fills {
  return Object.fromEntries(Object.entries(picture.example).map(([region, id]) => [region, ART_COLORS.find(item => item.id === id)!.value]));
}

function ColorTile({ color, on, onPick, onDown }: { color: ArtColor; on: boolean; onPick: () => void; onDown: (event: PointerEvent<HTMLButtonElement>) => void }) {
  const { pick } = useDict();
  const well = PAINT_WELLS.find(item => item.id === color.id)!;
  return <button type="button" className="art-color" style={{ left: `${well.xPercent}%`, top: `${well.yPercent}%` }} aria-pressed={on} aria-label={pick(color.label)} onClick={onPick} onPointerDown={onDown}>
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path d={SHAPES[color.shape]} fill="#fffdf6" stroke="#17324f" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  </button>;
}

/* ชั้นที่บังทั้งหน้า: ส่วนที่ถูกบังต้องกด Tab ไปไม่ถึง ไม่งั้นโฟกัสหลุดไปปุ่มที่มองไม่เห็น คืนค่าเดิมด้วยฟังก์ชันที่ส่งกลับ */
function coverPage(cover: HTMLElement) {
  const hidden: HTMLElement[] = [];
  for (let el: HTMLElement | null = cover; el && el !== document.body; el = el.parentElement) {
    for (const sibling of el.parentElement?.children ?? []) {
      if (sibling !== el && sibling instanceof HTMLElement && !sibling.inert) { sibling.setAttribute('inert', ''); hidden.push(sibling); }
    }
  }
  return () => hidden.forEach(el => { el.removeAttribute('inert'); });
}

function Picker({ onPick }: { onPick: (picture: ArtPicture) => void }) {
  const { pick, sub, pickSub } = useDict();
  const [center, setCenter] = useState(1);
  const size = ART_PICTURES.length;
  const shown = [center - 1, center, center + 1].map(i => ART_PICTURES[(i + size) % size]);
  const stage = useRef<HTMLElement>(null);
  // มือถือแนวนอน หน้าเลือกรูปเต็มจอทับหัวเว็บ (เงื่อนไขเดียวกับ art.css)
  useEffect(() => {
    const short = window.matchMedia('(orientation: landscape) and (max-height: 520px)');
    let release: (() => void) | undefined;
    const sync = () => { release?.(); release = short.matches && stage.current ? coverPage(stage.current) : undefined; };
    sync();
    short.addEventListener('change', sync);
    return () => { short.removeEventListener('change', sync); release?.(); };
  }, []);
  return <section ref={stage} className="art-stage art-picker" aria-labelledby="art-title">
    <div className="art-picker-back"><BackLink /></div>
    <div className="art-sign"><h1 id="art-title"><TwoLine text={ART_TEXT.title} /></h1></div>
    <Image className="art-nuri" src="/Character/welcome.webp" alt="" width={300} height={300} sizes="180px" priority />
    <p className="art-choose"><TwoLine text={ART_TEXT.choose} /></p>
    <div className="art-carousel">
      <button type="button" className="art-plate art-arrow" aria-label={pick(ART_TEXT.previous)} onClick={() => setCenter(i => (i - 1 + size) % size)}><ArrowLeftIcon /></button>
      {shown.map((picture, i) => <button type="button" key={picture.id} className="art-pick" data-slot={i} data-picture={picture.id} onClick={() => onPick(picture)}
        aria-label={`${sub ? `${pick(picture.title)} / ${pickSub(picture.title)}` : pick(picture.title)}${picture.difficulty ? ` — ${pick(ART_DIFFICULTY[picture.difficulty])}` : ''}`}>
        <span className="art-frame"><PictureSvg picture={picture} fills={{}} label="" /></span>
        <span className="art-pick-name"><TwoLine text={picture.title} />{picture.difficulty && <span className="art-difficulty"><TwoLine text={ART_DIFFICULTY[picture.difficulty]} /></span>}</span>
      </button>)}
      <button type="button" className="art-plate art-arrow" aria-label={pick(ART_TEXT.next)} onClick={() => setCenter(i => (i + 1) % size)}><ChevronRightIcon /></button>
    </div>
  </section>;
}

function Board({ picture, onExit }: { picture: ArtPicture; onExit: () => void }) {
  const { pick } = useDict();
  const audio = useGameAudio();
  const gated = usePortraitGate(true);
  const [color, setColor] = useState(ART_COLORS[4]);
  const [historyCount, setHistoryCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const stage = useRef<HTMLElement>(null);
  const surface = useRef<PaintSurfaceHandle>(null);
  const brush = useRef<HTMLDivElement>(null);
  const brushOrigin = useRef({ left: 0, top: 0 });
  const moveBrush = useCallback((point: Point | null) => {
    const el = brush.current; if (!el) return;
    // Only resting/resize measures layout. Pointer movement writes transform directly.
    const home = !point ? stage.current?.querySelector('.art-color[aria-pressed="true"]')?.getBoundingClientRect() : undefined;
    if (!point && stage.current) brushOrigin.current = stage.current.getBoundingClientRect();
    if (!point && !home) return;
    const target = point ?? { x: home!.left + home!.width / 2, y: home!.top + home!.height / 2 };
    el.dataset.follow = point ? 'true' : 'false';
    el.style.transform = `translate3d(${target.x - brushOrigin.current.left}px, ${target.y - brushOrigin.current.top}px, 0)`;
  }, []);
  useEffect(() => {
    if (finished || gated) return;
    if (!surface.current?.isPainting()) moveBrush(null);
    const observer = new ResizeObserver(() => { if (!surface.current?.isPainting()) moveBrush(null); });
    if (stage.current) observer.observe(stage.current);
    return () => observer.disconnect();
  }, [color, finished, gated, moveBrush]);
  // กระดานบังทั้งหน้า ส่วนที่ถูกบังต้องกด Tab ไปไม่ถึง ไม่งั้นโฟกัสหลุดไปปุ่มที่มองไม่เห็น
  useEffect(() => {
    const release = stage.current ? coverPage(stage.current) : undefined;
    stage.current?.focus();
    return release;
  }, []);
  // กลับหน้าเลือกรูปหรือออกจากเกาะ คืนจอปกติ
  useEffect(() => { keepGameFullscreen(); return exitGameFullscreen; }, []);
  useEffect(() => { if (finished) heading.current?.focus(); }, [finished]);
  const finish = () => { surface.current?.end(); setFinished(true); audio.effect('levelComplete'); };
  return <section ref={stage} tabIndex={-1} className="art-stage art-board" aria-label={pick(picture.title)} data-finished={finished || undefined}
    onClickCapture={event => { if (surface.current?.isPainting()) { event.preventDefault(); event.stopPropagation(); } }}>
    <div className="art-board-inner" inert={gated}>
      <span className="art-frame"><PaintSurface ref={surface} picture={picture} color={color.value} readOnly={finished || gated} onHistory={setHistoryCount} onBrush={moveBrush} /></span>
      {finished
        ? <>
          <div className="art-result">
            <Image className="art-result-nuri" src="/Character/welcome.webp" alt="" width={300} height={300} sizes="150px" />
            <h2 ref={heading} tabIndex={-1}><TwoLine text={ART_TEXT.finished} /></h2>
            <button type="button" className="art-plate art-text-button" onClick={onExit}><TwoLine text={ART_TEXT.again} /></button>
            <button type="button" className="art-plate art-text-button" onClick={() => { setFinished(false); requestAnimationFrame(() => stage.current?.querySelector<HTMLButtonElement>('.art-color[aria-pressed="true"]')?.focus()); }}><TwoLine text={ART_TEXT.keep} /></button>
          </div>
        </>
        : <>
          <div className="art-rail">
            <button type="button" className="art-plate art-tool" aria-label={pick(ART_TEXT.back)} onClick={onExit}><ArrowLeftIcon /></button>
            <button type="button" className="art-plate art-tool" aria-label={pick(ART_TEXT.undo)} onClick={() => surface.current?.undo()} disabled={!historyCount}><ReplayIcon /></button>
          </div>
          <figure className="art-example">
            <figcaption><TwoLine text={ART_TEXT.example} /></figcaption>
            <span className="art-frame"><PictureSvg picture={picture} fills={exampleFills(picture)} label={pick(picture.title)} /></span>
          </figure>
          <div className="art-rail art-rail-end">
            <button type="button" className="art-plate art-tool art-done" aria-label={pick(ART_TEXT.done)} onClick={finish}>
              <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M10 26l10 10 18-22" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
          <div className="art-tray" role="group" aria-label={pick(ART_TEXT.colors)}
            onPointerMove={event => surface.current?.move(event)}
            onPointerUp={event => surface.current?.release(event)}
            onPointerCancel={event => surface.current?.release(event)}
            onLostPointerCapture={event => surface.current?.release(event)}>
            {ART_COLORS.map(item => <ColorTile key={item.id} color={item} on={item.id === color.id} onPick={() => setColor(item)}
              onDown={event => { if (surface.current?.fromTray(event, item.value)) setColor(item); }} />)}
          </div>
        </>}
    </div>
    {!finished && !gated && <div className="art-brush-overlay" aria-hidden="true"><div ref={brush} className="art-brush">
      <span className="art-brush-art" style={{ left: `${-BRUSH_TIP.x}%`, top: `${-BRUSH_TIP.y}%` }}>
        <span className="art-brush-tint" style={{ backgroundColor: color.value }} />
      </span>
    </div></div>}
    {gated && <RotateGate back={<button type="button" className="gc-button" onClick={onExit}><TwoLine text={ART_TEXT.back} /></button>} />}
  </section>;
}

export function ArtStudio() {
  const [picture, setPicture] = useState<ArtPicture | null>(null);
  // การแตะรูปคือจังหวะเดียวที่เบราว์เซอร์ยอมให้เต็มจอ PC ไม่เปลี่ยน
  const open = (next: ArtPicture) => { enterGameFullscreen(); setPicture(next); };
  return picture ? <Board key={picture.id} picture={picture} onExit={() => setPicture(null)} /> : <Picker onPick={open} />;
}
