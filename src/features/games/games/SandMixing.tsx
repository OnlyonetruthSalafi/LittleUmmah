'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { useDict } from '@/i18n/LocaleProvider';
import { useSound } from '@/components/sound/SoundProvider';
import { WorkshopStage, at, pointOnBoard, type Point } from '../components/WorkshopStage';
import { mixSand, type Sand } from '../engine/sandcastle';

const directions = {
  water:{th:'ทรายร่วนอยู่ แตะบัวรดน้ำให้ทรายชื้น',en:'The sand is dry. Water the pile.'},
  scoop:{th:'ทรายแฉะไป ใช้พลั่วเติมทรายแห้ง',en:'Too wet! Add a scoop of dry sand.'},
  pat:{th:'ตบเบา ๆ ที่กองทราย 3 ที',en:'Give the sand three gentle pats.'},
  shape:{th:'ลากนิ้วปาดกองทรายให้มน หรือแตะเพื่อปั้น',en:'Smooth the sand with a swipe, or tap to shape it.'},
};
const tools={water:{x:140,y:309},scoop:{x:811,y:298},pile:{x:480,y:280}};
const prints=[{x:413,y:282,tilt:-18},{x:541,y:292,tilt:15},{x:472,y:257,tilt:-7}];
type Motion='water'|'scoop'|'shape'|null;
const colors = [
  ['#ffe2a1','#eac383','#cf9b5e'], ['#e8bd80','#cb985e','#a97747'], ['#c89f76','#a78160','#856956'],
];
function PalmPrint({x,y,tilt}:{x:number;y:number;tilt:number}){
  return <g transform={`translate(${x} ${y}) rotate(${tilt})`} fill="#a77748" stroke="#dab07a" strokeWidth="1.8">
    <ellipse cy="2" rx="17" ry="10"/><ellipse cx="-16" cy="-4" rx="5" ry="6"/>
    {[-10,-2,6,14].map((n,i)=><ellipse key={n} cx={n} cy={-11-(i===1?3:0)} rx="3.4" ry="7"/>)}
  </g>;
}
export default function SandMixing({level,batch,initial,paused,onTap,onReady}:{
  level:number;batch:number;initial:Sand;paused:boolean;onTap:()=>void;onReady:()=>void;
}){
  const {pick}=useDict(), {enabled,speak}=useSound();
  const stage=useRef<HTMLDivElement>(null);
  const [sand,setSand]=useState(initial);
  const [marks,setMarks]=useState<typeof prints>([]);
  const pats=marks.length;
  const [trial,setTrial]=useState(0);
  const [motion,setMotion]=useState<Motion>(null);
  const [stroke,setStroke]=useState(0);
  const [guide,setGuide]=useState(false);
  const drag=useRef<{id:number;x:number}|null>(null);
  const suppressClick=useRef(false);
  const hint=sand===0?'water':sand===2?'scoop':pats<3?'pat':'shape';
  const busy=paused||motion!==null;
  const point=hint==='water'||hint==='scoop'?tools[hint]:tools.pile;
  const showGuide=guide&&!busy;
  useEffect(()=>{
    if(busy||guide)return;
    const t=setTimeout(()=>setGuide(true),8000);return ()=>clearTimeout(t);
  },[busy,guide,pats]);
  useEffect(()=>{
    if(showGuide && enabled)speak(pick(directions[hint]),'sandcastle-'+hint);
  },[showGuide,enabled,speak,pick,hint]);
  useEffect(()=>{if(paused)drag.current=null;},[paused]);
  if(paused && stroke)setStroke(0);
  function tool(name:'water'|'scoop'){
    if(busy)return;
    drag.current=null;setStroke(0);setTrial(0);setGuide(false);onTap();setMotion(name);
  }
  function finishMotion(){
    if(!motion || paused)return;
    if(motion==='shape'){onReady();return;}
    const next=mixSand(sand,motion);
    setSand(next);setMarks([]);setGuide(next===sand);setMotion(null);
  }
  function pressPile(contact?:Point){
    if(busy)return;
    onTap();
    if(sand!==1){setTrial(t=>t+1);setGuide(true);return;}
    setGuide(false);
    if(pats<3){
      const next=prints[pats];
      const x=contact?Math.max(369,Math.min(595,contact.x)):next.x;
      const y=contact?Math.max(250+Math.abs(x-480)*.30,Math.min(333,contact.y)):next.y;
      setMarks([...marks,{x,y,tilt:next.tilt}]);
    }
    else {setStroke(1);setMotion('shape');}
  }
  function swipe(e:PointerEvent<HTMLButtonElement>,release:boolean){
    const d=drag.current;
    if(!d||d.id!==e.pointerId||busy)return;
    const t=Math.min(1,Math.abs(e.clientX-d.x)/(e.currentTarget.clientWidth*.32));
    setStroke(t);
    if(release){
      drag.current=null;
      if(t>=.55){suppressClick.current=true;pressPile();}
      else {setStroke(0);suppressClick.current=t>.1;if(t>.1)setGuide(true);}
    }
  }
  const flatten=pats*6+stroke*8;
  const top=202+flatten;
  const crown=pats*3+stroke*9;
  const mound=`M298 329 Q310 314 331 309 Q351 299 363 ${273+flatten/2}
    Q371 ${263+flatten/2} 385 ${260+flatten/2} Q401 ${244+flatten/2} 415 ${237+flatten}
    Q434 ${top-crown} 455 ${top+5} Q473 ${top-15+crown} 489 ${top-3} Q506 ${top-10+crown} 524 ${top+8}
    Q545 ${top+12} 554 ${256+flatten/2} Q575 ${269+flatten/2} 584 ${282+flatten/2}
    Q602 302 623 309 Q645 311 658 329 Q645 354 483 362 Q347 361 298 329Z`;
  const palette=colors[sand];
  const message=motion==='water'?{th:'ดูสายน้ำตกบนทราย ตรงที่เปียกสีจะเข้มขึ้น',en:'Watch the stream. Sand darkens where it gets wet.'}
    :motion==='scoop'?{th:'เติมทรายแห้งลงในกอง',en:'Mixing in a scoop of dry sand.'}
    :motion==='shape'?{th:'ทรายแน่นและมนแล้ว พร้อมใส่พิมพ์!',en:'Smooth and packed. Ready for the mould!'}
    :hint==='pat'?{th:`ตบกองทรายให้แน่น อีก ${3-pats} ที`,en:`Pat the sand ${3-pats} more ${pats===2?'time':'times'}.`}:directions[hint];
  return <WorkshopStage slug="sandcastle" level={level} stage={stage} message={message}>
    <div className="sand-yard sand-mix" data-pieces={batch} data-sand={sand} data-pats={pats} data-motion={motion??'idle'} data-paused={paused}>
      <svg viewBox="0 0 960 480" className="ws-layer" aria-hidden="true">
        <defs>
          <linearGradient id="mix-sand" x2=".15" y2="1"><stop stopColor={palette[0]}/><stop offset=".65" stopColor={palette[1]}/><stop offset="1" stopColor={palette[2]}/></linearGradient>
          <radialGradient id="mix-wet"><stop stopColor="#986f4d"/><stop offset=".7" stopColor="#b5885c"/><stop offset="1" stopColor="#ba8e5e" stopOpacity="0"/></radialGradient>
          <clipPath id="mix-pile"><path d={mound}/></clipPath>
        </defs>
        <ellipse cx="482" cy="356" rx="245" ry="40" fill="#a58355" opacity=".30"/>
        <ellipse cx="480" cy="336" rx="237" ry="48" fill="#986e4a" stroke="#79583e" strokeWidth="3"/>
        <ellipse cx="480" cy="325" rx="237" ry="47" fill="#d9aa73" stroke="#ffe0a2" strokeWidth="6"/>
        <g key={pats+':'+trial} className={pats?'sand-pat-rebound':trial?'sand-loose-pat':undefined}>
          <path d={mound} opacity={1-stroke} fill="url(#mix-sand)" stroke={palette[2]} strokeWidth="3"/>
          <g clipPath="url(#mix-pile)" opacity={1-stroke}>
            {Array.from({length:78},(_,i)=><ellipse key={i} cx={315+(i*97)%337} cy={210+(i*29)%143} rx={1.5+i%3} ry="1.5" fill={i%3===0?'#976b41':'#fff0ba'} opacity=".54"/>)}
            {sand===2 && <path d="M359 320q18 -7 32 -3m99 16q21 -7 40 -4m23 -36q16 -3 25 1" stroke="#aed8c8" strokeWidth="6" fill="none" strokeLinecap="round"/>}
            {motion==='water' && <ellipse className="sand-wet-spot" cx="437" cy="270" rx="156" ry="78" fill="url(#mix-wet)"/>}
            {marks.map((p,i)=><PalmPrint key={i} {...p}/>)}
          </g>
          {stroke>0 && <g opacity={stroke}>
            <path d="M309 330 Q332 319 354 289 Q399 226 480 225 Q561 226 605 289 Q628 320 650 330 Q596 365 477 359 Q359 358 309 330Z" fill="url(#mix-sand)" stroke={palette[2]} strokeWidth="3"/>
            <path className="sand-smooth-mark" d="M361 310q68 -86 156 -69" stroke="#f5d49f" strokeWidth="5" fill="none" strokeLinecap="round"/>
          </g>}
        </g>
        {motion==='water' && <g className="sand-waterfall" fill="none" strokeLinecap="round">
          {[0,1,2,3,4].map(i=><path key={i} d={`M${347+i*2} 202 Q${389+i*4} 205 ${408+i*9} ${268+i%2*5}`} stroke={i%2?'#d4fffa':'#59a9c8'} strokeWidth={i%2?3.5:5}/>)}
          <path className="sand-flow-glints" d="M352 202 Q400 206 432 269" stroke="#e6fff8" strokeWidth="3.5"/>
          <g className="sand-splash" stroke="#d9fff6" strokeWidth="3"><ellipse cx="429" cy="269" rx="26" ry="6"/><path d="m408 266 -6 -8m31 5 2 -10m13 12 7 -5"/></g>
        </g>}
        <g className={motion==='water'?'sand-can-watering':undefined}>
          <g transform="translate(280 0) scale(-1 1)"><image href="/games/sandcastle/can.webp" x="40" y="161" width="200" height="200"/></g>
        </g>
        <g className={motion==='scoop'?'sand-mix-shovel':undefined}><image href="/games/sandcastle/scoop.webp" x="724" y="205" width="175" height="175"/></g>
        {motion==='scoop' && <g className="sand-scoop-grains" fill="#f2cc88" stroke="#ae854e">
          {Array.from({length:12},(_,i)=><ellipse key={i} cx={554+i*4} cy={285-i*4+(i%3)*7} rx="5" ry="3.5"/>)}
        </g>}
        {sand===1 && <g transform="translate(445 409)">
          {[0,1,2].map(i=><g key={i} transform={`translate(${35*i} 0)`}><circle r="10" fill={pats>i?'#237d78':'#fff2cf'} stroke="#825f39" strokeWidth="3"/>
            {pats>i&&<path d="m-5 0 3 3 6 -7" fill="none" stroke="#fff9d7" strokeWidth="2.5"/>}</g>)}
        </g>}
        {showGuide && <g className="sand-guide" transform={`translate(${point.x} ${point.y-54})`}><path d="M-8 -30H8v14h12L0 4l-20-20h12Z" fill="#ffd056" stroke="#62482c" strokeWidth="4"/></g>}
        {motion && <g key={motion} className={'sand-mix-clock clock-'+motion} onAnimationEnd={e=>{if(e.target===e.currentTarget)finishMotion();}}><circle r=".01" fill="transparent"/></g>}
      </svg>
      {(['water','scoop'] as const).map(name=><button key={name} type="button" className="sand-hit" style={at(tools[name])} disabled={busy}
        data-sand-tool={name} aria-label={pick(name==='water'?{th:'รดน้ำลงกองทราย',en:'Water the sand pile'}:{th:'เติมทรายแห้ง',en:'Add dry sand'})} onClick={()=>tool(name)}/>)}
      <button type="button" className="sand-hit sand-pile-hit" style={at(tools.pile)} disabled={busy} data-sand-tool="pile"
        aria-label={pick(hint==='shape'?directions.shape:directions.pat)}
        onPointerDown={e=>{suppressClick.current=false;if(hint==='shape'&&!busy&&e.isPrimary&&e.button===0){drag.current={id:e.pointerId,x:e.clientX};e.currentTarget.setPointerCapture(e.pointerId);}}}
        onPointerMove={e=>swipe(e,false)} onPointerUp={e=>swipe(e,true)} onPointerCancel={()=>{drag.current=null;setStroke(0);}}
        onClick={e=>{if(e.detail===0 || !suppressClick.current)pressPile(e.detail && stage.current?pointOnBoard(stage.current,e.clientX,e.clientY):undefined);suppressClick.current=false;}}/>
    </div>
  </WorkshopStage>;
}
