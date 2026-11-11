import Image from 'next/image';
import type { Locale } from '@/i18n/config';
import { pageMetadata } from '@/lib/seo';
import { LocaleLink as Link } from '@/i18n/LocaleProvider';
import { ParentPage, Copy } from '../ParentPage';
import { P } from '../pages-content';
type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return pageMetadata(lang as Locale, '/parents/sponsors', P.sponsors[lang as Locale], P.thanks[lang as Locale]);
}
export default async function Page({ params }: Props) {
  const { lang: value } = await params; const lang = value as Locale;
  return <ParentPage title={P.sponsors} lang={lang}>
    <Image src="/sponsors/shuhada.webp" alt="" width={160} height={100} className="my-6 h-24 w-40 object-contain" />
    <p className="leading-relaxed"><Copy text={P.thanks} lang={lang} /></p>
    <section className="mt-8"><h2 className="text-xl font-bold"><Copy text={P.principles} lang={lang} /></h2><p className="mt-3 leading-relaxed"><Copy text={P.principlesBody} lang={lang} /></p></section>
    <Link href="/parents/privacy" className="ui-pill mt-6"><span><Copy text={P.privacy} lang={lang} /></span></Link>
  </ParentPage>;
}
