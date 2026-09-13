import { GameImage as Image } from './GameImage';
import { Thumbnail } from './Artwork';
import { gameAssets, type GameDefinition } from '../data/catalog';
import { gamePresentation } from '../data/presentation';

export function GameIntro({ game, level, onLevel, onStart }: {
  game: GameDefinition; level: number; onLevel: (level: number) => void; onStart: () => void;
}) {
  const theme = gamePresentation[game.slug];
  const levels = theme.levels.slice(0, theme.levelCount ?? 3);
  const tapGame = game.slug === 'memory' || game.slug === 'find-object';
  return <section className="gc-adventure-intro" aria-labelledby="gc-adventure-title">
    <div className="gc-adventure-scene">
      <div className="gc-adventure-aura" aria-hidden="true" />
      <div className="gc-adventure-island"><Thumbnail slug={game.slug} large /></div>
      <Image src={gameAssets.guide} width={160} height={190} alt="" className="gc-adventure-robot" />
      <div className="gc-adventure-sign"><span>{theme.world.th}</span><small lang="en">{theme.world.en}</small></div>
    </div>
    <div className="gc-adventure-menu">
      <p className="gc-adventure-kicker">พร้อมออกผจญภัยไหม? <span lang="en">Ready to explore?</span></p>
      <h2 id="gc-adventure-title">{game.instruction.th}</h2>
      <p className="gc-adventure-description">{theme.description.th}<small lang="en">{theme.description.en}</small></p>
      {levels.length > 1 && <fieldset className="gc-level-path">
        <legend>เลือกด่านของเรา <small lang="en">Choose your adventure</small></legend>
        <div className="gc-level-stones">{levels.map((label, i) => <button type="button" key={label.en} className="gc-level-stone" aria-pressed={level === i + 1} onClick={() => onLevel(i + 1)}>
          <span className="gc-level-number" aria-hidden="true">{i + 1}</span>
          <span className="sr-only">ด่าน {i + 1}: </span><strong>{label.th}</strong><small lang="en">{label.en}</small>
          <span className="gc-level-selected" aria-hidden="true">{level === i + 1 ? '✓' : '·'}</span>
        </button>)}</div>
      </fieldset>}
      <button className="gc-button gc-primary gc-adventure-start" onClick={onStart}>ไปเล่นกันเลย! <small lang="en">Let’s play →</small></button>
      <p className="gc-how-to">{tapGame ? 'แตะภาพเพื่อเล่น' : 'แตะชิ้น → แตะช่อง หรือลากไปวาง'}<small lang="en">{tapGame ? 'Tap a picture to play' : 'Tap a piece, then its home — or drag it there'}</small></p>
    </div>
  </section>;
}
