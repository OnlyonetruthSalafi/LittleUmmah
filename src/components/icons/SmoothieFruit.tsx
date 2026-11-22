import { useId } from 'react';

export type SmoothieIngredient = 'orange' | 'banana' | 'berry';

/** The same fruit shapes appear on the order ticket, the ingredient bins and inside the jar. */
export function SmoothieFruit({ kind }: { kind: SmoothieIngredient }) {
  const paint = useId();
  const light = kind === 'orange' ? '#ffdb63' : kind === 'banana' ? '#fff68e' : '#ff8581';
  const dark = kind === 'orange' ? '#e76c11' : kind === 'banana' ? '#eaa522' : '#ba2541';
  const fill = `url(#${paint})`;

  return <svg aria-hidden="true" focusable="false" viewBox="0 0 64 64" width="100%" height="100%">
    <defs>
      <radialGradient id={paint} cx=".31" cy=".23" r=".86" gradientUnits="objectBoundingBox">
        <stop stopColor={light} /><stop offset="1" stopColor={dark} />
      </radialGradient>
    </defs>
    {kind === 'orange' && <>
      <path d="M34 15q-1-8 5-11" fill="none" stroke="#786125" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M35 14Q18 15 16 4q15-1 19 10" fill="#479954" />
      <path d="M17 7q8 1 16 7" fill="none" stroke="#9cca72" strokeWidth="1.5" />
      <path d="M31 14c14-5 27 4 27 21 0 14-10 23-24 24C18 60 7 51 7 37c0-14 9-25 24-23Z" fill={fill} stroke="#cc6819" strokeWidth="2" />
      <path d="M15 32q2-9 10-12" stroke="#ffe9a0" strokeWidth="3" strokeLinecap="round" fill="none" />
      <g fill="#d67d25"><circle cx="46" cy="43" r="1.2" /><circle cx="42" cy="48" r="1" /><circle cx="49" cy="47" r=".8" /></g>
    </>}
    {kind === 'banana' && <>
      <path d="M47 7l3-3 5 4-2 6C58 31 47 51 29 55c-8 2-18 0-23-6l2-5c16 3 30-4 35-16 4-9 4-12 4-21Z" fill={fill} stroke="#c68c26" strokeWidth="2" strokeLinejoin="round" />
      <path d="M10 47q27 9 40-19" fill="none" stroke="#fff296" strokeWidth="3.5" strokeLinecap="round" />
      <path d="m48 7 6 4 2-4-5-4zM6 47l5 2-2 3-4-3z" fill="#856532" />
    </>}
    {kind === 'berry' && <>
      <path d="M31 18c-16-8-28 2-24 18 2 9 14 24 22 25s22-14 26-24c7-16-5-26-24-19Z" fill={fill} stroke="#ac3548" strokeWidth="2" />
      <path d="M30 17q3-8 1-13" stroke="#517c40" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M32 13q8-5 15-2l-7 5 10 4q-11 3-18-1l-5 9-3-9-12 4 8-9-7-4q10-2 19 3Z" fill="#409459" stroke="#3a7a49" strokeWidth="1.2" />
      <g fill="#ffe5ad">
        {[[15,30],[27,32],[41,28],[47,36],[20,40],[33,42],[27,50],[39,47]].map(([x,y]) =>
          <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="1.45" ry="2.3" transform={`rotate(15 ${x} ${y})`} />)}
      </g>
    </>}
  </svg>;
}
