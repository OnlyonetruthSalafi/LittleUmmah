'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useDict } from '@/i18n/LocaleProvider';
import { GameCategoryIcon } from '@/components/icons/GameCategoryIcon';
import { ChevronRightIcon } from '@/components/icons/ChevronRightIcon';
import { useHeroGuide } from '@/features/moral/useHeroGuide';
import { afterScenePaint } from '@/components/performance/afterScenePaint';
import { HUB_INTRO, HUB_INTRO_TOUCH, type GameCategory } from '../data/hubCategories';

const noSubscribe = () => () => {};
// หุ่นขยายสูงสุดตอนทัวร์: มือถือ 88px × 1.3, แท็บเล็ต 104px × 1.6, จอใหญ่ 124px × 1.6 (games-hub.css)
const GUIDE_SIZES = '(max-width: 599px) 115px, (max-width: 1023px) 167px, 200px';

export function GamesHero({ categories }: { categories: GameCategory[] }) {
  const { t, sub, pick, pickSub } = useDict();
  // อ่านหลัง mount เท่านั้น HTML แรกบน server กับ client จึงตรงกัน
  const touch = useSyncExternalStore(noSubscribe, () => window.matchMedia('(pointer: coarse)').matches, () => false);
  const steps = useMemo(() => [touch ? HUB_INTRO_TOUCH : HUB_INTRO, ...categories.map(category => category.guide)], [touch, categories]);
  const { phase, step, current, pose, focus, touring, start, finish } = useHeroGuide({
    steps, seenKey: 'lu-games-guide-seen', stopSelector: '[data-game-link]',
  });
  const phone = touch && phase === 'tour' && step === 0;
  // ตอนเปิดหน้าเห็นแค่ท่ายืน ท่าโบกมือ/ชี้/ถือโทรศัพท์ใช้เฉพาะตอนทัวร์ จึงเริ่มโหลดหลังฉากแรกวาดแล้ว ไม่แย่งเน็ตกับภาพหลัก
  // useHeroGuide รอทุกเฟรมใน .gh-guide โหลดครบก่อนเริ่มทัวร์อยู่แล้ว
  const [poses, setPoses] = useState(false);
  useEffect(() => afterScenePaint(() => setPoses(true)), []);
  const replay = () => {
    if (touring) return finish();
    if (poses) return start();
    // แตะเร็วก่อนฉากพร้อม: ใส่เฟรมที่เหลือก่อน แล้วให้ start รอโหลดเอง
    setPoses(true);
    requestAnimationFrame(() => start());
  };
  return <header className="gh-hero" data-guide-active={touring || undefined}>
    <div className="gh-hero-copy">
      <h1 className="font-display">{t.games.hub.title}{sub && <span lang="en">{sub.games.hub.title}</span>}</h1>
      <p className="gh-intro">{t.games.hub.intro}{sub && <span lang="en">{sub.games.hub.intro}</span>}</p>
      <nav className="gh-category-jumps" aria-label={t.games.hub.chooseCategory}>
        {categories.map(category => <a key={category.id} href={`#${category.id}`} className={`gh-category-button gh-${category.theme}`} data-guided={focus === category.id || undefined}>
          <GameCategoryIcon name={category.icon} /><span>{pick(category.label)}{sub && <small lang="en">{pickSub(category.label)}</small>}</span><ChevronRightIcon className="gh-arrow" />
        </a>)}
      </nav>
    </div>
    <div className="gh-hero-scene">
      <Image className="gh-hero-island" src="/islands/games.webp" alt="" width={900} height={900} preload sizes="(max-width: 599px) 80vw, (max-width: 1023px) 360px, 460px" />
      <div className="gh-bubble" role="status" data-show={(phase === 'tour' && !!current) || undefined}>
        {phase === 'tour' && current && <><p>{pick(current)}</p>{sub && <p lang="en">{pickSub(current)}</p>}</>}
      </div>
      <button type="button" className="gh-guide" data-phase={phase} data-pose={pose} data-phone={phone || undefined}
        onClick={replay} aria-label={touring ? t.moral.hero.skipGuide : t.moral.hero.hearGuide}
        title={touring ? t.moral.hero.skip : t.moral.hero.hearAgain}>
        {(poses ? ['stand', 'wave-1', 'wave-2', 'point'] as const : ['stand'] as const).map(frame => <Image key={frame} src={`/moral/guide/${frame}.webp`}
          alt="" width={512} height={512} loading="eager" sizes={GUIDE_SIZES} className={`gh-guide-frame gh-guide-${frame}`} />)}
        {touch && poses && <>{(['phone-portrait', 'phone-landscape'] as const).map(frame => <Image key={frame} src={`/Character/greet/${frame}.webp`}
          alt="" width={640} height={640} loading="eager" sizes={GUIDE_SIZES} className={`gh-guide-frame gh-${frame}`} />)}</>}
      </button>
    </div>
  </header>;
}
