import { useId } from "react";
import atlas from "../vip/world.module.css";

const world = { x: -600, y: -380, width: 2080, height: 1350 };

const lands = [
  "M-680-445H130L164-326Q143-295 153-253Q183-223 152-198Q126-170 151-141Q162-110 123-96Q80-85 51-65Q20-59-1-77Q-17-86-46-62Q-86-31-137-50Q-183-69-224-40Q-256-17-272 24Q-274 61-302 78Q-341 101-333 133Q-325 167-358 191Q-390 218-379 244Q-388 282-439 282Q-483 276-516 295Q-552 318-583 294L-680 312Z",
  "M266-470H980L975-347Q942-321 941-296Q936-260 902-249Q855-241 835-213Q807-178 771-182Q741-186 711-158Q683-129 642-136Q604-143 582-119Q558-94 531-102Q508-107 488-88Q461-63 431-74Q406-78 378-65Q343-48 320-69Q299-92 269-94Q233-98 241-135Q259-173 243-209Q223-251 246-291Q263-317 253-354Z",
  "M1615-430H1327Q1271-369 1240-358Q1185-338 1186-299Q1195-257 1158-229Q1115-203 1133-172Q1154-142 1133-119Q1091-88 1107-54Q1120-23 1090-12Q1055 4 1069 39Q1077 58 1057 77Q1021 106 1022 143Q1019 183 973 200Q931 211 946 250Q954 274 926 292Q891 310 916 339Q937 364 981 365Q1026 367 1047 393Q1063 419 1090 408Q1126 390 1144 419Q1172 450 1231 437Q1257 433 1281 451Q1309 474 1343 455Q1376 436 1400 457Q1438 488 1486 461L1615 487Z",
  "M-710 523Q-624 526-590 512Q-545 488-512 515Q-482 535-437 517Q-396 507-386 538Q-380 568-341 560Q-291 543-271 576Q-262 606-211 610Q-173 617-159 650Q-151 671-110 682Q-71 699-77 728Q-87 764-60 778Q-29 804 20 798Q44 796 65 822Q87 850 139 846Q185 841 210 883L264 1039H-710Z",
  "M336 1055Q353 989 392 964Q416 944 418 911Q419 884 452 877Q487 872 488 836Q495 805 535 802Q577 802 596 771Q607 745 645 748Q679 754 696 723Q717 686 745 691Q788 695 801 657Q815 618 850 617Q892 618 912 594Q939 558 975 573Q1009 588 1035 563Q1065 535 1101 548Q1136 565 1164 535Q1196 512 1224 530Q1260 548 1293 530Q1325 507 1353 524Q1385 550 1421 531Q1465 512 1497 544L1560 577V1060Z",
];
const mountains = [[-535,-58,.88],[-449,-100,1.14],[-343,-73,.82],[-278,-151,1.19],[-131,-200,.9],[299,-143,.61],[371,-160,.87],[449,-199,1.2],[553,-238,1.04],[657,-265,.83],[1165,179,.69],[1219,148,.92],[1286,121,1.12],[1382,152,.82],[-557,795,.88],[-487,811,.72],[-422,870,1.1],[880,823,.87],[944,796,1.1],[1040,814,.8],[1117,865,1.12]];
const islands = [[-200,242,.8],[-123,219,.46],[-30,140,.36],[191,-80,.33],[788,48,.55],[846,73,.33],[861,461,.72],[816,489,.41],[504,628,.63],[461,655,.3],[-145,512,.46],[-233,472,.32]];
const pines = [[-459,205,.95],[-416,178,1.25],[-392,138,.93],[-256,-70,1.06],[-170,-118,.79],[278,-200,1.17],[591,-151,.7],[1082,330,1],[1170,296,.73],[1370,333,1.16],[-455,677,1.18],[-369,729,.94],[831,766,.82],[1200,707,1.23],[1280,663,.93],[1335,624,1.12]];

