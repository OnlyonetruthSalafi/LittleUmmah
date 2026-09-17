import { GameImage as Image } from './GameImage';
import { GameIcon } from '@/components/icons/GameIcon';
import { GameShape } from '@/components/icons/GameShape';
import type { GameIconName } from '@/lib/games';
import { gameAssets, type GameSlug } from '../data/catalog';
import { type Visual } from '../data/content';

const objectImages = new Set(['moon', 'sparkle', 'mushaf', 'lantern', 'jug', 'mat', 'letters', 'maze']);

export function ObjectArt({ visual, recessed = false }: { visual: Visual; recessed?: boolean }) {
  if (visual.kind === 'text') return <span className="gc-letter" lang={/[\u0600-\u06ff]/.test(visual.value) ? 'ar' : undefined} dir="auto">{visual.value}</span>;
  if (visual.kind === 'piece') {
    const columns = visual.columns ?? 2, rows = visual.rows ?? 2, index = visual.index ?? 0;
    return <span className="gc-piece" style={{ backgroundImage: `url(${gameAssets.puzzle})`, backgroundSize: `${columns * 100}% ${rows * 100}%`, backgroundPosition: `${(index % columns) * 100 / (columns - 1)}% ${Math.floor(index / columns) * 100 / (rows - 1)}%` }} />;
  }
  return <span className={`gc-object ${visual.kind === 'icon' ? 'gc-object-raster' : ''}`} style={visual.size ? { width: `${visual.size * 100}%` } : undefined} aria-hidden="true">{visual.kind === 'shape' ? <GameShape shape={visual.value} color={visual.color} recessed={recessed} /> : objectImages.has(visual.value) ? <><Image src={`/games/common/objects/${visual.value}.webp`} alt="" width={256} height={256} sizes="(max-width: 639px) 90px, 140px" draggable={false} />{visual.value === 'letters' && <span className="gc-object-arabic" lang="ar" dir="rtl">ا</span>}</> : <GameIcon name={visual.value as GameIconName | 'sparkle'} />}</span>;
}

export function Thumbnail({ slug, large = false }: { slug: GameSlug; large?: boolean }) {
  return <div className="gc-diorama" aria-hidden="true">
    <Image src={`/games/hub/${slug}.webp`} alt="" fill sizes={large ? '(max-width: 639px) 85vw, 480px' : '(max-width: 639px) 46vw, (max-width: 1000px) 31vw, 290px'} preload={large} />
    {slug === 'arabic-match' && <span className="gc-art-letters" lang="ar" dir="rtl"><span>ا</span><span>ب</span><span>ت</span></span>}
  </div>;
}
