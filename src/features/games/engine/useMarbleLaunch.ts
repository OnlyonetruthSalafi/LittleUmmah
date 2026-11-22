'use client';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { rollPosition, type Peg } from './marbleRun';

type Run = { points: Peg[]; cup: number };

// One clock drives the plates and the marble in both the practice machine and the level.
export function useMarbleLaunch(intake: Peg, paused: boolean, onLand: (cup:number)=>void) {
  const [run,setRun] = useState<Run|null>(null);
  const [pose,setPose] = useState({ball:intake, open:0});
  const clock = useRef({time:0, distance:0});
  const land = useEffectEvent(onLand);
  useEffect(()=>{
    if(!run || paused) return;
    const { points, cup } = run;
    const length = points.slice(1).reduce((sum,p,i)=>sum+Math.hypot(p.x-points[i].x,p.y-points[i].y),0);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const openingTime = reduced ? 120 : 470;
    const fallTime = reduced ? 130 : 380;
    const firstDrop = Math.hypot(points[1].x-intake.x,points[1].y-intake.y);
    let frame=0, previous=0;
    function tick(now:number) {
      const dt=previous ? Math.min(64,now-previous) : 0;
      previous=now;
      const state=clock.current;
      state.time+=dt;
      const fall=(state.time-openingTime)/fallTime;
      if(fall<=1) state.distance=firstDrop*Math.max(0,fall)**2;
      else state.distance=Math.max(firstDrop,state.distance)+dt*(reduced ? 1.7 : .24+.2*Math.min(1,state.distance/145));
      const open=fall<0 ? state.time/openingTime : Math.max(0,1-Math.max(0,fall-1)*2);
      setPose({ball:rollPosition(points,state.distance),open});
      if(state.distance<length+30 || open>0){frame=requestAnimationFrame(tick);return;}
      setRun(null);land(cup);
    }
    frame=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(frame);
  },[run,paused,intake]);
  function reload() {setPose({ball:intake,open:0});}
  function launch(next:Run) {
    if(run || paused)return;
    clock.current={time:0,distance:0};
    reload();setRun(next);
  }
  return {...pose,running:!!run,reload,launch};
}
