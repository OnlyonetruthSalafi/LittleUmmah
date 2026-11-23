import { useId } from "react";
import { trailPath as trail } from "../vip/trail";
import { BeyondTheMarket, WorldFog } from "./WorldFog";
import { GardenMapArt, RestaurantMapArt } from "../vip/GardenMapArt";

const island = "M51 314C47 297 64 278 82 269C90 247 72 239 87 221C101 206 118 207 130 192C141 175 143 155 163 151C192 143 214 151 232 140C260 123 279 106 312 108C346 109 357 123 382 116C419 103 439 86 475 95C507 101 519 116 545 110C591 96 608 101 628 116C655 136 673 137 685 158C701 171 710 170 720 182C737 205 724 217 742 236C758 254 747 274 735 283C724 293 739 307 724 320C701 337 687 334 675 356C662 379 641 381 617 382C584 384 583 403 558 412C528 426 492 411 474 419C448 430 423 450 393 448C356 447 353 436 322 441C290 448 267 453 236 442C204 429 195 439 166 425C146 415 149 404 126 400C95 393 98 376 78 367C54 354 62 334 51 314Z";
const trees = [[143,249,.82],[170,244,.98],[198,241,.78],[224,257,.68],[150,273,.68],[180,271,.78],[203,280,.65],[276,192,.56],[302,196,.68],[737,240,.52],[712,258,.7],[491,357,.58],[533,379,.75],[563,367,.63]];
const stones = [[125,304,.61],[231,222,.60],[457,403,.7],[475,397,.45],[302,414,.51],[706,295,.65],[118,192,.5],[371,174,.42],[218,480,.75],[37,239,.77],[751,391,.55]];
const grasses = [[130,285],[205,311],[251,245],[251,321],[294,288],[328,236],[380,247],[442,256],[476,277],[412,330],[327,363],[584,305],[642,286],[613,353],[398,389],[215,409],[105,320],[532,201],[558,171],[686,271],[456,173]];
const flowers = [[249,273],[237,281],[431,242],[446,245],[361,359],[374,363],[624,330],[636,327],[187,330],[512,252]];
const waves = [[31,90],[85,58],[208,74],[276,30],[429,44],[522,59],[712,82],[761,134],[26,183],[775,327],[683,419],[715,460],[482,476],[359,498],[102,469],[35,406],[97,114],[328,67],[650,56],[63,493],[544,509],[255,491]];

