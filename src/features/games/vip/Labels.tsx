'use client';
import type { Text } from '@/i18n/config';
import { useLocale } from '@/i18n/LocaleProvider';
import styles from './vip.module.css';

export function Label({ text }: { text: Text }) {
  const lang = useLocale();
  return <span className={styles.label}>{text[lang]}{lang === 'th' && <small lang="en">{text.en}</small>}</span>;
}
