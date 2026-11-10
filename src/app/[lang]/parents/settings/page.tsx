import { pageMetadata } from '@/lib/seo';
import { PageShell } from '@/components/layout/PageShell';
import { BackLink } from '@/components/ui/BackLink';
import type { Locale } from '@/i18n/config';
import { dict } from '@/i18n/dict';
import { LS } from '@/features/learning-stars/content';
import { SettingsPanel } from '@/features/learning-stars/SettingsPanel';
export async function generateMetadata({ params }: PageProps<'/[lang]/parents/settings'>) {
  const { lang } = await params; const d = dict(lang as Locale);
  return pageMetadata(lang as Locale, '/parents/settings', d.pick(LS.settings), d.t.seo.parentsDescription, 'welcome');
}
export default async function Page({ params }: PageProps<'/[lang]/parents/settings'>) {
  const { lang } = await params; const d = dict(lang as Locale);
  return <PageShell><BackLink href="/parents" label={LS.parents} /><article className="scene-copy shadow-soft rounded-card mx-auto mt-6 max-w-3xl p-5 sm:p-10"><h1 className="font-display text-3xl font-bold">{d.pick(LS.settings)}{d.pickSub(LS.settings) && <span lang="en" className="block text-lg font-semibold">{d.pickSub(LS.settings)}</span>}</h1><SettingsPanel  /></article></PageShell>;
}
