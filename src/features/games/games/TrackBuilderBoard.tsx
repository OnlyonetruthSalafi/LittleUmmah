'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { HandTapIcon } from '@/components/icons/HandTapIcon';
import { useDict } from '@/i18n/LocaleProvider';
import { GameImage } from '../components/GameImage';
import type { PlayProps } from '../components/GameShell';
import { gamePresentation } from '../data/presentation';
import { engineGround, engineSize, headings, railArt, railPoint, routes, waitPosition, type RailRoute } from '../engine/trackBuilder';
import { shuffle } from '../engine/rules';
import './track-builder.css';

const pieces = [
  { th: 'โค้งลง', en: 'Bend down' }, { th: 'ทางตรง', en: 'Straight' }, { th: 'โค้งขึ้น', en: 'Bend up' },
];
const maps = routes.map(route => route.steps.map((_, span) => railArt(route, span)));
const samples = headings.map(turn => {
  const model = { ...routes[0], startY: 0, steps: [turn] };
  const end = railPoint(model, 0, 1);
  const start = railPoint(model, 0, 0);
  return { art: railArt(model, 0), box: [start.x - 7, (start.y + end.y) / 2 - 37, end.x - start.x + 14, 74].join(' ') };
});

function Rails({ art }: { art: ReturnType<typeof railArt> }) {
  return <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d={art.ties} stroke="#684633" strokeWidth="6" />
    <path d={art.ties} stroke="#b98152" strokeWidth="3.4" transform="translate(0 -1)" />
    <path d={art.rails} stroke="#263d48" strokeWidth="4.2" />
    <path d={art.rails} stroke="#f8e7af" strokeWidth="1.65" transform="translate(0 -1.2)" />
  </g>;
}

function pose(route: RailRoute, distance: number) {
  const span = Math.max(0, Math.floor(distance));
  return railPoint(route, span, distance - span);
}

const carriageSpacing = .90;
const translate = (x: number, y: number) => 'translate(' + x + ' ' + y + ')';
const frameX = (heading: number) => Math.max(0, Math.min(4, 2 + Math.round(heading / 24))) * 224;

function Train({ route, target, moving, paused, onArrive }: {
  route: RailRoute; target: number; moving: boolean; paused: boolean; onArrive: () => void;
}) {
  const group = useRef<SVGGElement>(null);
  const sprite = useRef<SVGSVGElement>(null);
  const coupling = useRef<SVGLineElement>(null);
  const carriage = useRef<SVGGElement>(null);
  const carriageSprite = useRef<SVGSVGElement>(null);
  const position = useRef(target);
  const start = waitPosition(route, 0);
  const first = pose(route, start);
  const rear = pose(route, start - carriageSpacing);

  useEffect(() => {
    if (!moving || paused) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let last = 0;
    let previousView = -1;
    let previousRearView = -1;
    function advance(now: number) {
      const delta = last ? Math.min(now - last, 64) : 0;
      last = now;
      position.current = reduced ? target : Math.min(target, position.current + delta / 900);
      const p = pose(route, position.current);
      const coach = pose(route, position.current - carriageSpacing);
      coupling.current?.setAttribute('x2', String(coach.x - p.x));
      coupling.current?.setAttribute('y2', String(coach.y - p.y - 9));
      carriage.current?.setAttribute('transform', translate(coach.x - p.x, coach.y - p.y));
      const rearView = frameX(coach.heading);
      if (rearView !== previousRearView) {
        carriageSprite.current?.setAttribute('viewBox', rearView + ' 224 224 224');
        previousRearView = rearView;
      }
      group.current?.setAttribute('transform', translate(p.x, p.y));
      const view = frameX(p.heading);
      if (view !== previousView) {
        sprite.current?.setAttribute('viewBox', view + ' 0 224 224');
        previousView = view;
      }
      if (position.current >= target) onArrive();
      else frame = requestAnimationFrame(advance);
    }
    frame = requestAnimationFrame(advance);
    return () => cancelAnimationFrame(frame);
  }, [moving, paused, target, route, onArrive]);

  return <g ref={group} transform={translate(first.x, first.y)}>
    <line ref={coupling} x1="0" y1="-9" x2={rear.x-first.x} y2={rear.y-first.y-9} stroke="#37474d" strokeWidth="3.5" />
    <g ref={carriage} transform={translate(rear.x - first.x, rear.y - first.y)}>
      <ellipse cy="-1" rx="38" ry="7" fill="#493828" opacity=".20" />
      <svg ref={carriageSprite} x={-engineSize/2} y={-engineGround} width={engineSize} height={engineSize} viewBox="448 224 224 224" overflow="hidden">
        <image width="1120" height="448" href="/games/track-builder/locomotive.webp" />
      </svg>
    </g>
    <ellipse cx="0" cy="-1" rx="50" ry="8" fill="#493828" opacity=".23" />
    <svg ref={sprite} x={-engineSize/2} y={-engineGround} width={engineSize} height={engineSize} viewBox="448 0 224 224" overflow="hidden">
      <image width="1120" height="448" href="/games/track-builder/locomotive.webp" />
    </svg>
  </g>;
}

