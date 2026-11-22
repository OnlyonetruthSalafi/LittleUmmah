'use client';
import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { type PlayProps } from '../components/GameShell';
import { ActionLabel, pointOnBoard, useWorkshopFinish, WorkshopStage, type Point } from '../components/WorkshopStage';
import { sandTrail, traceTo } from '../engine/sandTrails';

export default function SandTrailsBoard({level,paused,onProgress,onComplete,onTap}: PlayProps) {
  const stage=useRef<HTMLDivElement>(null);
  const stroke=useRef<{id:number; point:Point}|null>(null);
  const cursor=useRef(0);
  const [index,setIndex]=useState(0);
  const [off,setOff]=useState(false);
  const path=useMemo(()=>sandTrail(level),[level]);
  const guide=useMemo(()=>path.map(p=>p.x.toFixed(1)+','+p.y.toFixed(1)),[path]);
  const last=path.length-1, current=path[index], end=path[last];
  const marks=4+level, completed=Math.floor(index*marks/last);
  const done=index===last;
  useEffect(()=>{onProgress(completed,marks);},[completed,marks,onProgress]);
  useEffect(()=>{if(paused)stroke.current=null;},[paused]);
  useWorkshopFinish(done,paused,onComplete);
  function advance(next:number) {cursor.current=next;setIndex(next);}
  function move(e:PointerEvent<SVGSVGElement>) {
    const s=stroke.current;
    if(!s || s.id!==e.pointerId || !stage.current || paused) return;
    const p=pointOnBoard(stage.current,e.clientX,e.clientY);
    const result=traceTo(path,cursor.current,s.point,p);
    advance(result.index);setOff(result.off);
    if(result.off) {
      const lastGood=path[result.index];
      s.point=lastGood;
      // Resume only upon physically returning to the last groove.
      if(Math.hypot(p.x-lastGood.x,p.y-lastGood.y)>38) stroke.current=null;
    } else s.point=p;
  }
  const message=done?{th:'วาดถึงปลายทางแล้ว!',en:'You finished the trail!'}:
    off?{th:'วางนิ้วที่วงทอง แล้วลากต่อได้เลย',en:'Touch the gold ring to continue.'}:
    {th:'วางนิ้วในวงทอง แล้วลากไปตามเส้นประ',en:'Trace the dotted path from the gold ring.'};
  const groove=guide.slice(0,index+1).join(' ');
  return <WorkshopStage slug="sand-trails" level={level} stage={stage} message={message}
    action={<button type="button" className="ws-action" disabled={done||paused} onClick={()=>{
      advance(Math.min(last,Math.ceil((completed+1)*last/marks)));setOff(false);onTap();
    }}><ActionLabel text={{th:'วาดทีละช่วง',en:'Trace one section'}}/></button>}>
    <svg viewBox="0 0 960 480" className="ws-layer" style={{pointerEvents:'auto'}} aria-hidden="true"
      onPointerDown={e=>{
        if(done||paused||!e.isPrimary||e.button!==0||!stage.current)return;
        const p=pointOnBoard(stage.current,e.clientX,e.clientY);
        if(Math.hypot(p.x-current.x,p.y-current.y)>44){setOff(true);return;}
        stroke.current={id:e.pointerId,point:current};setOff(false);e.currentTarget.setPointerCapture(e.pointerId);
      }} onPointerMove={move} onPointerUp={e=>{move(e);stroke.current=null;}} onPointerCancel={()=>{stroke.current=null;}}>
      <polyline points={guide.join(' ')} fill="none" stroke="#8e633c" strokeWidth="5" strokeDasharray="2 12" strokeLinecap="round"/>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <polyline points={groove} stroke="#ffe4b0" strokeWidth="19" transform="translate(0 3)"/>
        <polyline points={groove} stroke="#a97848" strokeWidth="15"/>
        <polyline points={groove} stroke="#c99761" strokeWidth="9" transform="translate(0 2)"/>
      </g>
      <path transform={`translate(${end.x} ${end.y})`} d="m0 -14 4 9 10 1 -8 7 2 10 -8 -5 -8 5 2 -10 -8 -7 10 -1z" fill="#fff1b3" stroke="#765032" strokeWidth="3"/>
      <circle cx={current.x} cy={current.y} r="19" stroke="#775128" strokeWidth="8" fill="none"/>
      <circle cx={current.x} cy={current.y} r="19" stroke="#ffdf80" strokeWidth="4" fill="none"/>
    </svg>
  </WorkshopStage>;
}
