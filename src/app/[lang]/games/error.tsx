'use client';
import { useDict } from '@/i18n/LocaleProvider';

import { BackLink } from '@/components/ui/BackLink';
export default function GameError({ reset }: { reset: () => void }) {
  const { t, sub } = useDict(); return <main className="gc-world gc-focus"><section className="gc-panel gc-intro"><h1>{t.games.error.title}</h1>{sub && <p lang="en">{sub.games.error.title}</p>}<button className="gc-button gc-primary" onClick={reset}>{t.games.error.retry} {sub && <small lang="en">{sub.games.error.retry}</small>}</button><BackLink href="/games" label={{ th: t.games.error.hub, en: sub?.games.error.hub ?? t.games.error.hub }} /></section></main>; }
