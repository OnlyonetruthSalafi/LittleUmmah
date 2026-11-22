import './marble-mechanisms.css';
import type { Direction, Peg } from '../engine/marbleRun';

export function toggleLever(dir: Direction): Direction { return dir === -1 ? 1 : -1; }

export function leverControl(point: Peg, scale = 1): Peg {
  return {x:point.x + 73*scale, y:point.y - 12*scale};
}

// The connecting rod runs from the throw lever to the turnout pivot on the track.
export function RailLever({ point, dir, scale = 1 }: { point: Peg; dir: Direction; scale?: number }) {
  const crank = dir*9;
  return <g transform={`translate(${point.x} ${point.y}) scale(${scale})`} aria-hidden="true">
    <path d={`M0 8 L${16+crank} 13 L71 6`} fill="none" stroke="#523c2b" strokeWidth="8" strokeLinejoin="round"/>
    <path d={`M0 6 L${16+crank} 11 L71 4`} fill="none" stroke="#edbd77" strokeWidth="4" strokeLinejoin="round"/>
    <g transform="translate(0 8)"><g className="marble-lever-arm" style={{transform:`rotate(${-dir*62}deg)`}}>
      <path d="M-4 0L-2 21Q0 26 3 22L5 0Z" fill="#ffe0a0" stroke="#6b502c" strokeWidth="2"/>
    </g></g>
    <ellipse cx="0" cy="8" rx="12" ry="8" fill="#37555b" stroke="#e4bc7c" strokeWidth="3"/>
    <g transform="translate(73 4)">
      <path d="M-35 -1 Q-37 -9 -27 -13 L22 -13 Q31 -13 35 -6 L36 6 Q36 10 28 12 L-24 12 Q-32 11 -35 5Z"
        fill="#214450" stroke="#193743" strokeWidth="3"/>
      <path d="M-33 -4 Q-35 -8 -25 -12 L22 -12 Q30 -12 33 -5 Q33 -1 25 1 L-26 1Z" fill="#c89352" stroke="#ffe0a2" strokeWidth="2"/>
      <path d="M-19 -5H19" stroke="#423c34" strokeWidth="5" strokeLinecap="round"/>
      <g className="marble-lever-arm" style={{transform:`rotate(${dir*36}deg)`}}>
        <path d="M0 0L0 -33" stroke="#304755" strokeWidth="11" strokeLinecap="round"/>
        <path d="M-1 0L-1 -34" stroke="#e8ce9c" strokeWidth="5"/>
        <circle cy="-34" r="14" fill="#c04731" stroke="#66362c" strokeWidth="3"/>
        <circle cx="-4" cy="-39" r="5.3" fill="#ffbd86"/>
      </g>
      <circle r="7" fill="#f1cf8a" stroke="#384853" strokeWidth="2"/>
      <circle r="2.7" fill="#8b693d"/>
    </g>
  </g>;
}

// The rear half is below the ball in paint order. The front lip occludes it as it drops.
export function SplitHatch({ point, open, front = false, scale = 1 }: { point: Peg; open: number; front?: boolean; scale?: number }) {
  const gap = open*31;
  return <g transform={`translate(${point.x} ${point.y}) scale(${scale}) translate(0 13)`} aria-hidden="true">
    {front ? <path d="M-37 2C-34 22 34 22 37 2" fill="none" stroke="#f1cb82" strokeWidth="4.5"/> :
      <g data-hatch-open={open.toFixed(2)}>
        <path d="M-37 -25 Q0 -38 37 -25 L31 -1 Q1 11 -31 -1Z" fill="#b5e6df" fillOpacity=".48" stroke="#437276" strokeWidth="2.5"/>
        <ellipse cy="-25" rx="37" ry="10" fill="#b0e2db" fillOpacity=".42" stroke="#dfb774" strokeWidth="4"/>
        <path d="M-30 -20L-27 -6 M27 -21L25 -11" stroke="#fff3cb" strokeWidth="3" strokeLinecap="round"/>
        <rect x="-57" y="-4" width="114" height="10" rx="5" fill="#233e4b" stroke="#c29b65" strokeWidth="2.5"/>
        <ellipse rx="39" ry="17" fill="#162e39" stroke="#f0c987" strokeWidth="4"/>
        {([-1,1] as const).map(side=><g key={side} transform={`translate(${side*gap} 0) scale(${side} 1)`}>
          <path d="M1 -14 C45 -14 45 14 1 14Z" fill="#e5ae60" stroke="#624b34" strokeWidth="2"/>
          <path d="M5 -10 Q23 -10 30 -4 M5 -4L28 -2" fill="none" stroke="#ffe4a0" strokeWidth="2" strokeLinecap="round"/>
        </g>)}
      </g>}
  </g>;
}
