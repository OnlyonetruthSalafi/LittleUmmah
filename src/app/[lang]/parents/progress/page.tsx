import type { Locale } from '@/i18n/config';
import { pageMetadata } from '@/lib/seo';
import { getCurriculum } from '@/lib/parents-curriculum';
import { ParentPage, Copy } from '../ParentPage';
import { P } from '../pages-content';
import { ProgressPanel } from './ProgressPanel';
type Props = { params: Promise<{ lang: string }> };
export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  return pageMetadata(lang as Locale, '/parents/progress', P.progress[lang as Locale], P.progressIntro[lang as Locale]);
}
export default async function Page({ params }: Props) {
  const { lang } = await params;
  return <ParentPage title={P.progress} lang={lang as Locale}><p><Copy text={P.progressIntro} lang={lang as Locale} /></p><ProgressPanel curriculum={getCurriculum()} lang={lang as Locale} /></ParentPage>;
}
