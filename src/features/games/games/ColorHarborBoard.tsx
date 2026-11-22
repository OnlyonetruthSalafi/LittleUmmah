'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { useDict } from '@/i18n/LocaleProvider';
import { GameImage } from '../components/GameImage';
import type { PlayProps } from '../components/GameShell';
import { boardContent } from '../data/content';
import { gamePresentation } from '../data/presentation';
import { shuffle } from '../engine/rules';

const marks: Record<string, string> = { red: '●', blue: '■', yellow: '★', green: '▲' };
const ARRIVAL_MS = 1150;

export default function ColorHarborBoard({ level, paused, onProgress, onFeedback, onResetFeedback, onComplete }: PlayProps) {
  const { pick, sub } = useDict();
  const [{ docks, boats }] = useState(() => {
    const { items, targets } = boardContent('color-match', level);
    return { docks: shuffle(targets), boats: shuffle(items) };
  });
  const [index, setIndex] = useState(0);
  const [sailing, setSailing] = useState(false);
  const [miss, setMiss] = useState('');
  const boat = boats[index];
  const destination = docks.findIndex(dock => dock.id === boat.target);
  const theme = gamePresentation['color-match'];
  const prompt = sailing ? { th: 'เรือเข้าท่าแล้ว!', en: 'Boat safely home!' }
    : miss ? { th: 'ลองดูสีใบเรืออีกทีนะ', en: 'Look at the sail again.' }
    : { th: 'แตะประภาคารสีเดียวกับใบเรือ', en: 'Tap the lighthouse that matches the sail.' };

  useEffect(() => { onProgress(index + Number(sailing), boats.length); }, [index, sailing, boats.length, onProgress]);
  useEffect(() => {
    if (!sailing || paused) return;
    const timer = setTimeout(() => {
      if (index + 1 === boats.length) onComplete();
      else {
        setIndex(index + 1);
        setSailing(false);
        onResetFeedback?.();
      }
    }, ARRIVAL_MS);
    return () => clearTimeout(timer);
  }, [sailing, paused, index, boats.length, onComplete, onResetFeedback]);

  function choose(id: string) {
    if (paused || sailing) return;
    const correct = id === boat.target;
    setMiss(correct ? '' : id);
    setSailing(correct);
    onFeedback(correct);
  }

  return <div className="harbor-bay" data-sailing={sailing} style={{ '--dock-count': docks.length } as CSSProperties}>
    <div className="harbor-call" role="status">
      <strong>{pick(prompt)}</strong>{sub && <small lang="en">{prompt.en}</small>}
    </div>
    <div className="harbor-docks" role="group" aria-label={pick(theme.destinations)}>
      {docks.map(dock => <button type="button" key={dock.id} className="harbor-dock"
        data-dock={dock.id} data-miss={miss === dock.id} aria-disabled={paused || sailing}
        aria-label={pick({ th: 'ประภาคารสี' + dock.label.th, en: dock.label.en + ' lighthouse' })}
        onClick={() => choose(dock.id)}>
        <GameImage src={'/games/color-match/dock-' + dock.id + '.webp'} width={400} height={400}
          alt="" draggable={false} unoptimized />
        <span className="harbor-tag"><i aria-hidden="true">{marks[dock.id]}</i> {pick(dock.label)}{sub && <small lang="en">{dock.label.en}</small>}</span>
      </button>)}
    </div>
    <div key={boat.id} className="harbor-vessel" data-sail={boat.target}
      style={{ '--arrival-x': ((destination + .5) * 100 / docks.length) + '%' } as CSSProperties}>
      <GameImage src={'/games/color-match/boat-' + boat.target + '.webp'} width={384} height={384}
        alt={pick({ th: 'เรือใบสี' + boat.label.th, en: boat.label.en + ' sailboat' })} unoptimized draggable={false} />
    </div>
    <div className="harbor-clue" aria-live="polite">
      <i aria-hidden="true">{marks[boat.target]}</i>
      <span>{pick({ th: theme.pieces.th + 'สี' + boat.label.th, en: boat.label.en + ' sail' })}
        {sub && <small lang="en">{boat.label.en} sail</small>}</span>
    </div>
  </div>;
}
