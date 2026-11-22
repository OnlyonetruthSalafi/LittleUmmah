import { useRef, useState, type PointerEvent } from 'react';
import { useDict } from '@/i18n/LocaleProvider';
import type { Text } from '@/i18n/config';
import type { LockAction } from '../engine/canalLock';
import { at } from '../components/WorkshopStage';

type Part = 'wheel' | 'sluice' | 'left' | 'right';
const stations = {
  wheel: { x:365, y:408, action:'fill', th:'หมุนวงล้อฟ้าเพื่อเติมน้ำ', en:'Turn the blue wheel to fill the lock' },
  sluice: { x:590, y:407, action:'drain', th:'ดึงห่วงส้มเพื่อปล่อยน้ำ', en:'Pull the orange ring to drain the lock' },
  left: { x:304, y:173, action:'open', th:'โยกคันโยกทองที่ประตูซ้าย', en:'Move the left gate lever' },
  right: { x:656, y:173, action:'open', th:'โยกคันโยกทองที่ประตูขวา', en:'Move the right gate lever' },
} as const;
const parts: Part[] = ['wheel','sluice','left','right'];
const clamp = (n:number) => Math.min(1,Math.max(0,n));
export const lockHints: Record<'fill'|'drain'|'left'|'right',Text> = {
  fill:{th:'น้ำยังต่ำ แตะวงล้อฟ้าเพื่อเติมน้ำ',en:'The water is low. Turn the blue wheel.'},
  drain:{th:'น้ำยังสูง ดึงห่วงส้มเพื่อปล่อยน้ำ',en:'The water is high. Pull the orange ring.'},
  left:{th:'น้ำเท่ากันแล้ว โยกคันโยกทองฝั่งซ้ายให้เรือเข้า',en:'Water is level. Move the left lever to let the boat in.'},
  right:{th:'น้ำเท่ากันแล้ว โยกคันโยกทองฝั่งขวาให้เรือออก',en:'Water is level. Move the right lever to let the boat out.'},
};
function Plinth({x,y}:{x:number;y:number}) {
  return <g transform={`translate(${x} ${y})`}>
    <ellipse cy="8" rx="46" ry="11" fill="#315952" opacity=".32"/>
    <path d="M-40 -7 -25 -17 36 -14 43 -5 42 5 27 12 -36 9Z" fill="#8a6947" stroke="#68513e" strokeWidth="2"/>
    <path d="M-40 -7 -25 -17 36 -14 43 -5 27 2 -36 0Z" fill="#ecc895"/>
  </g>;
}
function Pipe({d}:{d:string}) {
  return <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} stroke="#284e55" strokeWidth="19"/><path d={d} stroke="#af8551" strokeWidth="14"/>
    <path d={d} transform="translate(-2 -2)" stroke="#f2c988" strokeWidth="4"/>
  </g>;
}
function GateDrive({x,travel,opening}:{x:number;travel:number;opening:number}) {
  const handleX = 42*travel-21, handleY = -35+8*Math.abs(travel-.5);
  return <g transform={`translate(${x} 197)`} strokeLinejoin="round">
    <path d={`M${handleX} ${handleY+10} L${12+opening*15} 8 0 22`} fill="none" stroke="#755338" strokeWidth="7"/>
    <path d="M-24 4 -16 -8 18 -8 26 3 23 12 -22 12Z" fill="#286565" stroke="#193f46" strokeWidth="3"/>
    <path d="M-20 2 -14 -5 16 -5 22 2 12 5 -16 5Z" fill="#78b5a1"/>
    <path d={`M0 1 L${handleX} ${handleY}`} stroke="#59462e" strokeWidth="12" strokeLinecap="round"/>
    <path d={`M-1 -1 L${handleX-1} ${handleY-1}`} stroke="#f2bc54" strokeWidth="7" strokeLinecap="round"/>
    <circle cy="1" r="6" fill="#e8bf81" stroke="#694e31" strokeWidth="2"/>
    <rect x={handleX-15} y={handleY-8} width="30" height="15" rx="7" fill="#ffcf57" stroke="#6a4d28" strokeWidth="3"/>
    <path d={`M${handleX-8} ${handleY-4} h13`} stroke="#fff1bd" strokeWidth="3" strokeLinecap="round"/>
  </g>;
}
function PointerArrow({x,y}:{x:number;y:number}) {
  return <g transform={`translate(${x} ${y})`}><g className="canal-guide-arrow" strokeLinejoin="round">
    <path d="M-10 -39H10V-18H23L0 5 -23 -18H-10Z" fill="#fff8d8" stroke="#fff8d8" strokeWidth="10"/>
    <path d="M-10 -39H10V-18H23L0 5 -23 -18H-10Z" fill="#ffcf46" stroke="#203f48" strokeWidth="4"/>
  </g></g>;
}
export function CanalMachinery({entrance, action, fraction, opening, water, disabled, hint, onOperate}:{
  entrance:boolean; action?:LockAction; fraction:number; opening:number; water:number; disabled:boolean;
  hint:LockAction|null; onOperate:(action:LockAction,wrongGate:boolean)=>void;
}) {
  const {pick}=useDict();
  const gate:Part=entrance?'left':'right';
  const guided=hint==='open'?gate:hint==='fill'?'wheel':hint==='drain'?'sluice':null;
  const [pull,setPull]=useState<{part:Part; amount:number}|null>(null);
  const drag=useRef<{id:number; part:Part; x:number; y:number; angle:number; turned:number; amount:number; moved:boolean}|null>(null);
  const suppressClick=useRef(false);
  const livePull=disabled?null:pull;
  const wheel=action==='fill'?fraction:livePull?.part==='wheel'?livePull.amount:0;
  const valve=action==='drain'?Math.sin(Math.PI*fraction):livePull?.part==='sluice'?livePull.amount:0;
  const ringY=400+22*valve;
  const operatePart=(part:Part)=>onOperate(stations[part].action, (part==='left'||part==='right') && part!==gate);
  function begin(e:PointerEvent<HTMLButtonElement>,part:Part) {
    if(disabled||!e.isPrimary||e.button!==0)return;
    const rect=e.currentTarget.getBoundingClientRect();
    drag.current={id:e.pointerId,part,x:e.clientX,y:e.clientY,angle:Math.atan2(e.clientY-rect.top-rect.height/2,e.clientX-rect.left-rect.width/2),turned:0,amount:0,moved:false};
    suppressClick.current=false;
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function move(e:PointerEvent<HTMLButtonElement>) {
    const d=drag.current;
    if(!d||d.id!==e.pointerId||disabled)return;
    const rect=e.currentTarget.getBoundingClientRect();
    const dx=e.clientX-d.x,dy=e.clientY-d.y;
    const angle=Math.atan2(e.clientY-rect.top-rect.height/2,e.clientX-rect.left-rect.width/2);
    d.turned+=Math.atan2(Math.sin(angle-d.angle),Math.cos(angle-d.angle)); d.angle=angle;
    d.moved ||= Math.hypot(dx,dy)>6;
    if(!d.moved)return;
    d.amount=clamp(d.part==='wheel'?Math.abs(d.turned)/1.6:d.part==='sluice'?dy/(rect.height*.32):dx/(rect.width*.32));
    setPull({part:d.part,amount:d.amount});
  }
  function release(e:PointerEvent<HTMLButtonElement>) {
    const d=drag.current;
    if(!d || d.id!==e.pointerId)return;
    move(e);
    drag.current=null; setPull(null);
    suppressClick.current=d.moved;
    if(!disabled && d.moved && d.amount>=.5)operatePart(d.part);
  }
  function cancel() {drag.current=null;setPull(null);suppressClick.current=true;}
  return <>
    <svg className="ws-layer canal-machine-art" viewBox="0 0 960 480" aria-hidden="true">
      <Plinth x={365} y={439}/><Plinth x={590} y={443}/>
      <Pipe d="M365 425 V364 Q365 352 378 352 H395 Q405 352 405 340 V326"/>
      <path d="M395 327h20v7h-20Z" fill="#355e61" stroke="#213e40" strokeWidth="3"/>
      {action==='fill' && <g opacity={Math.sin(Math.PI*fraction)}>
        <path d={`M405 331 Q415 318 427 ${310-28*water+30}`} fill="none" stroke="#c4fff3" strokeWidth="8" strokeLinecap="round"/>
        <ellipse cx="427" cy={310-28*water+30} rx={10+fraction*12} ry="4" fill="none" stroke="#e9ffef" strokeWidth="3"/>
      </g>}
      <path d="M350 433v-25l10 -10h13l12 13v22Z" fill="#287877" stroke="#1c4e56" strokeWidth="3"/>
      <g transform="translate(365 406) scale(1 .86)">
        <g transform={`rotate(${wheel*180})`} strokeLinecap="round">
          {[0,60,120].map(a=><path key={a} d="M-29 0H29" transform={`rotate(${a})`} stroke="#126481" strokeWidth="8"/>)}
          <circle r="31" fill="none" stroke="#1a4954" strokeWidth="12"/>
          <circle cy="-2" r="31" fill="none" stroke="#40bbde" strokeWidth="8"/>
          <circle cx="23" cy="-21" r="7" fill="#b9f3ff" stroke="#17667a" strokeWidth="3"/>
        </g><circle r="9" fill="#ffcb75" stroke="#6b5333" strokeWidth="3"/>
      </g>
      <Pipe d="M554 361 V376 Q554 385 565 385 H629 Q640 385 640 398 V405"/>
      <ellipse cx="554" cy="360" rx="14" ry="6" fill="#276879" stroke="#e4bc83" strokeWidth="4"/>
      {action==='drain' && <g opacity={Math.sin(Math.PI*fraction)} fill="none" stroke="#dafaf1" strokeWidth="3">
        <ellipse cx="554" cy="355" rx={20-fraction*9} ry="5"/>
        <path d="M639 406q1 8 7 10t12 0" strokeWidth="6"/>
      </g>}
      <path d="M574 434v-47h31v47l-6 5h-21Z" fill="#267171" stroke="#244951" strokeWidth="4"/>
      <path d="M590 394v34" stroke="#173f47" strokeWidth="9" strokeLinecap="round"/>
      <path d={`M589 383v${ringY-383}`} stroke="#ffd38e" strokeWidth="7"/>
      <ellipse cx="590" cy={ringY} rx="22" ry="15" fill="none" stroke="#76442a" strokeWidth="11"/>
      <ellipse cx="590" cy={ringY-2} rx="22" ry="15" fill="none" stroke="#ff9850" strokeWidth="7"/>
      <path d="m584 422 6 6 6-6" fill="none" stroke="white" strokeWidth="3"/>
      {(['left','right'] as const).map(side=><GateDrive key={side} x={stations[side].x}
        travel={livePull?.part===side?livePull.amount:gate===side?opening:0} opening={gate===side?opening:0}/>)}
      {guided && <PointerArrow x={stations[guided].x} y={stations[guided].y-(guided==='wheel'?34:25)}/>}
    </svg>
    {parts.map(part=><button type="button" key={part} className="canal-machine-hit" style={at(stations[part])}
      data-lock-part={part} data-lock-action={part==='left'||part==='right' ? part===gate?'open':'other-gate' : stations[part].action}
      data-guide={part===guided?stations[part].action:undefined} aria-label={pick(stations[part])} disabled={disabled}
      onPointerDown={e=>begin(e,part)} onPointerMove={move} onPointerUp={release} onPointerCancel={cancel}
      onLostPointerCapture={()=>{if(drag.current)cancel();}}
      onClick={e=>{if(!disabled && (e.detail===0||!suppressClick.current))operatePart(part); suppressClick.current=false;}}/>)}
  </>;
}
