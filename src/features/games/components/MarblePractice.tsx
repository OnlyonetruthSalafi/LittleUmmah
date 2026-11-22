'use client';
import practiceScene from '../../../../public/games/marble-run/practice.webp';
import { useState } from 'react';
import { useDict } from '@/i18n/LocaleProvider';
import type { Direction } from '../engine/marbleRun';
import { useMarbleLaunch } from '../engine/useMarbleLaunch';
import { leverControl, RailLever, SplitHatch, toggleLever } from './MarbleMechanisms';

const intake={x:137,y:29}, fork={x:137,y:91};
const handle=leverControl(fork,.88);
const branches=([-1,1] as const).map(side=>Array.from({length:21},(_,i)=>{
  const t=i/20;
  return {x:fork.x+side*95*t,y:fork.y+61*(.75*t+.25*Math.sin(Math.PI*t/2))};
}));
export default function MarblePractice({ paused }: { paused:boolean }) {
  const {pick,sub}=useDict();
  const [dir,setDir]=useState<Direction>(0);
  const [landed,setLanded]=useState<number|null>(null);
  const {ball,open,running,launch,reload}=useMarbleLaunch(intake,paused,setLanded);
  const toggle={th:'ลองแตะคันโยกสีแดง',en:'Try the red lever'};
  const release={th:'ลองปล่อยลูกแก้ว',en:'Try release'};
  const result=landed===1?{th:'ลงถ้วยดาวแล้ว!',en:'Into the star cup!'}:{th:'ลองโยกไปอีกทาง',en:'Try the other side'};
  function flip() {
    if(paused||running)return;
    setDir(toggleLever(dir));setLanded(null);reload();
  }
  function drop() {
    if(!dir||paused||running)return;
    const cup=dir===1?1:0, track=branches[cup];
    setLanded(null);
    launch({points:[intake,...track,{x:track[20].x,y:174}],cup});
  }
  return <div className="marble-practice" aria-label={pick({th:'โต๊ะทดลองสลับราง',en:'Practice machine'})}>
    <div className="marble-practice-stage">
      <svg viewBox="0 0 300 200" aria-hidden="true">
        <defs>
          <linearGradient id="practice-brass" x2="0" y2="1"><stop stopColor="#ffdf8b"/><stop offset="1" stopColor="#bb7940"/></linearGradient>
          <radialGradient id="practice-glass" cx=".32" cy=".24" r=".75"><stop stopColor="#98eee7"/><stop offset=".43" stopColor="#209bad"/><stop offset="1" stopColor="#155378"/></radialGradient>
        </defs>
        <image href={practiceScene.src} width="300" height="200"/>
        {branches.map((track,i)=>{
          const selected=dir===(i===0?-1:1);
          if(!selected)return null;
          const points=track.slice(0,7).map(p=>p.x+','+(p.y+8)).join(' ');
          return <g key={i} fill="none" strokeLinejoin="round">
            <polyline points={points} stroke="#684b39" strokeWidth="17" transform="translate(0 4)"/>
            <polyline points={points} stroke="url(#practice-brass)" strokeWidth="16"/>
            <polyline points={points} stroke="#297f80" strokeWidth="10"/>
          </g>;
        })}
        <path d="m251 125 5.4 11.2 12.3 1.8 -8.9 8.6 2.1 12.2 -10.9 -5.7 -11 5.7 2.1 -12.2 -8.8 -8.6 12.2 -1.8z" fill="#ffd353" stroke="#264453" strokeWidth="3"/>
        <SplitHatch point={intake} open={open} scale={.72}/>
        <RailLever point={fork} dir={dir} scale={.88}/>
        {!dir && <path d="M247 45L228 57M236 56L227 58 229 49" fill="none" stroke="#194b5b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>}
        <g transform={`translate(${ball.x} ${ball.y})`} data-practice-ball="">
          <circle r="14.5" fill="url(#practice-glass)" stroke="#17546b" strokeWidth="1.5"/>
          <path d="M-12 -6Q-3 6 12 -5" fill="none" stroke="#f3d68b" strokeWidth="2.5"/>
          <ellipse cx="-4" cy="-7" rx="3.4" ry="2.3" fill="#fff8e1"/>
        </g>
        <SplitHatch point={intake} open={open} scale={.72} front/>
      </svg>
      <button type="button" className="marble-trial-lever" style={{left:handle.x/3+'%',top:handle.y/2+'%'}}
        data-practice-lever={dir} disabled={paused||running} aria-label={pick(toggle)} onClick={flip}/>
    </div>
    <button type="button" className="marble-trial-release" disabled={paused||running||!dir} onClick={drop}>
      {pick(release)}{sub&&<small lang="en">{release.en}</small>}
    </button>
    <span className="marble-trial-result" role="status">{landed!==null&&<>{pick(result)}{sub&&<small lang="en">{result.en}</small>}</>}</span>
  </div>;
}
