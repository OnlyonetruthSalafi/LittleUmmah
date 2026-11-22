'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import type { Text } from '@/i18n/config';
import { useDict } from '@/i18n/LocaleProvider';
import { useSound } from '@/components/sound/SoundProvider';
import { at, pointOnBoard, useWorkshopFinish, WorkshopStage, type Point } from '../components/WorkshopStage';
import type { PlayProps } from '../components/GameShell';
import { availablePlots, castlePlan, type Piece } from '../engine/sandcastle';
import SandMixing from './SandMixing';
import './sandcastle.css';

const folder='/games/sandcastle/';
const hints = {
  cast:{th:'ชื้นกำลังดี! ลากถังหรือแตะวงที่อยากก่อ', en:'Damp sand holds! Drag the bucket or tap a ring.'},
  flag:{th:'เลือกธงมาปักบนยอดปราสาท', en:'Choose a flag for your castle.'},
} satisfies Record<string,Text>;
const flags=[
  {color:'#e46d49',th:'ธงสามเหลี่ยมสีส้ม',en:'Orange pennant'},
  {color:'#1f9294',th:'ธงหางแฉกสีเขียว',en:'Teal swallowtail'},
  {color:'#4970b9',th:'ธงสี่เหลี่ยมสีน้ำเงิน',en:'Blue banner'},
];
const bucketPoint={x:480,y:390};
const plotCentre=(p:Piece)=>({x:p.x,y:p.y-26});
function Sprite({name,x,y,size}:{name:string;x:number;y:number;size:number}){
  return <image href={folder+name+'.webp'} x={x-size/2} y={y-size*.94} width={size} height={size}/>;
}
function Flag({index,x,y,scale=1}:{index:number;x:number;y:number;scale?:number}){
  const shape=['M0 -78 Q18 -82 55 -65 L0 -52Z','M0 -78 Q24 -84 55 -74 L38 -64 54 -49 Q27 -58 0 -51Z','M0 -78 Q22 -84 48 -75 V-49 Q26 -57 0 -49Z'][index];
  return <g transform={`translate(${x} ${y}) scale(${scale})`} strokeLinejoin="round">
    <path d="M0 0V-80" stroke="#714e33" strokeWidth="6" strokeLinecap="round"/>
    <path d={shape} fill={flags[index].color} stroke="#493d34" strokeWidth="2.5"/>
    <path d="m8 -72 10 7-10 7Z" fill="#fff4c5"/><circle cy="-81" r="5" fill="#ffd376" stroke="#705634" strokeWidth="2"/>
  </g>;
}
function Guide({point}:{point:Point}){
  return <g transform={`translate(${point.x} ${point.y-43})`} className="sand-guide" aria-hidden="true">
    <path d="M-8 -32H8v16h13L0 4l-21-20h13Z" fill="#ffd057" stroke="#fff9e2" strokeWidth="9" strokeLinejoin="round"/>
    <path d="M-8 -32H8v16h13L0 4l-21-20h13Z" fill="#ffd057" stroke="#3c4040" strokeWidth="3.5" strokeLinejoin="round"/>
  </g>;
}

function CurtainWall({east}:{east:boolean}){
  // One end disappears into the gatehouse and the other into its flanking tower.
  return <g transform={east?'translate(960 0) scale(-1 1)':undefined} strokeLinejoin="round">
    <path d="M306 261 401 238 416 244 321 268Z" fill="#eac391"/>
    <path d="M321 268 416 244 416 287 321 312Z" fill="#c69f71"/>
    {[0,1,2,3,4].map(i=><g key={i} transform={`translate(${321+i*19} ${265-i*4.8})`}>
      <path d="m-8 -7 13 -3 8 4 -13 4Z" fill="#edcda0"/>
      <path d="m0 -2 13 -4v9L0 7Z" fill="#c5a071"/>
      <path d="m-8 -7 8 5v9l-8 -6Z" fill="#d6af83"/>
    </g>)}
  </g>;
}

