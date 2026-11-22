'use client';

import { useEffect, useRef, useState } from 'react';
import { useSound } from '@/components/sound/SoundProvider';
import { GameImage } from '../components/GameImage';
import { CanalMachinery, lockHints } from './CanalMachinery';
import { useDict } from '@/i18n/LocaleProvider';
import { useWorkshopFinish, WorkshopStage } from '../components/WorkshopStage';
import type { PlayProps } from '../components/GameShell';
import { canalMission, lockTarget, nextLockAction, operateLock, type Berth, type LockAction, type LockState } from '../engine/canalLock';
import './canal-lock.css';

const positions: Record<Berth, number> = { approach: 155, chamber: 480, harbour: 824 };
const centreY = (water: number) => 310 - water * 28;
const unit = (n: number) => Math.max(0, Math.min(1, n));
function smooth(n: number) { const t = unit(n); return t * t * (3 - 2 * t); }

function GateLeaf({ x, front, opened, swing }: { x: number; front: boolean; opened: number; swing: number }) {
  // Swing each leaf about its bank-side hinge. The foreshortened Y axis matches the railway camera.
  // A closed pair forms a mitre. Both faces stay visible, even from directly across the canal.
  const closedAngle = Math.PI / 6;
  const angle = closedAngle + opened * (Math.PI / 2 - closedAngle);
  const near = front ? 292 : 217;
  const end = near + (front ? -1 : 1) * 37.5 * Math.cos(angle) / Math.cos(closedAngle);
  const tip = x + swing * 76 * Math.sin(angle);
  const height = 82;
  const dx = tip - x, dy = end - near;
  return <g strokeLinejoin="round">
    <path d={`M${x-5} ${near-7} l10 0 L${tip+5} ${end-7} l0 ${height} l-10 0 L${x-5} ${near+height-7} Z`} fill="#164e55" stroke="#184c53" strokeWidth="3"/>
    <path d={`M${x+4} ${near-4} L${tip+4} ${end-4} v${height-5} L${x+4} ${near+height-9} Z`} fill={front ? '#367f77' : '#549d8d'}/>
    {[.22,.5,.78].map(t => <path key={t} d={`M${x+dx*t+4} ${near+dy*t} v${height-13}`} stroke="#205f60" strokeWidth="3"/>)}
    <path d={`M${x+3} ${near+9} L${tip+3} ${end+height-18}`} stroke="#d9a256" strokeWidth="4"/>
    <path d={`M${x} ${near-8} L${tip} ${end-8}`} stroke="#715237" strokeWidth="11" strokeLinecap="round"/>
    <path d={`M${x} ${near-11} L${tip} ${end-11}`} stroke="#f7ca79" strokeWidth="6" strokeLinecap="round"/>
    <ellipse cx={x} cy={near-11} rx="6" ry="3.5" fill="#fff1b7"/>
  </g>;
}

