import { bridges } from './trail';

/** The garden islet east of the smoothie shop, and the plank bridge the trail crosses to reach it. */
export function GardenMapArt({ part, bridge = 'garden' }: { part: 'islet' | 'bridge'; bridge?: keyof typeof bridges }) {
  const { from, to } = bridges[bridge];
  const angle = Math.atan2(to.y - from.y, to.x - from.x) * 180 / Math.PI;
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  const islet = 'M790 292C786 270 808 252 836 250C858 236 896 240 918 254C944 262 952 286 942 304C934 326 906 336 876 334C848 340 818 334 802 318C792 310 791 300 790 292Z';
  if (part === 'bridge') return <g transform={`translate(${from.x} ${from.y}) rotate(${angle})`}>
    <path d={`M-2-11H${length + 2}V11H-2Z`} fill="#7a5233" opacity=".35" transform="translate(0 6)" />
    {Array.from({ length: Math.round(length / 9) }, (_, i) => <rect key={i} x={i * 9} y="-11" width="7.5" height="22" rx="1.5" fill="#e6b87d" stroke="#a47650" strokeWidth="1" />)}
    <path d={`M0-12H${length}M0 12H${length}`} stroke="#a47650" strokeWidth="3" />
    {[0, length / 2, length].map(x => <g key={x}><circle cx={x} cy="-12" r="3" fill="#8a5f3c" /><circle cx={x} cy="12" r="3" fill="#8a5f3c" /></g>)}
  </g>;
  return <g strokeLinejoin="round">
    <path d={islet} transform="translate(0 14)" fill="#77d3be" stroke="#87e8d6" strokeWidth="22" />
    <path d={islet} transform="translate(0 11)" fill="#c18755" stroke="#f7efcd" strokeWidth="6" />
    <path d={islet} transform="translate(0 3)" fill="#ffe2a4" stroke="#e4c68a" strokeWidth="3" />
    <path d={islet} transform="translate(866 290) scale(.9) translate(-866 -290)" fill="#b4da7e" stroke="#d8dd9a" strokeWidth="4" />
    {/* Vegetable beds */}
    {[[838, 262], [876, 258], [904, 290], [878, 318]].map(([x, y], i) => <g key={i} transform={`translate(${x} ${y})`}>
      <path d="M-15-7h30l3 12h-36Z" fill="#9a6337" />
      <path d="M-13-6h26l2 9h-30Z" fill="#6b4226" />
      <g fill={['#f08a2c', '#7cc66a', '#e5413a', '#f0c04a'][i]}>
        <circle cx="-7" cy="-3" r="3.4" /><circle cx="1" cy="-4" r="3.4" /><circle cx="9" cy="-3" r="3.4" />
      </g>
      <g fill="#4fae5a"><circle cx="-7" cy="-7" r="2.4" /><circle cx="1" cy="-8" r="2.4" /><circle cx="9" cy="-7" r="2.4" /></g>
    </g>)}
    {/* Tool shed and fence */}
    <g transform="translate(918 270)">
      <path d="M-12 0v-20h24V0Z" fill="#fff0c7" stroke="#c8a36e" strokeWidth="2" />
      <path d="M-16-19 0-32l16 13Z" fill="#2aa79a" stroke="#1d7d73" strokeWidth="2" />
      <path d="M-4 0v-11h8V0Z" fill="#99794f" />
    </g>
    <g stroke="#fffaf0" strokeWidth="3" strokeLinecap="round">
      <path d="M824 322l40 6m10 0 34-6M826 316v8m14-6v8m14-6v8m24-2v8m14-8v8" />
    </g>
  </g>;
}

/** The restaurant islet north of the garden: a small pavilion with tables by the sea. */
export function RestaurantMapArt() {
  const islet = 'M922 176C918 154 936 136 960 134C986 128 1012 138 1018 158C1026 178 1012 196 990 202C968 210 944 206 932 196C926 190 923 184 922 176Z';
  return <g strokeLinejoin="round">
    <path d={islet} transform="translate(0 12)" fill="#77d3be" stroke="#87e8d6" strokeWidth="20" />
    <path d={islet} transform="translate(0 9)" fill="#c18755" stroke="#f7efcd" strokeWidth="5" />
    <path d={islet} transform="translate(0 3)" fill="#ffe2a4" stroke="#e4c68a" strokeWidth="3" />
    <path d={islet} transform="translate(970 170) scale(.88) translate(-970 -170)" fill="#b4da7e" stroke="#d8dd9a" strokeWidth="4" />
    <g transform="translate(978 168)">
      <path d="M-26 0v-22M26 0v-22" stroke="#c8a36e" strokeWidth="4" />
      <path d="M-34-20 0-40l34 20Z" fill="#fff" stroke="#2aa79a" strokeWidth="3" />
      <path d="M-34-20h68l-6 6h-56Z" fill="#2aa79a" />
      <ellipse cx="0" cy="-2" rx="16" ry="6" fill="#e6b87d" stroke="#a47650" strokeWidth="2" />
      <circle cx="-5" cy="-4" r="3" fill="#f08a2c" /><circle cx="5" cy="-4" r="3" fill="#7cc66a" />
      <circle cx="0" cy="-34" r="3.5" fill="#f2c454" />
    </g>
    <g transform="translate(948 186)"><ellipse rx="10" ry="4" fill="#e6b87d" stroke="#a47650" strokeWidth="1.5" /></g>
  </g>;
}
