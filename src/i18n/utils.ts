import de from './de';
import en from './en';

export type Lang = 'de' | 'en';

const translations = { de, en } as const;

type DeTranslations = typeof de;
type EnTranslations = typeof en;
type AllKeys = keyof DeTranslations | keyof EnTranslations;

/**
 * Returns a translation lookup function for the given language.
 * Falls back to the key name if the translation is missing.
 */
export function useTranslations(lang: Lang) {
  return function t(key: AllKeys): string {
    const dict = translations[lang] as Record<string, string>;
    return dict[key] ?? key;
  };
}
