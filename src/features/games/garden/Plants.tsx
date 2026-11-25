import type { ReactNode } from 'react';
import type { Crop, Look } from './model';

/*
  Beds, young plants and weeds are drawn here in SVG so every growth stage lines up with its bed.
  Only the ready-to-pick plants are Codex pictures (/games/vip/garden/<crop>-plant.webp).
  Units are the scene's 900 × 530 space; (0,0) is the middle of the bed's soil.
*/
export function Bed({ look, wet, closed }: { look: Look | 'closed'; wet: boolean; closed: boolean }) {
  const soil = look === 'wild' || closed ? '#c9a46a' : wet ? '#5b3a22' : '#8a5a34';
  return <g>
    <ellipse cx="4" cy="34" rx="112" ry="16" fill="#3d5b2a" opacity=".22" />
    <path d="M-104 12-92-26H92l12 38Z" fill="#b77a45" stroke="#7d4e2a" strokeWidth="3" strokeLinejoin="round" />
    <path d="M-104 12h208v20h-208Z" fill="#9a6337" stroke="#7d4e2a" strokeWidth="3" strokeLinejoin="round" />
    <path d="M-86 24h40M-20 24h44M48 24h40" stroke="#c48a52" strokeWidth="3" strokeLinecap="round" />
    <path d="M-86-20H86l9 28h-190Z" fill={soil} />
    {look === 'wild' || closed ? <g fill="none" stroke="#7e9f4a" strokeWidth="3" strokeLinecap="round">
      <path d="m-60-4-4-10m6 10 3-11m-30 15-5-8M28-8l-3-9m6 9 4-10m36 16 3-8m-4 8-5-9" />
      <circle cx="-30" cy="0" r="4" fill="#a8885a" stroke="none" /><circle cx="44" cy="-12" r="3" fill="#a8885a" stroke="none" />
    </g> : <g fill="none" stroke={wet ? '#3b2414' : '#6b4226'} strokeWidth="4" strokeLinecap="round" opacity=".75">
      <path d="M-78-12H78M-84 0H84" />
    </g>}
    {wet && !closed && <path d="M-60-14q20-4 40 0M30-2q18-3 36 0" stroke="#9ad7e6" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity=".7" />}
    {closed && <g transform="translate(0 -8)">
      <rect x="-15" y="-6" width="30" height="24" rx="5" fill="#6b5a3d" />
      <path d="M-9-6v-7a9 9 0 0 1 18 0v7" fill="none" stroke="#6b5a3d" strokeWidth="5" />
    </g>}
  </g>;
}

const leafColor = '#4fae5a';
/** A young plant. Each crop has its own leaf shape so the child can tell beds apart before harvest. */
export function YoungPlant({ crop, look, droop }: { crop: Crop; look: Look; droop: boolean }) {
  const tilt = droop ? 'rotate(18)' : undefined;
  const fill = droop ? '#9aa85a' : leafColor;
  if (look === 'seed') return <g>
    <ellipse cx="0" cy="-2" rx="22" ry="7" fill="#7a4b2a" />
    <g fill="#f2d99b"><ellipse cx="-8" cy="-4" rx="3.5" ry="2.4" /><ellipse cx="3" cy="-6" rx="3.5" ry="2.4" /><ellipse cx="10" cy="-2" rx="3.5" ry="2.4" /></g>
  </g>;
  if (look === 'sprout') return <g transform={tilt}>
    <path d="M0 0V-22" stroke="#3f8f45" strokeWidth="4" strokeLinecap="round" />
    <path d="M0-20q-20-12-26 2 14 8 26-2Z" fill={fill} /><path d="M0-22q18-16 26-2-12 10-26 2Z" fill={fill} />
  </g>;
  // Half grown: crop-shaped leaves.
  const shapes: Record<Crop, ReactNode> = {
    carrot: <g stroke={fill} strokeWidth="5" strokeLinecap="round" fill="none">
      <path d="M0 0-16-46M0 0V-54M0 0 16-46M0 0-30-32M0 0 30-32" />
    </g>,
    lettuce: <g fill={fill}>
      <ellipse cx="-14" cy="-16" rx="18" ry="14" /><ellipse cx="14" cy="-16" rx="18" ry="14" /><ellipse cx="0" cy="-26" rx="18" ry="16" fill="#7cc66a" />
    </g>,
    tomato: <g>
      <path d="M-2 0V-60" stroke="#c9a36b" strokeWidth="4" />
      <path d="M0 0Q-6-30 4-56" stroke="#3f8f45" strokeWidth="4" fill="none" />
      <g fill={fill}><ellipse cx="-14" cy="-24" rx="13" ry="7" /><ellipse cx="14" cy="-38" rx="13" ry="7" /><ellipse cx="-10" cy="-50" rx="11" ry="6" /></g>
      <circle cx="10" cy="-26" r="6" fill="#9ccc5a" />
    </g>,
    corn: <g fill={fill}>
      <path d="M-3 0V-74h6V0Z" fill="#6aa84f" />
      <path d="M0-20q-30-6-36-30 22 8 36 22Z" /><path d="M0-36q30-6 34-32-20 10-34 26Z" /><path d="M0-54q-22-4-26-24 16 6 26 18Z" />
    </g>,
    pumpkin: <g fill={fill}>
      <path d="M0 0q-10-18 4-30" stroke="#3f8f45" strokeWidth="4" fill="none" />
      <circle cx="-16" cy="-16" r="14" /><circle cx="16" cy="-20" r="15" /><circle cx="2" cy="-34" r="13" />
      <circle cx="26" cy="-4" r="7" fill="#f0c04a" />
    </g>,
  };
  return <g transform={tilt}>{shapes[crop]}</g>;
}

export function Weed() {
  return <g>
    <path d="M0 0-14-30M0 0-4-36M0 0 8-34M0 0 18-24M0 0-22-14" stroke="#2f6b3a" strokeWidth="5" strokeLinecap="round" />
    <path d="M-14-30l-6-6M-4-36l-2-8M8-34l4-7M18-24l7-3" stroke="#2f6b3a" strokeWidth="4" strokeLinecap="round" />
  </g>;
}
