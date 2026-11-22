'use client';
import { memo, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { useDict } from '@/i18n/LocaleProvider';
import type { PlayProps } from '../components/GameShell';
import { ActionLabel, at, useWorkshopFinish, WorkshopStage } from '../components/WorkshopStage';
import { RailLever, leverControl, SplitHatch, toggleLever } from '../components/MarbleMechanisms';
import { useMarbleLaunch } from '../engine/useMarbleLaunch';
import { followMarble, marbleMachine, nextMarbleGate, type Direction, type Peg } from '../engine/marbleRun';
import './marble-run.css';

const GUIDE_DELAY_MS = 8000;
const MARBLE_SIZE = 50;
const guideArrow = 'M-28 -7H-9V-16L11 0 -9 16V7H-28Z';

function GuideArrow() {
  return <g strokeLinejoin="round" className="marble-guide-arrow">
    <path d={guideArrow} fill="#fff7da" stroke="#fff7da" strokeWidth="9"/>
    <path d={guideArrow} fill="#ffcf45" stroke="#173748" strokeWidth="4"/>
  </g>;
}

function useIdleGuide(stage: RefObject<HTMLDivElement | null>, waiting: boolean) {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    const board = stage.current?.parentElement;
    if (!waiting || !board) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    function arm() {
      clearTimeout(timer);
      if (!document.hidden) timer = setTimeout(() => setIdle(true), GUIDE_DELAY_MS);
    }
    function activity() { setIdle(false); arm(); }
    arm();
    const events = ['pointerdown', 'pointermove', 'click', 'keydown', 'focusin'] as const;
    for (const event of events) board.addEventListener(event, activity);
    document.addEventListener('visibilitychange', activity);
    return () => {
      clearTimeout(timer);
      for (const event of events) board.removeEventListener(event, activity);
      document.removeEventListener('visibilitychange', activity);
      setIdle(false);
    };
  }, [stage, waiting]);
  return waiting && idle;
}

const star = 'M0 -42 12 -16 40 -13 20 8 25 37 0 23 -25 37 -20 8 -40 -13 -12 -16 Z';

// The marker sits on the far side of each cup, away from its incoming ramp.
function DestinationMarker({ side }: { side: -1 | 1 }) {
  const x = side * 52;
  const pointer = `M${x} -67 L${side*7} -16`;
  return <g className="marble-beacon">
    <ellipse rx="40" ry="22" fill="none" stroke="#20384b" strokeWidth="9"/>
    <ellipse rx="40" ry="22" fill="none" stroke="#ffe275" strokeWidth="5"/>
    <path d={pointer} fill="none" stroke="#20384b" strokeWidth="13" strokeLinecap="round"/>
    <path d={pointer} fill="none" stroke="#ffdb62" strokeWidth="6" strokeLinecap="round"/>
    <g transform={`translate(${x} -67)`} strokeLinejoin="round">
      <path d={star} fill="#fff4cf" stroke="#fff4cf" strokeWidth="13"/>
      <path className="marble-goal-star" d={star} fill="#ffd04a" stroke="#20384b" strokeWidth="7"/>
      <path d="M0 -31 0 0 -9 -12 Z M0 0 29 -9 15 6 Z M0 0 17 27 0 17 Z" fill="#fff09a"/>
    </g>
  </g>;
}
type Hint = 'build' | 'gap' | 'miss' | 'next';

const Switch = memo(function Switch({ point, tracks, dir, level }: {
  point: Peg; tracks: Peg[][]; dir: Direction; level: number;
}) {
  // The two transparent renders share the camera framing with the landscape.
  // Each crop includes only this pivot and its removable section of channel.
  const ends = [tracks[0][9], tracks[1][9]];
  const left = Math.min(ends[0].x, ends[1].x) - 38;
  const top = point.y - 38;
  const w = Math.abs(ends[1].x - ends[0].x) + 76;
  const h = Math.max(ends[0].y, ends[1].y) - top + 45;
  const side = dir === -1 ? 'left' : 'right';
  return <g>
    {!dir && tracks.map((track, index) => <polyline key={index}
      points={track.slice(0, 10).map(p => p.x + ',' + (p.y + 9)).join(' ')}
      fill="none" stroke="#fff3c8" strokeWidth="3" strokeDasharray="4 6" strokeLinecap="round"/>)}
    {!!dir && <svg x={left} y={top} width={w} height={h} viewBox={`${left} ${top} ${w} ${h}`}>
      <image href={`/games/marble-run/switch-${Math.min(level, 2)}-${side}.webp`} width="960" height="480"/>
    </svg>}
    <RailLever point={point} dir={dir}/>
  </g>;
});