export default function TrackBuilderBoard({ level, paused, onFeedback, onResetFeedback, onProgress, onComplete }: PlayProps) {
  const { pick, sub } = useDict();
  const route = routes[level - 1];
  const artwork = maps[level - 1];
  const name = gamePresentation['track-builder'].levels[level - 1];
  const [choices] = useState(() => shuffle(headings));
  const [laid, setLaid] = useState(0);
  const [moving, setMoving] = useState(false);
  const [wrong, setWrong] = useState<number | null>(null);
  const active = route.gaps[laid];
  const done = laid === route.gaps.length;
  const hint = moving ? { th: 'รถไฟออกเดินทางแล้ว!', en: 'All aboard!' }
    : wrong !== null ? { th: 'ลองรางชิ้นอื่นนะ', en: 'Try another track.' }
    : { th: 'แตะรางบนรถเข็น', en: 'Tap a track on the cart.' };

  useEffect(() => { onProgress(laid, route.gaps.length); }, [laid, route, onProgress]);
  const arrive = useCallback(() => {
    if (done) onComplete();
    else { setMoving(false); onResetFeedback?.(); }
  }, [done, onComplete, onResetFeedback]);

  function place(turn: number) {
    if (paused || moving || done) return;
    const fits = turn === route.steps[active];
    onFeedback(fits);
    setWrong(fits ? null : turn);
    if (fits) { setMoving(true); setLaid(laid + 1); }
  }

  return <div className="rail-game" data-moving={moving} data-laid={laid}>
    <div className="rail-window">
      <GameImage alt="" src={'/games/track-builder/' + route.scene + '.webp'} width={1280} height={640}
        loading="eager" fetchPriority="high" unoptimized draggable={false} />
      <svg className="rail-map" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g transform={'translate(' + (railPoint(route, 0, -.75).x - railPoint(route, 0, 0).x) + ' 0)'}>
          <Rails art={artwork[0]} />
        </g>
        {artwork.map((art, i) => {
          const gap = route.gaps.indexOf(i);
          if (gap < 0 || gap < laid) return <Rails key={i} art={art} />;
          const selected = active === i && !moving;
          return <g key={i} fill="none">
            <path d={art.center} stroke={selected ? '#925026' : '#877765'} strokeWidth={selected ? 28 : 14} opacity={selected ? .93 : .35} />
            {selected && <><path d={art.center} stroke="#ffd16a" strokeWidth="23" />
              <path d={art.center} stroke="#81501d" strokeWidth="3.5" strokeDasharray="6 5" /></>}
          </g>;
        })}
        <Train route={route} target={waitPosition(route, laid)} moving={moving} paused={paused} onArrive={arrive} />
      </svg>
      <div className="rail-stop">{pick(name)}{sub && <small lang="en">{name.en}</small>}</div>
      <div className="rail-cart">
        <div className="rail-parts" role="group" aria-label={pick({ th:'ชิ้นรางบนรถเข็น', en:'Tracks on the cart' })}>
          {choices.map(turn => <button key={turn} type="button" className="rail-part" data-turn={turn}
            aria-disabled={paused || moving || done} data-retry={wrong === turn} onClick={() => place(turn)}>
            <svg className="rail-loose-track" aria-hidden="true" viewBox={samples[turn+1].box}><Rails art={samples[turn+1].art} /></svg>
            <span>{pick(pieces[turn+1])}{sub && <small lang="en">{pieces[turn+1].en}</small>}</span>
            {level === 1 && laid === 0 && turn === route.steps[active] && <HandTapIcon className="rail-hand" />}
          </button>)}
        </div>
        <div className="rail-hint" role="status"><strong>{pick(hint)}</strong>{sub && <small lang="en">{hint.en}</small>}
          {!moving && !done && <span className="sr-only">{pick(pieces[route.steps[active]+1])}</span>}
        </div>
      </div>
    </div>
  </div>;
}
