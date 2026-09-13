import { GameImage as Image } from './GameImage';
import Link from 'next/link';
import { games } from '../data/catalog';
import { HubGuide } from './HubGuide';
import { Thumbnail } from './Artwork';
import { HubProgress } from './HubProgress';
import { HubTileLink } from './HubTileLink';
import { ChevronsDownIcon } from '@/components/icons/ChevronsDownIcon';

export function GameHub() {
  return <main className="gc-world gc-hub">
    <div className="gc-world-backdrop" aria-hidden="true"><Image src="/games/hub/game-hub-bg.webp" alt="" fill sizes="100vw" preload /></div>
    <div className="gc-container">
      <nav className="gc-hub-nav" aria-label="นำทางเกม"><Link className="gc-button" href="/">← หน้าหลัก <small lang="en">Home</small></Link><span className="font-display text-xl font-bold">Little Ummah</span><HubProgress /></nav>
      <HubGuide />
      <section aria-labelledby="gc-choose">
        {/* หัวข้อเก็บไว้ให้ screen reader ส่วนบนจอใช้ลูกศรชี้ลงแทน เด็กที่ยังอ่านไม่ออกก็เข้าใจ */}
        <h2 id="gc-choose" className="sr-only">เลือกเกมกันเลย! / Choose your adventure</h2>
        <div className="gc-hub-cue" aria-hidden="true"><ChevronsDownIcon className="h-full w-full" /></div>
        <ul className="gc-grid">{games.filter(g => g.enabled).map((game, i) => <li key={game.slug}><HubTileLink href={`/games/${game.slug}`} slug={game.slug} nameTh={game.title.th} className={`gc-tile gc-${game.color} group`} style={{ animationDelay: `${i * 45}ms` }}><div className="gc-tile-art motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:scale-[1.03] motion-safe:group-active:scale-[0.98]"><Thumbnail slug={game.slug} /><span className="gc-play-mark" aria-hidden="true">▶</span></div><div className="gc-tile-label"><h3>{game.title.th}</h3><span lang="en">{game.title.en}</span></div></HubTileLink></li>)}</ul>
      </section>
      <p className="gc-hub-note">ค่อย ๆ ลอง เรียนรู้ได้ทุกครั้ง <span lang="en">Every little try is a little discovery.</span></p>
    </div>
  </main>;
}
