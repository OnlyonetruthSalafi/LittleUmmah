import type { Locale } from '@/i18n/config';
import { pageMetadata } from '@/lib/seo';
import { getCurriculum } from '@/lib/parents-curriculum';
import { LocaleLink as Link } from '@/i18n/LocaleProvider';
import { ParentPage, Copy } from '../ParentPage';
import { P } from '../pages-content';
import { UI } from '../content';
type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return pageMetadata(lang as Locale, '/parents/curriculum', P.curriculum[lang as Locale], P.curriculumIntro[lang as Locale]);
}
export default async function Page({ params }: Props) {
  const { lang: value } = await params; const lang = value as Locale;
  return <ParentPage title={P.curriculum} lang={lang}>
    <p className="leading-relaxed"><Copy text={P.curriculumIntro} lang={lang} /></p>
    {getCurriculum().map(({ age, islands }) => <section key={age} className="mt-8">
      <h2 className="font-display text-2xl font-bold"><Copy text={UI[age]} lang={lang} /></h2>
      {islands.map(island => <details key={island.slug} className="mt-4 rounded-2xl border border-ink/20 p-3" data-island={island.slug}>
        <summary className="min-h-12 cursor-pointer rounded-lg px-2 py-3 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand-blue">
          <h3 className="inline font-bold"><Copy text={island.title} lang={lang} /></h3>
          <span className="mt-1 block">{(['lessons', 'books', 'levels', 'pictures'] as const).filter(unit => island.items.some(item => item.unit === unit)).map(unit => <span key={unit} className="mr-3 inline-block">{island.items.filter(item => item.unit === unit).length} <Copy text={P[unit]} lang={lang} /></span>)}</span>
        </summary>
        <ul className="ml-5 list-disc space-y-3 py-4">{island.items.map(item => <li key={item.id}><Copy text={item.title} lang={lang} /></li>)}</ul>
        <Link href={island.href} className="ui-pill"><span><Copy text={P.open} lang={lang} /></span></Link>
      </details>)}
    </section>)}
  </ParentPage>;
}
