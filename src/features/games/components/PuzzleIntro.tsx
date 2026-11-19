import { useLayoutEffect, useRef } from 'react';
import { useDict } from '@/i18n/LocaleProvider';
import { SpeakerIcon } from '@/components/icons/SpeakerIcon';
import { gameAssets } from '../data/catalog';
import { gamePresentation } from '../data/presentation';
import { BOARD, PUZZLE_ISLAND, TRAY, homography, piecePath, trayMatrix } from '../data/puzzleArt';
import { PUZZLE_CHOOSE, PUZZLE_PICTURES, puzzlePicture } from '../data/puzzlePictures';
import { GameImage } from './GameImage';

const camera = homography(TRAY);
const pieceCount = { th: 'จำนวนชิ้น', en: 'Pieces' };
const crescentTitle = { th: 'จันทร์เสี้ยวเหนือโดมฟ้า', en: 'Crescent over the blue dome' };
const play = { th: 'เล่น', en: 'Play' };

export function PuzzleIntro({ level, pictureId, onLevel, onPicture, onStart, onListen, soundOn }: {
  level: number; pictureId?: string; onLevel: (level: number) => void; onPicture?: (id: string) => void;
  onStart: () => void; onListen: () => void; soundOn: boolean;
}) {
  const { t, sub, pick, pickSub } = useDict();
  const theme = gamePresentation.puzzle;
  const art = theme.levelArt![level - 1];
  const picture = puzzlePicture(pictureId);
  const name = picture.src ? picture.label : art.label;
  const caption = !picture.src && level === 1 ? crescentTitle : name;
  const island = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = island.current;
    if (!element) return;
    const sizePreview = (width: number) => {
      if (width > 0) element.style.setProperty('--pz-preview-camera', trayMatrix(camera, width, width));
    };
    sizePreview(element.clientWidth);
    const observer = new ResizeObserver(([entry]) => sizePreview(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const guide = <GameImage src={gameAssets.guide} alt="" width={130} height={150} sizes="(max-width: 640px) 76px, 110px" />;
  return <section className="pz-studio" aria-labelledby="pz-choose">
    <p className="sr-only">{pick(theme.world)}. {pick(theme.description)}. {t.games.intro.drag}</p>
    <figure className="pz-preview">
      <div className="pz-preview-stage">
        <div className="pz-preview-window">
          <div className="pz-preview-island" ref={island}>
            <GameImage {...PUZZLE_ISLAND} className="pz-preview-base" alt="" loading="eager" fetchPriority="high" sizes="(orientation: portrait) 105vw, 56vw" />
            <div className="pz-preview-surface">
              <GameImage src={picture.src ?? art.src} alt={pick(name)} width={800} height={800} unoptimized loading="eager" />
              <svg viewBox={`0 0 ${BOARD} ${BOARD}`} aria-hidden="true" focusable="false">
                {Array.from({ length: art.columns * art.rows }, (_, i) =>
                  <path key={i} d={piecePath(i % art.columns, Math.floor(i / art.columns), art.columns, art.rows)} />)}
              </svg>
            </div>
          </div>
        </div>
        {soundOn ? <button type="button" className="pz-preview-guide" aria-label={t.games.intro.listen} onClick={onListen}>
          {guide}<span aria-hidden="true"><SpeakerIcon /></span>
        </button> : <div className="pz-preview-guide">{guide}</div>}
      </div>
      <figcaption aria-live="polite" aria-atomic="true">
        <strong>{pick(caption)}</strong>{sub && <small lang="en">{pickSub(caption)}</small>}
      </figcaption>
    </figure>

    <div className="pz-studio-controls">
      <div className="pz-gallery" role="group" aria-labelledby="pz-choose">
        <h2 id="pz-choose">{pick(PUZZLE_CHOOSE)}{sub && <small lang="en">{pickSub(PUZZLE_CHOOSE)}</small>}</h2>
        <div className="pz-gallery-rail">{PUZZLE_PICTURES.map(option =>
          <button type="button" key={option.id} data-picture-id={option.id} aria-pressed={picture.id === option.id}
            aria-label={pick(option.label)} title={pick(option.label)} onClick={() => onPicture?.(option.id)}>
            <span className="pz-gallery-frame"><GameImage src={option.src ?? art.src} alt="" width={168} height={168} sizes="(max-width: 639px) 23vw, 112px" /></span>
            {picture.id === option.id && <span className="pz-gallery-check" aria-hidden="true">✓</span>}
          </button>)}</div>
      </div>
      <fieldset className="pz-difficulty">
        <legend>{pick(pieceCount)}{sub && <small lang="en">{pickSub(pieceCount)}</small>}</legend>
        <div>{theme.levels.map((label, i) =>
          <button type="button" key={i} data-puzzle-level={i + 1} aria-pressed={level === i + 1} onClick={() => onLevel(i + 1)}>
            {pick(label)}{sub && <small lang="en">{pickSub(label)}</small>}
          </button>)}</div>
      </fieldset>
      <button type="button" className="pz-studio-start" aria-label={t.games.intro.play} onClick={onStart}>
        <span className="pz-start-arrow" aria-hidden="true" />
        <span className="pz-start-label">{t.games.intro.play}{sub && <small lang="en">{sub.games.intro.play}</small>}</span>
        <span className="pz-start-short">{pick(play)}{sub && <small lang="en">{pickSub(play)}</small>}</span>
      </button>
    </div>
  </section>;
}
