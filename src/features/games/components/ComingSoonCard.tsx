'use client';

import { useRef } from 'react';
import { LockIcon, ToyIcon } from '@/components/icons/ToyIcon';
import { fmt } from '@/i18n/dict';
import { useDict } from '@/i18n/LocaleProvider';
import type { ComingSoonGame } from '../data/comingSoon';

// เป็นปุ่มเปิด dialog ไม่ใช่ลิงก์ เกมนี้ยังไม่มีหน้า และไม่ขอเต็มจอ <dialog> ปิดด้วย Esc และคืนโฟกัสให้การ์ดเอง
export function ComingSoonCard({ game }: { game: ComingSoonGame }) {
  const { t, sub, pick, pickSub } = useDict();
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = `soon-${game.id}-title`;
  const label = fmt(t.games.hub.soonLabel, { name: pick(game.title) });
  return <li id={`age-soon-${game.id}`} data-age-game={game.ageGroup === "7+" ? "juniors" : game.ageGroup === "3–6" ? "kids" : "both"}>
    <button type="button" className="gh-card gh-card-soon" onClick={() => dialog.current?.showModal()}
      aria-label={sub ? `${label} / ${fmt(sub.games.hub.soonLabel, { name: pickSub(game.title)! })}` : label}>
      <div className="gh-card-art gh-soon-art"><ToyIcon id={game.id} className="gh-soon-toy" />
        <span className="gh-age">{game.ageGroup} {t.games.hub.ageUnit}{sub && <span lang="en"> / {sub.games.hub.ageUnit}</span>}</span>
      </div>
      <div className="gh-card-copy"><h3 className="gh-card-title">{pick(game.title)}</h3>
        {sub && <span className="gh-card-en" lang="en">{pickSub(game.title)}</span>}
      </div>
      <div className="gh-card-foot gh-soon-foot"><LockIcon className="gh-soon-lock" />
        <span>{t.games.hub.soon}{sub && <small lang="en">{sub.games.hub.soon}</small>}</span>
      </div>
    </button>
    <dialog ref={dialog} className="gh-soon-dialog" aria-labelledby={titleId}>
      <ToyIcon id={game.id} className="gh-soon-dialog-toy" />
      <h3 id={titleId}>{pick(game.title)}{sub && <small lang="en">{pickSub(game.title)}</small>}</h3>
      <p>{t.games.hub.soonBody}{sub && <small lang="en">{sub.games.hub.soonBody}</small>}</p>
      <p className="gh-soon-skill">{pick(game.skill)}{sub && <small lang="en">{pickSub(game.skill)}</small>}</p>
      <button type="button" className="gc-button gc-primary" onClick={() => dialog.current?.close()}>{t.games.hub.soonClose}{sub && <small lang="en">{sub.games.hub.soonClose}</small>}</button>
    </dialog>
  </li>;
}