export function BeyondTheMarket() {
  const prefix = useId();
  const id = (name: string) => `${prefix}-${name}`;
  const paint = (name: string) => `url(#${id(name)})`;
  return <g>
    <defs>
      <linearGradient id={id("highlands")} x2=".27" y2="1">
        <stop stopColor="#8ca79e"/><stop offset=".56" stopColor="#7ca39a"/><stop offset="1" stopColor="#5e9290"/>
      </linearGradient>
      <g id={id("summit")}>
        <path d="M-59 0q7-11 15-15l25-42q6-10 12-4l21-42q6-10 12-1l28 62 21 31q-52 21-134 11Z" fill="#66848a"/>
        <path d="m-52-3 37-55 9 4 20-44 8-5 10 25-12-6-12 24-7-6-14 32-5-11-19 36Z" fill="#a0afb0"/>
        <path d="m20-84 9 13 25 57-24-18-11-23-9 7Z" fill="#758e94"/>
      </g>
      <g id={id("atoll")}>
        <path d="M-38 4q-10-13 7-19 10-2 16-10 11-8 24 1l20 1q12 2 14 11 12 14-6 20-11 2-19 7-15 8-30 0-17 0-26-11Z" fill="#789e98" stroke="#b1c5b7" strokeWidth="5"/>
        <path d="m-17-6 8-11 14 2 7 10-11 6-14-2Z" fill="#8faba4"/>
      </g>
      <g id={id("fir")}>
        <path d="M-9 0-5-10h-4l6-12h-2l6-14 6 15H5l6 11H8l5 10Z" fill="#628b82"/>
        <path d="M-6-1-1-12h-3l5-10 1-9 3 12-3 1 6 8H4l6 12Z" fill="#77978a"/>
      </g>
      <g id={id("copse")}>
        <use href={`#${id("fir")}`} transform="translate(7 -20) scale(.78)"/><use href={`#${id("fir")}`} transform="translate(-10 -11) scale(.87)"/>
        <use href={`#${id("fir")}`} transform="translate(21 -7) scale(.94)"/><use href={`#${id("fir")}`} transform="translate(2 0)"/>
      </g>
    </defs>
    {lands.map((d,i) => <g key={i} strokeLinejoin="round">
      <path d={d} transform="translate(0 14)" fill="#719ba6" stroke="#9bc6c5" strokeWidth="21"/>
      <path d={d} transform="translate(0 8)" fill="#839c95" stroke="#aac0b0" strokeWidth="7"/>
      <path d={d} fill={paint("highlands")} stroke="#a6b3a0" strokeWidth="4"/>
    </g>)}
    {islands.map(([x,y,s]) => <use key={x} href={`#${id("atoll")}`} transform={`translate(${x} ${y}) scale(${s})`}/>)}
    {mountains.map(([x,y,s]) => <use key={x} href={`#${id("summit")}`} transform={`translate(${x} ${y}) scale(${s})`}/>)}
    {pines.map(([x,y,s]) => <use key={x} href={`#${id("copse")}`} transform={`translate(${x} ${y}) scale(${s})`}/>)}
    <g fill="none" stroke="#86aeaf" strokeWidth="7" strokeLinecap="round">
      <path d="M-342-112q66 69 41 86-23 20 1 36t12 39"/>
      <path d="M1193 152q47 64 5 85t-32 49q11 25-28 49t-44 64"/>
      <path d="M916 815q-47 5-53-26-9-32-44-35-42-2-37-30"/>
    </g>
  </g>;
}

const restaurantClearing = "M900 160C905 120 950 100 990 104C1030 108 1050 140 1044 172C1040 204 1010 226 970 228C940 232 914 250 906 236Q896 200 900 160Z";
const gardenClearing = "M700 250C730 226 790 236 830 224C880 212 940 224 966 256C984 284 968 330 930 346C890 360 830 356 796 336C760 322 720 300 704 284Q692 266 700 250Z";
const clearing = "M81 354C112 345 147 364 179 350C215 334 258 330 283 306C308 284 330 246 358 241C394 232 414 243 448 260C475 274 502 282 530 260C559 238 555 214 549 195C542 166 548 134 576 118C584 80 611 60 651 65C698 72 705 94 711 130C740 149 749 192 722 225C716 254 688 264 654 266C626 280 606 304 576 323C547 350 526 361 490 359C441 356 412 323 379 321C353 318 338 351 313 367C281 388 241 399 202 407C168 418 136 417 117 437C94 457 63 460 43 443C25 424 35 389 56 377Q64 361 81 354Z";

