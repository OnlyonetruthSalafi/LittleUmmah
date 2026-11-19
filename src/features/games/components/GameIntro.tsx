import { useDict } from '@/i18n/LocaleProvider';
import { GameImage as Image } from './GameImage';
import { Thumbnail } from './Artwork';
import { gameAssets, type GameDefinition } from '../data/catalog';
import { gamePresentation } from '../data/presentation';
import { PuzzleIntro } from './PuzzleIntro';
import { SpeakerIcon } from '@/components/icons/SpeakerIcon';

/*
  หน้าเลือกด่าน — บนจอเหลือแค่สามอย่างที่เด็กต้องใช้: เล่นอะไร (หัวข้อ + ปุ่มฟัง) → ด่านไหน → ปุ่มเล่น
  คำอธิบาย คำชวน และวิธีเล่นย้ายไปอยู่ใน sr-only ให้เครื่องอ่านหน้าจอ เด็กที่ยังอ่านไม่ออกกดฟังเอาได้
  แนวเดียวกับ VoiceIntro ที่เจ้าของโปรเจกต์กำหนดให้ไม่แสดงคำสั่งเป็นตัวหนังสือ
*/
export function GameIntro({ game, level, onLevel, onStart, onListen, soundOn, pictureId, onPicture }: {
  pictureId?: string; onPicture?: (id: string) => void;
  game: GameDefinition; level: number; onLevel: (level: number) => void; onStart: () => void; onListen: () => void; soundOn: boolean;
}) {
  const { t, sub, pick, pickSub } = useDict();
  const theme = gamePresentation[game.slug];
  const levels = theme.levels.slice(0, theme.levelCount ?? 3);
  if (game.slug === 'puzzle') return <PuzzleIntro level={level} pictureId={pictureId} onPicture={onPicture}
    onLevel={onLevel} onStart={onStart} onListen={onListen} soundOn={soundOn} />;
  const tapGame = game.slug === 'memory' || game.slug === 'find-object';
  return <section className="gc-adventure-intro" aria-labelledby="gc-adventure-title">
    <div className="gc-adventure-scene">
      <div className="gc-adventure-aura" aria-hidden="true" />
      <div className="gc-adventure-island"><Thumbnail slug={game.slug} large sizes="(max-width: 639px) 180px, (max-width: 1023px) 47vw, (max-width: 1500px) 43vw, 660px" /></div>
      <Image src={gameAssets.guide} width={160} height={190} alt="" sizes="(max-width: 639px) 56px, (max-width: 1023px) 15vw, 205px" className="gc-adventure-robot" />
    </div>
    <div className="gc-adventure-menu">
      <div className="gc-adventure-heading">
        <h2 id="gc-adventure-title">{pick(game.instruction)}{sub && <span lang="en" className="sr-only"> ({pickSub(game.instruction)!})</span>}</h2>
        {/* ปิดเสียงเกมอยู่ ปุ่มฟังจะกดแล้วเงียบ จึงไม่แสดง — เปิดเสียงได้ที่ปุ่มลำโพงบนหัวเกม */}
        {soundOn && <button type="button" className="ui-round" onClick={onListen} aria-label={t.games.intro.listen}><SpeakerIcon /></button>}
      </div>
      <p className="sr-only">{pick(theme.world)}: {pick(theme.description)} {sub && <span lang="en">{pickSub(theme.description)!}</span>}</p>
      {levels.length > 1 && !theme.journey && <fieldset className="gc-level-path">
        <legend className="sr-only">{t.games.intro.choose} {sub && <span lang="en">{sub.games.intro.choose}</span>}</legend>
        <div className="gc-level-stones">{levels.map((label, i) => <button type="button" key={i} className="gc-level-stone" aria-pressed={level === i + 1} onClick={() => onLevel(i + 1)}>
          <span className="gc-level-number" aria-hidden="true">{i + 1}</span>
          <span className="sr-only">{t.games.intro.level} {i + 1}: </span><strong>{pick(label)}</strong>{sub && <span lang="en" className="sr-only"> ({pickSub(label)!})</span>}
          {level === i + 1 && <span className="gc-level-selected" aria-hidden="true">✓</span>}
        </button>)}</div>
      </fieldset>}
      <button className="gc-button gc-primary gc-adventure-start" onClick={onStart}>{t.games.intro.play} {sub && <small lang="en">{sub.games.intro.play}</small>}</button>
      {game.slug === 'light-maze'
        ? <p className="sr-only">{t.games.intro.mazeHelp} {sub && <span lang="en">{sub.games.intro.mazeHelp}</span>}</p>
        : <p className="sr-only">{tapGame ? t.games.intro.tap : t.games.intro.drag} {sub && <span lang="en">{tapGame ? sub.games.intro.tap : sub.games.intro.drag}</span>}</p>}
    </div>
  </section>;
}
