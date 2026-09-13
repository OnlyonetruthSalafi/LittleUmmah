import { useId } from 'react';

const outlines: Record<string, string> = {
  circle: 'M85 47a35 35 0 1 1-70 0 35 35 0 1 1 70 0Z',
  square: 'M27 14h46q10 0 10 10v46q0 10-10 10H27q-10 0-10-10V24q0-10 10-10Z',
  rectangle: 'M17 24h66q8 0 8 8v30q0 8-8 8H17q-8 0-8-8V32q0-8 8-8Z',
  triangle: 'M50 9 91 81H9Z',
  star: 'm50 5 13 27 30 4-22 22 5 30-26-14-26 14 5-30L7 36l30-4Z',
};

export function GameShape({ shape, color = '#62aaf2', recessed = false }: { shape: string; color?: string; recessed?: boolean }) {
  const id = useId();
  const outline = outlines[shape] ?? outlines.square;
  return <svg viewBox="0 0 100 100" aria-hidden="true" strokeLinejoin="round">
    <defs>
      <linearGradient id={`${id}-light`} x1="0" y1="0" x2=".7" y2="1" gradientUnits="objectBoundingBox">
        <stop stopColor="white" stopOpacity=".7" /><stop offset=".45" stopColor="white" stopOpacity="0" /><stop offset="1" stopColor="#163959" stopOpacity=".28" />
      </linearGradient>
      <linearGradient id={`${id}-inset`} x2="0" y2="1">
        <stop stopColor="#486777" /><stop offset="1" stopColor="#c9dfed" />
      </linearGradient>
    </defs>
    {recessed ? <><path d={outline} fill={`url(#${id}-inset)`} stroke="#486777" strokeWidth="2" /><path d={outline} fill="none" stroke="white" strokeOpacity=".7" strokeWidth="2" strokeDasharray="4 5" /></> : <>
      <path d={outline} fill={color} transform="translate(0 6)" stroke="#1f2937" strokeOpacity=".2" strokeWidth="3" />
      <path d={outline} fill={color} stroke={color} strokeWidth="2" />
      <path d={outline} fill={`url(#${id}-light)`} stroke="white" strokeOpacity=".55" strokeWidth="1.5" />
      <path d={shape === 'circle' ? 'M29 36q5-12 18-15' : shape === 'triangle' ? 'm30 60 18-32' : shape === 'star' ? 'm44 33 6-13' : 'M28 33v-8h22'} fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" opacity=".75" />
    </>}
  </svg>;
}