export default function SandcastleBoard({level, paused, onTap, onProgress, onComplete, onFeedback}:PlayProps){
  const plan=castlePlan(level);
  const {pick}=useDict();
  const {speak,enabled}=useSound();
  const [built,setBuilt]=useState<string[]>([]);
  const [packed,setPacked]=useState(false);
  const [cast,setCast]=useState<Piece|null>(null);
  const [flag,setFlag]=useState<number|null>(null);
  const [guided,setGuided]=useState(false);
  const [ghost,setGhost]=useState<Point|null>(null);
  const [bucketReady,setBucketReady]=useState(false);
  const stage=useRef<HTMLDivElement>(null);
  const pointer=useRef<{id:number;origin:Point;dragged:boolean}|null>(null);
  const plots=availablePlots(plan,built);
  const decorating=built.length===plan.plots.length;
  const done=flag!==null;
  const preparing=!packed&&!decorating;
  const hint=decorating?'flag':'cast';
  const guideOn=guided && !preparing && !paused && !cast && !done;
  const guidePoint=decorating?{x:480,y:385}:plotCentre(plots[0]);
  const active=!paused&&!cast&&!done;
  const finishedCount=built.length+Number(done);
  useEffect(()=>onProgress(finishedCount,plan.plots.length+1),[finishedCount,plan,onProgress]);
  useWorkshopFinish(done,paused,onComplete,2400);
  useEffect(()=>{
    if(preparing || paused || cast || done || guided)return;
    const timer=setTimeout(()=>setGuided(true),8000);
    return ()=>clearTimeout(timer);
  },[preparing,paused,cast,done,guided,built,bucketReady]);
  useEffect(()=>{
    if(guideOn && enabled)speak(pick(hints[hint]),'sandcastle-'+hint);
  },[guideOn,enabled,hint,pick,speak]);
  useEffect(()=>{
    if(paused)pointer.current=null;
  },[paused]);
  if(paused && ghost)setGhost(null);

  function mould(p:Piece){
    if(!active || !packed || !plots.some(plot=>plot.id===p.id))return;
    onTap();setCast(p);setGuided(false);setBucketReady(false);
  }
  function lift(){
    if(!cast || paused)return;
    setBuilt([...built,cast.id]);setPacked(false);setCast(null);onFeedback(true);
  }
  function selectFlag(index:number){
    if(active && decorating){setFlag(index);setGuided(false);onTap();}
  }
  function point(e:PointerEvent<HTMLButtonElement>){return pointOnBoard(stage.current!,e.clientX,e.clientY);}
  function startDrag(e:PointerEvent<HTMLButtonElement>){
    if(!active||!stage.current||!e.isPrimary||e.button!==0)return;
    pointer.current={id:e.pointerId,origin:point(e),dragged:false};e.currentTarget.setPointerCapture(e.pointerId);
  }
  function drag(e:PointerEvent<HTMLButtonElement>){
    const d=pointer.current;if(d?.id!==e.pointerId||!active)return;
    const p=point(e);
    if(Math.hypot(p.x-d.origin.x,p.y-d.origin.y)>12)d.dragged=true;
    if(d.dragged){setGhost(p);setBucketReady(true);}
  }
  function drop(e:PointerEvent<HTMLButtonElement>){
    const d=pointer.current;if(d?.id!==e.pointerId)return;
    pointer.current=null;setGhost(null);
    if(!active||!d.dragged)return;
    const p=point(e);
    const target=plots.map(plot=>({plot,distance:Math.hypot(p.x-plot.x,(p.y-plotCentre(plot).y)*1.12)}))
      .sort((a,b)=>a.distance-b.distance)[0];
    if(target && target.distance<=85)mould(target.plot);
    else setGuided(true);
  }
  const message=done?{th:'ปราสาททรายของหนูเสร็จแล้ว!',en:'Your sandcastle is ready!'}
    :cast?{th:'คว่ำพิมพ์ แล้วค่อย ๆ ยกขึ้น…',en:'Turn the mould over and lift…'}
    :hints[hint];
  const summit=level===1?{x:480,y:170}:level===2?{x:480,y:150}:{x:480,y:83};
  if(preparing)return <SandMixing key={built.length} level={level} batch={built.length} initial={plan.batches[built.length]}
    paused={paused} onTap={onTap} onReady={()=>{setPacked(true);setGuided(false);}}/>;
  return <WorkshopStage slug="sandcastle" stage={stage} level={level} message={message}>
    <div className="sand-yard" data-pieces={built.length} data-casting={!!cast} data-paused={paused}>
      <svg className="ws-layer" viewBox="0 0 960 480" aria-hidden="true">
        {built.includes('gate') && built.includes('west') && <CurtainWall east={false}/>}
        {built.includes('gate') && built.includes('east') && <CurtainWall east/>}
        {plan.plots.map(p=>{
          const placed=built.includes(p.id),turn=cast?.id===p.id,available=plots.includes(p);
          if(!placed&&!available)return null;
          const top=p.y-p.size*.94;
          return <g key={p.id}>
            {placed || turn?<g className={turn?'sand-reveal':undefined}>
              <ellipse cx={p.x} cy={p.y-3} rx={p.size*.34} ry={p.size*.073} fill="#85613c" opacity=".25"/>
              <Sprite name={p.shape} x={p.x} y={p.y} size={p.size}/>
            </g>:<>
              {!turn && <g opacity=".23"><Sprite name={p.shape} x={p.x} y={p.y} size={p.size}/></g>}
              <ellipse cx={p.x} cy={p.y-13} rx={p.size*.34} ry={p.size*.10} fill="#ffefbf" fillOpacity=".56" stroke="#975a28" strokeWidth="5" strokeDasharray="10 6"/>
              <path d={`M${p.x-11} ${p.y-15}h22m-11 -10v20`} stroke="#694323" strokeWidth="5" strokeLinecap="round"/>
            </>}
            {turn && <g className="sand-lift" onAnimationEnd={e=>{if(e.target===e.currentTarget)lift();}}>
              <image href={folder+'bucket.webp'} x={p.x-p.size/2} y={top} width={p.size} height={p.size}/>
            </g>}
          </g>;
        })}
        {flag!==null && <Flag index={flag} {...summit} scale={.73}/>}
        {!decorating?<>
          <ellipse cx="480" cy="440" rx="99" ry="18" fill="#947754" opacity=".28"/>
          <ellipse cx="480" cy="428" rx="103" ry="25" fill="#986745" stroke="#714e35" strokeWidth="3"/>
          <ellipse cx="480" cy="420" rx="100" ry="24" fill="#bf925f" stroke="#f9d49a" strokeWidth="5"/>
          {!cast&&!ghost&&<Sprite name="bucket" x={480} y={420} size={121}/>}
          {ghost && <Sprite name="bucket" x={ghost.x} y={ghost.y+32} size={128}/>}
        </>:!done && [0,1,2].map((i)=><g key={i}><ellipse cx={230+i*250} cy="428" rx="54" ry="11" fill="#b78d5b" opacity=".44"/><Flag index={i} x={220+i*250} y={428} scale={1.16}/></g>)}
        {guideOn&&!ghost && <Guide point={guidePoint}/>}
      </svg>
      {!decorating && <>
        <button className="sand-hit" type="button" style={at(bucketPoint)} data-sand-tool="bucket" disabled={!active} aria-label={pick({th:'เลือกถังพิมพ์',en:'Pick up the mould'})}
          onPointerDown={startDrag} onPointerMove={drag} onPointerUp={drop} onPointerCancel={()=>{pointer.current=null;setGhost(null);}}
          onLostPointerCapture={()=>{pointer.current=null;setGhost(null);}} onClick={()=>{if(active&&!cast){setBucketReady(true);setGuided(true);}}}/>
        {plots.map(p=><button type="button" className="sand-hit sand-plot" key={p.id} data-plot={p.id} style={at(plotCentre(p))}
          disabled={!active} aria-label={pick(plotNames[p.id])} onClick={()=>mould(p)}/>)}
      </>}
      {decorating&&!done&&flags.map((f,i)=><button key={f.en} type="button" data-flag={i} className="sand-hit" disabled={!active}
        style={at({x:230+250*i,y:384})} aria-label={pick(f)} onClick={()=>selectFlag(i)}/>)}
    </div>
  </WorkshopStage>;
}
const plotNames:Record<string,Text>={
  tower:{th:'ก่อหอคอย',en:'Build the tower'},gate:{th:'ก่อซุ้มประตู',en:'Build the gatehouse'},
  west:{th:'ก่อหอคอยซ้าย',en:'Build the left tower'},east:{th:'ก่อหอคอยขวา',en:'Build the right tower'},turret:{th:'ก่อหอคอยบนยอด',en:'Build the upper turret'},
};