export default function MarbleRunBoard({ level, paused, onTap, onProgress, onComplete, onFeedback }: PlayProps) {
  const { pick } = useDict();
  const machine = useMemo(() => marbleMachine(level), [level]);
  const [dirs, setDirs] = useState<Direction[]>(() => machine.gates.map(() => 0));
  const [score, setScore] = useState(0);
  const [hint, setHint] = useState<Hint>('build');
  const stage = useRef<HTMLDivElement>(null);
  const target = machine.goals[score];
  const done = score >= machine.goals.length;
  const {running, ball, open, launch, reload} = useMarbleLaunch(machine.intake, paused, cup => {
    const correct=cup===target;
    onFeedback(correct);
    if(correct){setScore(n=>n+1);setHint('next');}
    else setHint(cup<0?'gap':'miss');
  });
  const showGuide = useIdleGuide(stage, !running && !done && !paused);
  const guideGate = showGuide ? nextMarbleGate(machine, dirs, target) : null;
  const guidePoint = guideGate === null ? null : leverControl(machine.gates[guideGate]);
  const guideRelease = showGuide && guideGate === null;
  const lastCup = hint === 'next' ? machine.goals[score - 1] : -1;
  useWorkshopFinish(done, paused, onComplete);
  useEffect(() => { onProgress(score, machine.goals.length); }, [score, machine, onProgress]);

  function flip(i: number) {
    if (paused || running || done) return;
    setDirs(old => old.map((v, j) => i === j ? toggleLever(v) : v));
    reload(); setHint('build'); onTap();
  }
  const message = done ? { th:'ส่งลูกแก้วครบทุกถ้วยแล้ว!', en:'All deliveries complete!' } :
    running ? { th:'ตามดูลูกแก้วกัน', en:'Follow the marble.' } :
    guideGate !== null ? { th:'แตะคันโยกที่ '+(guideGate+1)+' ตรงลูกศร', en:'Tap lever '+(guideGate+1)+' by the arrow.' } :
    guideRelease ? { th:'รางพร้อมแล้ว กดปล่อยลูกแก้วได้เลย', en:'The track is ready. Release the marble!' } :
    hint === 'gap' ? { th:'ลูกแก้วตกตรงช่องว่าง ลองเติมรางตรงนั้นนะ', en:'A ramp is missing. Fill the gap and try again.' } :
    hint === 'miss' ? { th:'ลองสลับทางราง ให้ลูกแก้วไปหาดาว', en:'Switch a ramp to reach the star.' } :
    { th:'พาลูกแก้วไปถ้วยที่ '+(target+1)+' ★', en:'Guide the marble to cup '+(target+1)+' ★' };
  return <WorkshopStage slug="marble-run" level={level} stage={stage} message={message} action={
    <button type="button" className="ws-action marble-launch" disabled={running || done || paused} onClick={() => {
      setHint('build'); launch(followMarble(machine, dirs)); onTap();
    }}>
      {guideRelease && <svg className="marble-launch-guide" data-guide="release" viewBox="-34 -23 50 46" aria-hidden="true"><GuideArrow/></svg>}
      <span className="marble-launch-medallion" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20"><path d="M7 4.5Q7 3 8.5 4L20 11Q21.5 12 20 13L8.5 20Q7 21 7 19.5Z" fill="currentColor"/></svg></span>
      <span><ActionLabel text={{th:'ปล่อยลูกแก้ว', en:'Release marble'}}/></span>
    </button>}>
    <svg className="ws-layer" viewBox="0 0 960 480" aria-hidden="true">
      <g transform={`translate(${machine.rotor.pivot.x} ${machine.rotor.pivot.y}) scale(1 ${machine.rotor.height/machine.rotor.width})`}>
        <g className="marble-rotor" style={{animationPlayState: paused ? 'paused' : 'running'}}>
          <image href={`/games/marble-run/rotor-${level}.webp`} x={-machine.rotor.width/2} y={-machine.rotor.width/2}
            width={machine.rotor.width} height={machine.rotor.width}/>
        </g>
      </g>
      <SplitHatch point={machine.intake} open={open}/>
      {machine.gates.map((point,i) => <Switch key={i} level={level} point={point} tracks={machine.tracks[i]} dir={dirs[i]}/>)}
      {machine.cups.map((p,i) => <g key={i} transform={`translate(${p.x} ${p.y})`}>
        {target === i && <DestinationMarker side={i%2===0 ? -1 : 1}/>}
        <rect x="-15" y="22" width="30" height="24" rx="7" fill={target===i ? '#ffe275' : '#29434b'} stroke="#20384b" strokeWidth="2"/>
        <text y="41" textAnchor="middle" fill={target===i ? '#20384b' : '#fff3ce'} fontSize="20" fontWeight="bold">{i+1}</text>
      </g>)}
      {guidePoint && <g data-guide={guideGate} aria-hidden="true"
        transform={`translate(${guidePoint.x-23} ${guidePoint.y-12}) rotate(38) scale(1.2)`}>
        <GuideArrow/>
      </g>}
      <image data-marble="" href="/games/marble-run/marble.webp" x={ball.x-MARBLE_SIZE/2} y={ball.y-MARBLE_SIZE/2} width={MARBLE_SIZE} height={MARBLE_SIZE}
        transform={`rotate(${(ball.x-machine.intake.x)*2.6} ${ball.x} ${ball.y})`}/>
      <SplitHatch point={machine.intake} open={open} front/>
      {lastCup >= 0 && !paused && <g key={score} transform={`translate(${machine.cups[lastCup].x} ${machine.cups[lastCup].y})`}>
        <ellipse className="marble-ripple" rx="30" ry="16" fill="none" stroke="#ffeb9a" strokeWidth="4"/>
      </g>}
    </svg>
    {machine.gates.map((p,i) => <button type="button" key={i} className="ws-hotspot" style={at(leverControl(p))} disabled={running || paused || done}
      data-gate={i} data-direction={dirs[i]} aria-label={pick({th:'คันโยก '+ (i+1)+' '+['ทางซ้าย','ตรงกลาง','ทางขวา'][dirs[i]+1],en:'Lever '+ (i+1)+' '+['left','centre','right'][dirs[i]+1]})} onClick={() => flip(i)}/>)}
  </WorkshopStage>;
}
