import type { ReactNode } from 'react';
import type { Locale, Text } from '@/i18n/config';
import { PageShell } from '@/components/layout/PageShell';
import { BackLink } from '@/components/ui/BackLink';
import { LocaleLink as Link } from '@/i18n/LocaleProvider';
import { UI } from './content';
import { P } from './pages-content';

export function Copy({ text, lang }: { text: Text; lang: Locale }) {
  return <>{text[lang]}{lang === 'th' && <span lang="en" className="block text-sm font-normal">{text.en}</span>}</>;
}
export function ParentPage({ title, lang, children }: { title: Text; lang: Locale; children: ReactNode }) {
  return <PageShell><BackLink href="/parents" label={UI.title} />
    <article className="scene-copy shadow-soft rounded-card mx-auto mt-6 max-w-3xl p-5 text-ink sm:p-10" data-parent-page>
      <h1 className="font-display text-3xl font-bold"><Copy text={title} lang={lang} /></h1>
      <nav className="my-6 flex flex-wrap gap-3" aria-label={UI.title[lang]}>
        {(['curriculum', 'progress', 'privacy', 'sponsors'] as const).map(id => <Link key={id} href={`/parents/${id}`} aria-current={title === P[id] ? 'page' : undefined} className="ui-pill max-w-full"><span><Copy text={P[id]} lang={lang} /></span></Link>)}
      </nav>
      {children}
    </article>
  </PageShell>;
}
