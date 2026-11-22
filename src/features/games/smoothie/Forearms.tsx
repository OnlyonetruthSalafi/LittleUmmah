import type { Stage } from './model';
import type { CSSProperties } from 'react';
import styles from './scene.module.css';

type Wrist = readonly [x: number, y: number];
type Pose = readonly [left: Wrist, right: Wrist];
const poses: Record<Stage, Pose> = {
  order: [[168, 507], [732, 508]],
  prepare: [[173, 507], [730, 508]],
  blend: [[256, 347], [729, 508]],
  pour: [[342, 258], [517, 352]],
  pouring: [[397, 254], [515, 351]],
  serve: [[168, 506], [510, 350]],
  collect: [[168, 507], [618, 364]],
};

function Hand({ wrist, left, id }: { wrist: Wrist; left: boolean; id: string }) {
  const [x, y] = wrist;
  const dx = (left ? 93 : 808) - x, dy = 580 - y;
  const angle = -Math.atan2(dx, dy) * 180 / Math.PI;
  const length = Math.hypot(dx, dy) + 90;
  return <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${left ? 1 : -1} 1)`}
    strokeLinejoin="round" strokeLinecap="round">
    <path d="M-15 32q3-15-2-21-9-9-11-18l-7-18q-2-6 2-8 4-2 7 5l5 11-7-21q-1-6 3-7 5-1 7 5l6 15-3-22q-1-6 4-7 5 0 6 7l4 20 1-15q0-7 5-7 4 0 4 7v24q9-13 15-13 5 1 3 6-8 9-13 21-3 8-11 15l2 18Z"
      fill={`url(#${id}-skin)`} stroke="#ac7353" strokeWidth="2.2"/>
    <path d="M-8 1q3 5 3 11m15-17q-4 2-6 7" fill="none" stroke="#d69771" strokeWidth="2"/>
    <path d={`M-21 28q21-5 41 1l10 ${length-28}h-62Z`}
      fill={`url(#${id}-sleeve)`} stroke="#246472" strokeWidth="2.2"/>
    <path d="M-22 27q19-5 43 0l2 14q-23-6-47 0Z" fill="#c6eee7" stroke="#508c91" strokeWidth="2"/>
    <path d="M-20 32q20-5 39 0" stroke="#fff7db" strokeWidth="2.5" fill="none"/>
    <path d={`M-16 48q-1 21-3 ${Math.max(21,length-55)}`} fill="none" stroke="#77d6d1" strokeWidth="3.3" opacity=".76"/>
  </g>;
}

export function Forearms({ stage, id, reachX }: { stage: Stage; id: string; reachX?: number }) {
  const [left, right] = poses[stage];
  const reachesLeft = reachX !== undefined && reachX < 450;
  const reachesRight = reachX !== undefined && !reachesLeft;
  const offset = reachX === undefined ? 0 : reachX - (reachesLeft ? left[0] + 30 : right[0] - 30);
  return <g aria-hidden="true" pointerEvents="none">
    <defs>
      <linearGradient id={`${id}-skin`} x2="100%" y2="80%">
        <stop stopColor="#f6c59a"/><stop offset=".52" stopColor="#efb78e"/><stop offset="1" stopColor="#ce916c"/>
      </linearGradient>
      <linearGradient id={`${id}-sleeve`}>
        <stop stopColor="#278194"/><stop offset=".32" stopColor="#58bfbf"/><stop offset="1" stopColor="#247a8c"/>
      </linearGradient>
    </defs>
    <g style={{ '--reach-x': `${offset}px` } as CSSProperties}>
      <g className={reachesLeft ? styles.pickHand : undefined}><Hand id={id} wrist={left} left/></g>
      <g className={reachesRight ? styles.pickHand : undefined}><Hand id={id} wrist={right} left={false}/></g>
    </g>
  </g>;
}
