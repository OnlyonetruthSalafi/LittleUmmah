'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { useDict } from '@/i18n/LocaleProvider';
import type { PlayProps } from '../components/GameShell';
import { ActionLabel, at, pointOnBoard, useWorkshopFinish, WorkshopStage, type Point } from '../components/WorkshopStage';

const lanes = [[480], [320,640], [250,480,710]];
const fasten = { th:'สอดกระดุม', en:'Fasten button' };
const closeZip = { th:'รูดซิป', en:'Close zipper' };
const choose = { th:'เลือกชิ้นที่มีวงแหวน', en:'Pick the ringed piece' };
const folder = '/games/buttons-zips/';

export default function ButtonsZipsBoard({ level, paused, onTap, onFeedback, onProgress, onComplete }: PlayProps) {
  const { pick } = useDict();
  const stage = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ id:number; origin:Point } | null>(null);
  const [step,setStep] = useState(0);
  const [selected,setSelected] = useState(false);
  const [fraction,setFraction] = useState(0);
  const [miss,setMiss] = useState(false);
  const xs = lanes[level-1];
  const zip = step >= xs.length;
  const done = step > xs.length;
  const start = zip ? {x:240,y:322} : {x:xs[step],y:247};
  const end = zip ? {x:720,y:322} : {x:start.x,y:139};
  const handle = {x:start.x+(end.x-start.x)*fraction,y:start.y+(end.y-start.y)*fraction};
  const zipX = done ? 720 : zip ? handle.x : 240;
  const action = zip ? closeZip : fasten;
  const message = done ? {th:'กระเป๋าพร้อมแล้ว!',en:'Your pouch is ready!'}
    : miss ? {th:'ลองลากชิ้นเดิมไปให้ถึงวงปลายทางนะ',en:'Try again. Drag all the way to the ring.'}
    : zip ? {th:'ลากหัวซิปไปถึงปลายขวา',en:'Slide the zipper all the way to the right.'}
    : {th:'ลากกระดุมขึ้นไปสอดรังดุม',en:'Slide the button up into its buttonhole.'};
  useEffect(()=>{onProgress(step,xs.length+1);},[step,xs,onProgress]);
  useWorkshopFinish(done,paused,onComplete);

  useEffect(()=>{if(paused) gesture.current=null;},[paused]);
  if(paused && (fraction || selected)) { setFraction(0); setSelected(false); }

  function resetGesture() { gesture.current=null; setFraction(0); }
  function finish() {
    if(paused || done) return;
    resetGesture(); setSelected(false); setMiss(false); setStep(step+1); onFeedback(true);
  }
  function begin(e:PointerEvent<HTMLButtonElement>) {
    if(paused || done || !stage.current || !e.isPrimary || e.button!==0) return;
    gesture.current={id:e.pointerId,origin:pointOnBoard(stage.current,e.clientX,e.clientY)};
    e.currentTarget.setPointerCapture(e.pointerId);
    setSelected(true); setMiss(false); onTap();
  }
  function move(e:PointerEvent<HTMLButtonElement>,release=false) {
    const g=gesture.current;
    if(!g || g.id!==e.pointerId || !stage.current) return;
    if(paused) {resetGesture();return;}
    const p=pointOnBoard(stage.current,e.clientX,e.clientY);
    const dx=p.x-g.origin.x, dy=p.y-g.origin.y;
    const distance=zip ? dx/(end.x-start.x) : dy/(end.y-start.y);
    setFraction(Math.min(1,Math.max(0,distance)));
    if(release) {
      if(distance>=.82 && Math.abs(zip?dy:dx)<86) finish();
      else {
        resetGesture();
        if(Math.hypot(dx,dy)>28) {setMiss(true);onFeedback(false);}
      }
    }
  }
  return <WorkshopStage slug="buttons-zips" level={level} stage={stage} message={message}
    action={<button className="ws-action" type="button" disabled={paused || done} onClick={()=>{if(selected) finish();else {setSelected(true);onTap();}}}>
      <ActionLabel text={selected?action:choose}/></button>}>
    <svg viewBox="0 0 960 480" className="ws-layer" aria-hidden="true">
      <path d={'M240 322H'+zipX+' L720 305 M'+zipX+' 322 L720 339'} fill="none" stroke="#68452f" strokeWidth="11"/>
      {Array.from({length:49},(_,i)=>{
        const x=240+i*10, opening=17*Math.max(0,(x-zipX)/Math.max(1,720-zipX));
        return <g key={x} fill="#f7c46d" stroke="#8b582b" strokeWidth="1.7">
          <rect x={x-3} y={318-opening} width="6" height="6" rx="2"/><rect x={x} y={322+opening} width="6" height="6" rx="2"/>
        </g>;
      })}
      {!done && <><ellipse cx={end.x} cy={end.y} rx="41" ry="25" fill="none" stroke="#fff3bd" strokeWidth="5" strokeDasharray="8 5"/>
        <circle cx={handle.x} cy={handle.y} r="46" fill="none" stroke="#254b5e" strokeWidth="8"/>
        <circle cx={handle.x} cy={handle.y} r="46" fill="none" stroke="#ffe283" strokeWidth="4"/></>}
      {xs.map((x,i)=><image key={x} href={folder+'button.webp'} x={x-49} y={(i<step?139:i===step?handle.y:247)-49} width="98" height="98"/>)}
      <image href={folder+'pull.webp'} x={zipX-41} y="281" width="82" height="82"/>
    </svg>
    {!done && <button key={step} className="ws-hotspot" style={at(start)} aria-label={pick(action)} aria-pressed={selected}
      onPointerDown={begin} onPointerMove={e=>move(e)} onPointerUp={e=>move(e,true)}
      onPointerCancel={resetGesture} onLostPointerCapture={()=>{if(gesture.current)resetGesture();}}
      onClick={()=>{if(!paused)setSelected(true);}}/>}
    {selected && !done && <button className="ws-hotspot" style={at(end)} aria-label={pick(action)} onClick={finish}/>}
  </WorkshopStage>;
}
