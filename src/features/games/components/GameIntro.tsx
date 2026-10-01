import { GameImage as Image } from './GameImage';
import { Thumbnail } from './Artwork';
import { gameAssets, type GameDefinition } from '../data/catalog';
import { gamePresentation } from '../data/presentation';
import { BOARD, piecePath } from '../data/puzzleArt';
import { SpeakerIcon } from '@/components/icons/SpeakerIcon';

/*
  หน้าเลือกด่าน — บนจอเหลือแค่สามอย่างที่เด็กต้องใช้: เล่นอะไร (หัวข้อ + ปุ่มฟัง) → ด่านไหน → ปุ่มเล่น
  คำอธิบาย คำชวน และวิธีเล่นย้ายไปอยู่ใน sr-only ให้เครื่องอ่านหน้าจอ เด็กที่ยังอ่านไม่ออกกดฟังเอาได้
  แนวเดียวกับ VoiceIntro ที่เจ้าของโปรเจกต์กำหนดให้ไม่แสดงคำสั่งเป็นตัวหนังสือ
*/
export function GameIntro({ game, level, onLevel, onStart, onListen, soundOn }: {
  game: GameDefinition; level: number; onLevel: (level: number) => void; onStart: () => void; onListen: () => void; soundOn: boolean;
}) {
  const theme = gamePresentation[game.slug];
  const levels = theme.levels.slice(0, theme.levelCount ?? 3);
  const art = theme.levelArt;
  const tapGame = game.slug === 'memory' || game.slug === 'find-object';
  return <section className="gc-adventure-intro" aria-labelledby="gc-adventure-title">
    <div className="gc-adventure-scene">
      <div className="gc-adventure-aura" aria-hidden="true" />
      <div className="gc-adventure-island"><Thumbnail slug={game.slug} large /></div>
      <Image src={gameAssets.guide} width={160} height={190} alt="" className="gc-adventure-robot" />
    </div>
    <div className="gc-adventure-menu">
      <div className="gc-adventure-heading">
        <h2 id="gc-adventure-title">{game.instruction.th}<span lang="en" className="sr-only"> ({game.instruction.en})</span></h2>
        {/* ปิดเสียงเกมอยู่ ปุ่มฟังจะกดแล้วเงียบ จึงไม่แสดง — เปิดเสียงได้ที่ปุ่มลำโพงบนหัวเกม */}
        {soundOn && <button type="button" className="ui-round" onClick={onListen} aria-label="ฟังวิธีเล่น / Listen"><SpeakerIcon /></button>}
      </div>
      <p className="sr-only">{theme.world.th}: {theme.description.th} <span lang="en">{theme.description.en}</span></p>
      {levels.length > 1 && !theme.journey && <fieldset className="gc-level-path">
        <legend className="sr-only">เลือกด่าน <span lang="en">Choose a level</span></legend>
        <div className="gc-level-stones">{levels.map((label, i) => <button type="button" key={label.en} className="gc-level-stone" data-art={art ? '' : undefined} aria-pressed={level === i + 1} onClick={() => onLevel(i + 1)}>
          {art?.[i] ? <LevelArt {...art[i]} number={i + 1} /> : <span className="gc-level-number" aria-hidden="true">{i + 1}</span>}
          <span className="sr-only">ด่าน {i + 1}{art?.[i] ? ` ภาพ${art[i].label.th}` : ''}: </span><strong>{label.th}</strong><span lang="en" className="sr-only"> ({label.en})</span>
          {level === i + 1 && <span className="gc-level-selected" aria-hidden="true">✓</span>}
        </button>)}</div>
      </fieldset>}
      <button className="gc-button gc-primary gc-adventure-start" onClick={onStart}>ไปเล่นกันเลย! <small lang="en">Let’s play →</small></button>
      {game.slug === 'light-maze'
        ? <p className="sr-only">กดปุ่มทิศ ปัดนิ้ว หรือแตะทางที่จะไป <span lang="en">Press a direction, swipe, or tap where to go</span></p>
        : <p className="sr-only">{tapGame ? 'แตะภาพเพื่อเล่น' : 'แตะชิ้น แล้วแตะช่อง หรือลากไปวาง'} <span lang="en">{tapGame ? 'Tap a picture to play' : 'Tap a piece, then its home — or drag it there'}</span></p>}
    </div>
  </section>;
}

/** ภาพตัวอย่างของด่านบนการ์ดเลือกด่าน: ภาพของด่านนั้น + เส้นตัดชิ้นจิ๊กซอว์จริง เด็กเห็นว่าด่านไหนชิ้นเยอะกว่า */
function LevelArt({ src, columns, rows, number }: { src: string; columns: number; rows: number; number: number }) {
  return <span className="gc-level-art" aria-hidden="true">
    <Image src={src} alt="" width={240} height={240} sizes="(max-width: 639px) 30vw, 160px" />
    <svg viewBox={`0 0 ${BOARD} ${BOARD}`} focusable="false">
      {Array.from({ length: columns * rows }, (_, i) => <path key={i} d={piecePath(i % columns, Math.floor(i / columns), columns, rows)} />)}
    </svg>
    <span className="gc-level-badge">{number}</span>
  </span>;
}