function Scene({ water, boatX, boatWater, target, entrance, gate, opening }: {
  water: number; boatX: number; boatWater: number; target: number; entrance: boolean; gate: number; opening: number;
}) {
  const waterY = centreY(water), front = waterY + 37, rear = waterY - 37;
  const gauge = entrance ? 337 : 623;
  const mark = centreY(target) - 37;
  return <svg className="ws-layer" viewBox="0 0 960 480" aria-hidden="true">
    <defs>
      <linearGradient id="canal-surface" x2="0" y2="1" gradientUnits="objectBoundingBox">
        <stop stopColor="#7ab5b9"/><stop offset="1" stopColor="#80bdc0"/>
      </linearGradient>
      <linearGradient id="canal-depth" x2="0" y2="1">
        <stop stopColor="#349faa"/><stop offset="1" stopColor="#3099a6"/>
      </linearGradient>
    </defs>
    <path d={`M304 ${rear} H656 V${front} H304Z`} fill="url(#canal-surface)"/>
    <path d={`M304 ${front} H656 V385 H304Z`} fill="url(#canal-depth)"/>
    <path d={`M304 ${front}H656`} stroke="#99cecc" strokeWidth="2"/>
    {[0,1,2,3,4].map(i => <path key={i} d={`M${326+59*i} ${waterY+12*Math.sin(i*2)} q8 -3 16 0 t16 0`} stroke="#c6f2e6" strokeOpacity=".56" fill="none" strokeWidth="2.3" strokeLinecap="round"/>)}
    <path d={`M${gauge} 198v87`} stroke="#194c55" strokeWidth="17" strokeLinecap="round"/>
    {[0,1,2].map(h => <path key={h} d={`M${gauge-5} ${centreY(h)-37}h10`} stroke="white" strokeWidth="3"/>)}
    <path d={`M${gauge-17} ${mark}h34`} stroke="#5d442b" strokeWidth="12" strokeLinecap="round"/>
    <path d={`M${gauge-17} ${mark}h34`} stroke="#ffd462" strokeWidth="7" strokeLinecap="round"/>
    <path d={`M${gauge+17} ${mark} l13 -10 v20Z`} fill="#ffdc6a" stroke="#674a2c" strokeWidth="2"/>
    <path d={`M${gauge-24} ${rear}h13`} stroke="#184b59" strokeWidth="8" strokeLinecap="round"/>
    <path d={`M${gauge-24} ${rear}h13`} stroke="white" strokeWidth="4" strokeLinecap="round"/>
    {[304,656].map(x => <GateLeaf key={x} x={x} front={false} swing={x===304?-1:1} opened={x===gate?opening:0}/>)}
    <g transform={`translate(${boatX} ${centreY(boatWater)})`}>
      <ellipse cx="0" cy="1" rx="65" ry="9" fill="#196c78" opacity=".36"/>
      <path d="M-80 -1q7 4 16 3m-10 5q11 4 20 1" fill="none" stroke="#e1fff0" strokeWidth="2.5" strokeLinecap="round"/>
      <image href="/games/canal-lock/boat.webp" x="-82.5" y="-88" width="165" height="110"/>
    </g>
    {[304,656].map(x => <GateLeaf key={x} x={x} front swing={x===304?-1:1} opened={x===gate?opening:0}/>)}
  </svg>;
}

