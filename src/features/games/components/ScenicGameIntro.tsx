import dynamic from 'next/dynamic';
import type { GameSlug } from '../data/catalog';
import { SpeakerIcon } from '@/components/icons/SpeakerIcon';
import { useDict } from '@/i18n/LocaleProvider';
import { gamePresentation } from '../data/presentation';
import { Thumbnail } from './Artwork';

const MarblePractice = dynamic(() => import('./MarblePractice'));

export function ScenicGameIntro({ slug, level, onLevel, onStart, onListen, soundOn, paused }: {
  paused: boolean;
  slug: GameSlug; level: number; onLevel: (level: number) => void; onStart: () => void; onListen: () => void; soundOn: boolean;
}) {
  const { t, sub, pick } = useDict();
  const { world, description, levels } = gamePresentation[slug];
  return <section className="harbor-intro" aria-labelledby="gc-adventure-title">
    <div className="harbor-preview">{slug === 'marble-run' ? <MarblePractice paused={paused}/> :
      <Thumbnail slug={slug} large sizes="(max-height: 520px) 28vw, 42vw"/>}</div>
    <div className="harbor-brief">
      <div className="harbor-copy"><h2 id="gc-adventure-title">{pick(world)}{sub && <small lang="en">{world.en}</small>}</h2>
      <p>{pick(description)}{sub && <small lang="en">{description.en}</small>}</p></div>
      <fieldset className="harbor-levels">
        <legend className="sr-only">{t.games.intro.choose}</legend>
        {levels.map((label, i) => <button type="button" key={i} aria-pressed={level === i + 1}
          className="harbor-level" onClick={() => onLevel(i + 1)}>
          {pick(label)}{sub && <small lang="en">{label.en}</small>}
        </button>)}
      </fieldset>
      <div className="harbor-actions">
        <button type="button" className="gc-button gc-primary harbor-start" onClick={() => onStart()}>
          {t.games.intro.play}{sub && <small lang="en">{sub.games.intro.play}</small>}
        </button>
        {soundOn && <button type="button" className="ui-round" aria-label={t.games.intro.listen} onClick={onListen}><SpeakerIcon /></button>}
      </div>
    </div>
  </section>;
}
