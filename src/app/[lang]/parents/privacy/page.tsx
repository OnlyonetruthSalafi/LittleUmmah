import type { Locale, Text } from '@/i18n/config';
import { pageMetadata } from '@/lib/seo';
import { ParentPage, Copy } from '../ParentPage';
import { P, STORAGE_ROWS } from '../pages-content';
import { SECTIONS } from '../content';
import { ClearProgress } from '../ClearProgress';
type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return pageMetadata(lang as Locale, '/parents/privacy', P.privacy[lang as Locale], P.privacySummary2[lang as Locale]);
}
export default async function Page({ params }: Props) {
  const { lang: value } = await params; const lang = value as Locale;
  const privacy = SECTIONS.find(section => section.title.en === 'Privacy')!;
  const section = (title: Text, paragraphs: Text[]) => <section className="mt-8"><h2 className="text-xl font-bold"><Copy text={title} lang={lang} /></h2>{paragraphs.map((text, index) => <p key={index} className="mt-3 leading-relaxed"><Copy text={text} lang={lang} /></p>)}</section>;
  return <ParentPage title={P.privacy} lang={lang}>
    <p><Copy text={P.updated} lang={lang} /></p>
    {section(P.notDone, [privacy.body[1], privacy.body[2]])}
    {section(P.stored, [privacy.body[0], privacy.body[3]])}
    {[false, true].map(session => <div key={String(session)} className="mt-5">
      {session && <h3 className="mb-3 font-bold"><Copy text={P.temporary} lang={lang} /></h3>}
      <table className="w-full table-fixed text-left text-sm"><thead><tr><th scope="col" className="w-2/5 p-2"><Copy text={P.key} lang={lang} /></th><th scope="col" className="p-2"><Copy text={P.meaning} lang={lang} /></th></tr></thead><tbody>{STORAGE_ROWS.filter(row => !!row.session === session).map(row => <tr key={row.key} className="border-t border-ink/20"><th scope="row" className="p-2 align-top font-mono font-normal [overflow-wrap:anywhere]">{row.key}</th><td className="p-2 align-top"><Copy text={row.text} lang={lang} /></td></tr>)}</tbody></table>
    </div>)}
    {section(P.technical, [P.host, privacy.body[4]])}
    {section(P.speech, [P.speechBody])}
    {section(P.erase, [P.eraseBody])}
    <ClearProgress />
  </ParentPage>;
}