type Motion = { to: LockState; action: LockAction };
export default function CanalLockBoard({ level, paused, onTap, onFeedback, onComplete, onProgress }: PlayProps) {
  const { pick } = useDict();
  const mission = canalMission(level);
  const [state, setState] = useState(mission.start);
  const [motion, setMotion] = useState<Motion | null>(null);
  const [fraction, setFraction] = useState(0);
  const [coaching, setCoaching] = useState(false);
  const { enabled, speak } = useSound();
  const lastHint = useRef('');
  const strayTaps = useRef(0);
  const elapsed = useRef(0);
  const stage = useRef<HTMLDivElement>(null);
  const done = state.berth === 'harbour';
  const entrance = state.berth === 'approach';
  const needed = nextLockAction(mission, state);
  const total = mission.start.berth === 'chamber' ? 1 : 2;
  useEffect(() => { onProgress(done ? total : entrance ? 0 : total-1, total); }, [done, entrance, total, onProgress]);
  useWorkshopFinish(done, paused, onComplete);
  useEffect(() => {
    if (motion || paused || done || coaching) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    function arm() {
      clearTimeout(timer);
      if (!document.hidden) timer = setTimeout(() => setCoaching(true), 8000);
    }
    arm();
    document.addEventListener('visibilitychange', arm);
    return () => { clearTimeout(timer); document.removeEventListener('visibilitychange', arm); };
  }, [motion, paused, done, coaching]);
  const guide = coaching && !paused && !motion && !done ? needed : null;
  const hintKey = guide === 'open' ? entrance ? 'left' : 'right' : guide;
  useEffect(() => {
    if (!hintKey || !enabled) { lastHint.current = ''; return; }
    if (lastHint.current === hintKey) return;
    lastHint.current = hintKey;
    speak(pick(lockHints[hintKey]), 'canal-hint-' + hintKey);
  }, [hintKey, enabled, pick, speak]);

  useEffect(() => {
    if (!motion || paused) return;
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 230 : motion.action === 'open' ? 1750 : 570;
    let frame = 0, previous = 0;
    function tick(now: number) {
      elapsed.current += previous ? Math.min(now - previous, 64) : 0;
      previous = now;
      const t = unit(elapsed.current / duration);
      setFraction(t);
      if (t < 1) frame = requestAnimationFrame(tick);
      else if (motion) { setState(motion.to); setMotion(null); }
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [motion, paused]);

  function act(action: LockAction, wrongGate: boolean) {
    if (paused || motion || done) return;
    const to = operateLock(mission, state, action);
    strayTaps.current = 0;
    if (wrongGate || to === state) { setCoaching(true); onTap(); return; }
    if (action !== needed) setCoaching(true);
    if (action === 'open') setCoaching(false);
    if (action === 'open') onFeedback(true); else onTap();
    elapsed.current = 0;
    setFraction(0);
    setMotion({ to, action });
  }
  const target = lockTarget(mission, state.berth);
  const water = state.water + ((motion?.to.water ?? state.water)-state.water) * smooth(fraction);
  const boatX = positions[state.berth] + (positions[motion?.to.berth ?? state.berth]-positions[state.berth]) * smooth((fraction-.24)/.52);
  const opening = motion?.action === 'open' ? smooth(fraction/.24) * smooth((1-fraction)/.24) : 0;
  const message = done ? { th:'เรือถึงท่าแล้ว!', en:'The boat made it!' }
    : motion?.action === 'open' ? { th:'เรือกำลังผ่านประตู', en:'Sailing through the gate' }
    : hintKey ? lockHints[hintKey]
    : motion?.action === 'fill' ? { th:'น้ำไหลเข้า เรือในห้องจะลอยสูงขึ้น', en:'Water flows in and lifts a boat inside the lock.' }
    : motion?.action === 'drain' ? { th:'น้ำไหลออก ระดับน้ำลดลง', en:'Water flows out and the level falls.' }
    : level === 1 ? lockHints[needed === 'open' ? 'right' : needed]
    : entrance ? { th:'ปรับน้ำให้เท่าฝั่งเรือ แล้วเปิดประตูรับเรือ', en:'Match the water beside the boat, then let it in.' }
    : { th:'ปรับน้ำให้เท่าฝั่งท่าเรือ แล้วเปิดประตูให้เรือออก', en:'Match the exit water, then let the boat out.' };
  return <WorkshopStage slug="canal-lock" stage={stage} level={level} message={message}
    action={hintKey && <GameImage src="/Character/point.webp" width={64} height={64} alt="" className="canal-nuri"/>}>
    <div className="canal-controls" data-water={state.water} data-berth={state.berth} data-moving={!!motion}
      onClick={e=>{
        if (paused || motion || done || (e.target as Element).closest('button')) return;
        if (++strayTaps.current >= 2) setCoaching(true);
      }}>
      <Scene water={water} boatX={boatX} boatWater={entrance ? mission.left : water} target={target} entrance={entrance} gate={entrance?304:656} opening={opening}/>
      <CanalMachinery key={paused ? 'paused' : 'play'} entrance={entrance} action={motion?.action}
        fraction={fraction} opening={opening} water={water} disabled={paused || done || !!motion} hint={guide} onOperate={act}/>
      <span className="sr-only" role="status" aria-atomic="true">{pick({
        th: `น้ำในห้องระดับ ${state.water+1} จาก 3 ขีดสีทองอยู่ระดับ ${target+1}`,
        en: `Lock water level ${state.water+1} of 3. The gold mark is at level ${target+1}.`,
      })}</span>
    </div>
  </WorkshopStage>;
}