/** The trail and the shop threshold align with the player's world coordinates. */
export function MarketMapArt({ garden = false, restaurant = false }: { garden?: boolean; restaurant?: boolean }) {
  const prefix = useId();
  const id = (name: string) => `${prefix}-${name}`;
  const paint = (name: string) => `url(#${id(name)})`;
  return <svg viewBox="-600 -380 2080 1350" width="2080" height="1350" aria-hidden="true" focusable="false"
    style={{ display: "block", width: "100%", height: "auto" }}>
    <defs>
      <linearGradient id={id("sea")} x2=".48" y2="1">
        <stop stopColor="#b5f2e8"/><stop offset=".42" stopColor="#77dbd6"/><stop offset="1" stopColor="#3faab9"/>
      </linearGradient>
      <linearGradient id={id("grass")} x2=".45" y2="1">
        <stop stopColor="#d3e991"/><stop offset=".48" stopColor="#aed77b"/><stop offset="1" stopColor="#77bd78"/>
      </linearGradient>
      <linearGradient id={id("cliff")} x2="0" y2="1">
        <stop stopColor="#dbad71"/><stop offset=".72" stopColor="#c18755"/><stop offset="1" stopColor="#ad754a"/>
      </linearGradient>
      <linearGradient id={id("foliage")} x2=".7" y2="1">
        <stop stopColor="#a9d970"/><stop offset=".44" stopColor="#71be68"/><stop offset="1" stopColor="#388c60"/>
      </linearGradient>
      <linearGradient id={id("leaf")} x2=".64" y2="1">
        <stop stopColor="#80d77e"/><stop offset=".7" stopColor="#3eac75"/><stop offset="1" stopColor="#20876d"/>
      </linearGradient>
      <linearGradient id={id("fruit")} x2=".72" y2="1">
        <stop stopColor="#ffdd6b"/><stop offset=".54" stopColor="#ffab43"/><stop offset="1" stopColor="#ed7434"/>
      </linearGradient>
      <linearGradient id={id("rock")} x2=".62" y2="1">
        <stop stopColor="#e3e3ce"/><stop offset=".55" stopColor="#b5c8b4"/><stop offset="1" stopColor="#869f94"/>
      </linearGradient>
      <linearGradient id={id("sand")} x2="0" y2="1">
        <stop stopColor="#ffe9ad"/><stop offset="1" stopColor="#e4bc81"/>
      </linearGradient>
      <g id={id("wave")} fill="none" strokeLinecap="round" stroke="#e2fff4">
        <path d="M-13 0q8 2 16-1" strokeWidth="2.8"/><path d="M8-4h6" strokeWidth="2"/>
      </g>
      <g id={id("grass-blades")} fill="none" strokeLinecap="round" stroke="#5ca773" strokeWidth="2.5">
        <path d="m-4 1-3-4m6 3 1-5m3 5 4-3"/>
      </g>
      <g id={id("flower")}>
        <path d="m-4 1 3 4 5-4" fill="none" stroke="#579b63" strokeWidth="2.2"/>
        <path d="M-3-3c-4-4-7 3-2 4-2 5 5 7 6 2 5 2 8-4 2-6 1-5-5-5-6 0Z" fill="#fff8cc"/>
        <circle cy="0" r="2.2" fill="#f6b73c"/>
      </g>
      <g id={id("stone")}>
        <ellipse cx="5" cy="2" rx="16" ry="5" fill="#527e76" opacity=".28"/>
        <path d="m-15-3 6-11 12-4 10 7 3 11-11 4-15-2Z" fill={paint("rock")}/>
        <path d="m-10-5 4-7 7-2" fill="none" stroke="#f2eed3" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="m2 3 4-9 7-5 3 11Z" fill="#8ba99b" opacity=".6"/>
      </g>
      <g id={id("tree")}>
        <ellipse cx="5" cy="0" rx="21" ry="6.2" fill="#488961" opacity=".23"/>
        <path d="M-4 0-4-22l8-3L5 0Q1 4-4 0Z" fill="#997451"/>
        <path d="M1-2V-17l7-7" fill="none" stroke="#c49a66" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M-21-19c-7-6-5-19 1-24 0-12 12-17 20-16 9-4 20 3 21 12 10 5 11 16 5 23-4 9-14 12-23 9-7 4-18 3-24-4Z" fill="#4a9865"/>
        <path d="M-22-24c-6-9 0-19 6-22 1-10 11-15 19-13 11-3 19 7 18 15 6 4 7 14 1 19-5 6-14 7-20 4-6 5-18 5-24-3Z" fill={paint("foliage")}/>
        <path d="M-15-39c-1-6 4-12 9-13m3-2 4-1" fill="none" stroke="#d2e899" strokeWidth="3.6" strokeLinecap="round"/>
      </g>
      <g id={id("palm")}>
        <ellipse cx="7" cy="1" rx="22" ry="6" fill="#4c926b" opacity=".25"/>
        <path d="M-6 1Q2-22 0-52l8 1Q13-28 4 0Z" fill="#a87747"/>
        <path d="M-4-1Q4-26 2-51l4 1Q9-27 0 0Z" fill="#d5a66a"/>
        <path d="m1-12 5-1M3-25l4-1M3-37l4-1" stroke="#b88756" strokeWidth="2.5"/>
        <g fill={paint("leaf")}>
          <path d="M4-51Q-17-77-35-56q18-6 32 7Z"/>
          <path d="M4-51Q-26-65-42-37q17-13 44-11Z"/>
          <path d="M5-52Q-16-52-19-25q12-15 26-24Z"/>
          <path d="M3-52q17-25 37-15-17 1-30 17Z"/>
          <path d="M5-50q31-19 43 4-23-7-39-2Z"/>
          <path d="M4-50q25-6 25 21-11-13-23-17Z"/>
        </g>
        <path d="M-31-55q18-11 33 6m7-2q15-12 29-12" fill="none" stroke="#a6e495" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="2" cy="-49" r="3.8" fill="#bf8b42"/><circle cx="8" cy="-50" r="3.8" fill="#e2a64f"/>
      </g>
      <g id={id("windmill")}>
        <ellipse cx="4" cy="0" rx="30" ry="8" fill="#54835f" opacity=".24"/>
        <path d="M-17-2-11-49 10-49 20-2Q1 5-17-2Z" fill="#fff0c7"/><path d="m7-48 6-1 7 47-10 3Z" fill="#e1bd88"/>
        <path d="M-16-46q1-16 15-24 15 9 18 24-15 7-33 0Z" fill="#579b91"/>
        <path d="M-6 0v-13q6-8 12-1v15Z" fill="#99794f"/>
        <g transform="translate(0 -47) rotate(30)">
          {[0,90,180,270].map(angle => <g key={angle} transform={`rotate(${angle})`}>
            <path d="M0-2v-36" stroke="#a8754d" strokeWidth="3.2" strokeLinecap="round"/>
            <path d="m-1-38-8 2 1 20 7-3Z" fill="#fff4ce" stroke="#c49b6a" strokeWidth="1.5"/>
          </g>)}
        </g>
        <circle cy="-47" r="4.6" fill="#f5bf6b"/>
      </g>
    </defs>

    <rect x="-600" y="-380" width="2080" height="1350" fill={paint("sea")}/>
    <BeyondTheMarket />
    {waves.map(([x,y]) => <use key={x} href={`#${id("wave")}`} x={x} y={y} opacity=".7"/>)}
    <path d={island} transform="translate(0 18)" fill="#77d3be" stroke="#87e8d6" strokeWidth="31" strokeLinejoin="round"/>
    <path d={island} transform="translate(0 16)" fill={paint("cliff")} stroke="#f7efcd" strokeWidth="8" strokeLinejoin="round"/>
    <path d={island} transform="translate(0 11)" fill={paint("cliff")}/>
    <path d={island} transform="translate(0 3)" fill={paint("sand")} stroke="#e4c68a" strokeWidth="4"/>
    <path d={island} fill={paint("grass")} transform="translate(400 270) scale(.96 .935) translate(-400 -270)" stroke="#d8dd9a" strokeWidth="5"/>

    <g fill="#a4c774" opacity=".55">
      <path d="M113 262q9-21 35-29 35-19 72-2 19 8 14 21-10 16-41 15-52 21-80-5Z"/>
      <path d="M476 371q20-25 57-39 30-13 57-4 4 13-13 24-39 32-101 19Z"/>
    </g>
    <g transform="translate(449 213) rotate(-9)">
      <path d="M-47-6q10-10 28-9 9-11 28-9 23-1 33 9 20 15-9 21-18 5-29 1-22 6-43 2-17-3-8-15Z" fill="#8fba81" stroke="#d3df97" strokeWidth="4"/>
      <path d="M-43-5q9-9 25-7 10-10 26-9 22-1 30 9 12 10-9 15-15 5-29 0-22 7-39 2-11-2-4-10Z" fill="#72c6bb"/>
      <path d="M-27-7q10-3 18-2m18-6q11 0 16 2m-33 13q7-2 14-2" stroke="#b6ece0" fill="none" strokeWidth="2.4" strokeLinecap="round"/>
      <path d="m-41 1-3-11m7 9 1-9m66 13 2-8" stroke="#699c65" fill="none" strokeWidth="2" strokeLinecap="round"/>
    </g>
    <g transform="translate(614 349) rotate(-18)" strokeLinecap="round">
      <path d="M-29-5q25-12 51-5l1 13q-24-6-49 8Z" fill="#b4bb79"/>
      {[-19,-7,5,17].map((x,i) => <g key={x} transform={`translate(${x} ${i === 0 ? 1 : -2})`}>
        <path d="M0 3v-11m0 8-5-4m5 5 5-6" fill="none" stroke="#558c64" strokeWidth="1.8"/>
        <ellipse cy="-9" rx="3.2" ry="5.4" fill="#ab92b0"/><ellipse cx="-4" cy="-6" rx="2.4" ry="3.5" fill="#ceabc1"/>
      </g>)}
    </g>
    {/* Hills beyond the trail. The pale faces catch the light from the upper left. */}
    <g strokeLinejoin="round">
      <path d="M168 191 204 123q9-15 21-3l27 42 23-31q7-9 15 0l34 57q-65 21-156 3Z" fill="#7fb681"/>
      <path d="m173 189 33-63q7-13 16-4l11 17-15-5-6 18-6-3-16 39Z" fill="#a9cf93"/>
      <path d="m218 139 12 16 2-5 18 29-14 2Z" fill="#5fa279"/>
      <path d="m251 184 25-47q6-9 11-2l11 17-14-5-9 19-4-4-12 24Z" fill="#acd296"/>
      <path d="M316 160q12-45 28-47t40 42q-34 12-68 5Z" fill="#93c98a"/>
      <path d="M321 157q12-37 24-40l9 5q-14 1-24 33Z" fill="#bddc9c"/>
    </g>
    <use href={`#${id("windmill")}`} transform="translate(410 170) scale(.91)"/>
    <path d="M402 174Q375 187 357 193" stroke="#e1d49a" strokeWidth="8" strokeLinecap="round" fill="none"/>
    {trees.map(([x,y,scale]) => <use key={x} href={`#${id("tree")}`} transform={`translate(${x} ${y}) scale(${scale})`}/>)}
    {stones.map(([x,y,scale]) => <use key={x} href={`#${id("stone")}`} transform={`translate(${x} ${y}) scale(${scale})`}/>)}
    {grasses.map(([x,y]) => <use key={`${x}-${y}`} href={`#${id("grass-blades")}`} x={x} y={y} opacity=".73"/>)}
    {flowers.map(([x,y]) => <use key={x} href={`#${id("flower")}`} x={x} y={y}/>)}

    <GardenMapArt part="islet"/>
    <RestaurantMapArt/>
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={trail} stroke="#91af68" strokeWidth="34"/>
      <path d={trail} stroke="#d7b67c" strokeWidth="30"/>
      <path d={trail} stroke="#ffe3a4" strokeWidth="26"/>
      <path d={trail} stroke="#fff1c0" strokeWidth="17"/>
      <path d={trail} stroke="#dab777" strokeWidth="2" strokeDasharray="2 13"/>
    </g>
    <GardenMapArt part="bridge"/>
    <GardenMapArt part="bridge" bridge="restaurant"/>
    <g transform="translate(148 387) rotate(-21)">
      <path d="M-70-14H11v31H-70Z" fill="#9f704b"/>
      {[-65,-53,-41,-29,-17,-5,7].map(x => <g key={x}>
        <rect x={x-5} y="-16" width="11.5" height="30" rx="2" fill="#e6b87d"/>
        <path d={`M${x-3}-12v20`} stroke="#f7d298" strokeWidth="1.6"/>
      </g>)}
      {[-70,5].map(x => <g key={x}>{[-17,13].map(y => <g key={y}>
        <path d={`M${x} ${y-5}v12`} stroke="#a47650" strokeWidth="6"/>
        <ellipse cx={x} cy={y-6} rx="3.8" ry="2.3" fill="#f4d398"/>
      </g>)}</g>)}
    </g>
    <g transform="translate(65 436) rotate(27)">
      <ellipse cx="3" cy="4" rx="23" ry="7" fill="#529c9f" opacity=".54"/>
      <path d="M-24-1Q-8-21 23-3 9 15-13 9Z" fill="#b67242"/>
      <path d="M-24-2Q-9-23 23-5 8 10-14 7Z" fill="#ffdc9c"/>
      <path d="M-18-2Q-6-15 17-5 5 5-12 4Z" fill="#a67c54"/>
      <path d="m-7-8 3 11m8-12 2 10" stroke="#f0c58a" strokeWidth="3"/>
      <path d="m-19 10 26-23" stroke="#986b4e" strokeWidth="1.8"/>
      <path d="m5-11 6-6" stroke="#f3d597" strokeWidth="3.5" strokeLinecap="round"/>
    </g>
    <use href={`#${id("palm")}`} transform="translate(96 325) scale(.96)"/>
    <use href={`#${id("palm")}`} transform="translate(343 418) scale(.78)"/>
    <use href={`#${id("palm")}`} transform="translate(372 426) scale(.6)"/>
    <use href={`#${id("palm")}`} transform="translate(696 188) scale(.88)"/>

    {/* Seaside fruit kiosk. Its front step meets the last walkable waypoint. */}
    <g transform="translate(630 226)" strokeLinejoin="round">
      <ellipse cx="8" cy="0" rx="67" ry="15" fill="#487d59" opacity=".27"/>
      <path d="m-62-4 26-13 90 3 9 13-30 13-87-7Z" fill="#aa865a"/>
      <path d="m-62-7 27-13 88 4 9 12-30 12-86-7Z" fill="#efd49b"/>
      <path d="m-45-66 73 8 0 58-73-9Z" fill="#f8dda2"/>
      <path d="m28-58 29-16v59L28 0Z" fill="#c89e6f"/>
      <path d="m-39-58 60 6v34l-60-7Z" fill="#497a77"/>
      <path d="m-36-55 51 5v23l-51-6Z" fill="#335f68"/>
      <path d="m-39-32 62 7v9l-62-8Z" fill="#d9955b"/>
      <path d="m-45-17 74 9v9l-74-9Z" fill="#4d9d8c"/>
      <path d="m29-8 28-15v8L29 1Z" fill="#388879"/>
      <path d="m34-50 15-7v18l-15 8Z" fill="#558e89" stroke="#ead3a3" strokeWidth="2.5"/>
      <g fill="#ffbd53">
        <circle cx="-30" cy="-30" r="4.1"/><circle cx="-22" cy="-28" r="4.5"/><circle cx="-26" cy="-34" r="4"/>
      </g>
      <path d="m3-30 3 1 2 1 1-10-6-1Zm9 2 6 1 1-10-7-1Z" fill="#d7f1e5"/>
      <path d="m-54-77 31-17 89 11-31 17Z" fill="#ffe9a2"/>
      <path d="m35-66 31-17 0 9-31 17Z" fill="#ce8757"/>
      <path d="m-54-77 89 11v9l-89-11Z" fill="#e29c5f"/>
      <path d="m-49-70 79 10 7 17-90-11Z" fill="#fff1c9"/>
      {[-49,-23,3].map(x => <path key={x} d={`m${x} ${-70+(x+49)/8} 13 1.6 2 16-17-2Z`} fill="#f58d68"/>)}
      <path d="m-53-54 90 11v5q-4 5-9 0-5 4-10-2-4 4-9-1-5 4-10-1-5 3-10-2-5 4-10-1-5 4-11-1-5 3-10-1-7 1-11-5Z" fill="#e7835d"/>
      <path d="m-48-53 79 10" fill="none" stroke="#ffce97" strokeWidth="2"/>
      <path d="M-5-80v-13m13 14v-14" stroke="#ad764e" strokeWidth="4"/>
      <circle cx="2" cy="-103" r="19" fill="#a96f45"/>
      <circle cx="1" cy="-106" r="19" fill={paint("fruit")} stroke="#fff3bc" strokeWidth="2.5"/>
      <path d="M-11-111q2-6 8-8" fill="none" stroke="#ffe497" strokeWidth="3" strokeLinecap="round"/>
      <path d="M2-124q3-11 17-11-4 11-17 11Z" fill="#418c65"/>
      <path d="M1-123q-1-6-4-8" stroke="#996e44" strokeWidth="2.5" strokeLinecap="round"/>
    </g>
    <use href={`#${id("grass-blades")}`} x="697" y="251"/>
    <WorldFog garden={garden} restaurant={restaurant} />
  </svg>;
}