/** Mist banks are drawn in world coordinates; the revealed area follows the playable route. */
/** `garden` clears the mist over the bridge and the garden islet once that route is open. */
export function WorldFog({ garden = false, restaurant = false }: { garden?: boolean; restaurant?: boolean }) {
  const prefix = useId();
  const id = (name: string) => `${prefix}-${name}`;
  const paint = (name: string) => `url(#${id(name)})`;
  const banks = [
    [-562,-185,1.3],[-218,-256,.93],[125,-281,1.1],[472,-305,1.3],[930,-288,.99],[1340,-194,1.27],
    [-510,67,1.2],[-285,-39,.95],[-29,22,1.05],[239,-45,1.03],[522,-41,.87],[838,-65,1.22],[1159,34,1.14],[1479,60,1.24],
    [-588,327,1.22],[-255,212,1.23],[40,172,.88],[240,150,.87],[412,140,.76],[790,169,.82],[1024,255,1.22],[1374,306,1.32],
    [-496,546,1.25],[-208,408,.97],[-17,550,.88],[207,529,.97],[431,433,.75],[667,443,1.05],[924,490,.95],[1223,555,1.22],[1500,583,.9],
    [-572,820,1.1],[-294,719,1.05],[22,766,1.22],[323,705,.95],[615,722,1.22],[943,756,1.15],[1336,819,1.22],
    [-251,976,1.13],[321,981,1.26],[834,974,1.01],
  ];
  return <g pointerEvents="none">
    <defs>
      <filter id={id("soft")} x="0" y="30" width="1100" height="470" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation="16"/>
      </filter>
      <mask id={id("reveal")} {...world} maskUnits="userSpaceOnUse">
        <rect {...world} fill="white"/>
        <path d={clearing} fill="black" filter={paint("soft")}/>
        {garden && <path data-fog-cleared="garden" className={atlas.fogClearing} d={gardenClearing} fill="black" filter={paint("soft")}/>}
        {restaurant && <path data-fog-cleared="restaurant" className={atlas.fogClearing} d={restaurantClearing} fill="black" filter={paint("soft")}/>}
      </mask>
      <linearGradient id={id("veil")} x2=".62" y2="1">
        <stop stopColor="#a2bbce"/><stop offset=".4" stopColor="#b7c9d2"/><stop offset=".75" stopColor="#a4bec9"/><stop offset="1" stopColor="#88a7bb"/>
      </linearGradient>
      <linearGradient id={id("bank")} x2=".06" y2="1">
        <stop stopColor="#fcfbef" stopOpacity=".85"/><stop offset=".27" stopColor="#e9f0e9" stopOpacity=".82"/>
        <stop offset=".6" stopColor="#c9dcde" stopOpacity=".8"/><stop offset="1" stopColor="#a3becb" stopOpacity=".18"/>
      </linearGradient>
      <radialGradient id={id("haze")}>
        <stop stopColor="#e4ece6" stopOpacity=".92"/><stop offset=".66" stopColor="#d5e5e2" stopOpacity=".71"/><stop offset="1" stopColor="#d4e5e1" stopOpacity="0"/>
      </radialGradient>
      <g id={id("cloud")}>
        <ellipse cx="3" cy="3" rx="183" ry="55" fill={paint("haze")}/>
        <path d="M-163 17q-8-17 15-25 3-13 21-14 8-24 36-23 11-27 39-25 22-33 59-20 29-12 51 13 28-1 42 23 27 0 35 18 23 4 21 18 25 10 9 22-23 15-64 17-37 13-78 4-42 12-77 0-41 3-66-7-34 0-43-11Z" fill={paint("bank")}/>
        <g fill="none" strokeLinecap="round">
          <path d="M-119-26q9-18 30-17 11-24 35-23m6-3q17-26 46-19" stroke="#fafbf2" strokeWidth="3.2" opacity=".64"/>
          <path d="M-100-3q7-9 23-9 11-16 28-14m48-21q11-8 24-3 11-8 24 2" stroke="#eef5ef" strokeWidth="3.1" opacity=".71"/>
          <path d="M-156 18q37 8 59 5 21 9 44 6m68 4q28 2 48-4 17 3 37-2" stroke="#a6c1cc" strokeWidth="3.5" opacity=".65"/>
        </g>
      </g>
      <g id={id("low-bank")}>
        <ellipse cx="2" cy="4" rx="193" ry="45" fill={paint("haze")}/>
        <path d="M-181 10q9-15 33-18 8-11 29-9 17-19 43-16 4-15 25-17 10-24 35-18 19-14 42-4 19-4 32 12 28-2 40 17 19-3 34 10 28-3 40 14 25 2 21 15-26 16-82 18-29 9-72 6-52 12-95 3-65 4-109-13-24-3-16-10Z" fill={paint("bank")}/>
        <g fill="none" strokeLinecap="round">
          <path d="M-137-10q8-8 20-6 17-16 39-15m30-19q13-19 33-14 17-12 35-6" stroke="#fafbf1" strokeWidth="3.5" opacity=".7"/>
          <path d="M-94 3q16-5 33-4 11-12 30-9m68-18q18-4 28 6 19-1 28 8" stroke="#eef4ec" strokeWidth="3.4" opacity=".65"/>
          <path d="M-170 14q22 7 49 4 22 9 49 6m78 6q44 3 67-5 25 1 39-5" stroke="#a8c1ca" strokeWidth="3.3" opacity=".68"/>
        </g>
      </g>
      <g id={id("strand")} fill="none" strokeLinecap="round">
        <path d="M-80 0q35-6 68-3 30 6 61 1" stroke="#eef5ee" strokeWidth="4" opacity=".7"/>
        <path d="M-29 7q26-1 49 2t53-1" stroke="#a2bec9" strokeWidth="3" opacity=".61"/>
      </g>
    </defs>
    <g mask={paint("reveal")}>
      <rect {...world} fill={paint("veil")} opacity=".76"/>
      {banks.map(([x,y,scale],i) => <use key={i} href={`#${id(i % 3 ? "cloud" : "low-bank")}`}
        transform={`translate(${x} ${y}) scale(${i % 3 === 1 ? -scale : scale} ${scale * (i % 2 ? .81 : 1.06)})`} opacity={i % 3 ? ".9" : ".79"}/>)}
      {[[-345,334],[55,280],[355,75],[713,16],[913,354],[557,564],[113,636],[1180,712],[1190,-114],[-300,610],[-325,15],[30,-122],[989,905]].map(([x,y]) =>
        <use key={x} href={`#${id("strand")}`} x={x} y={y}/>)}
    </g>
  </g>;
}
