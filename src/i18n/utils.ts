import de from './de'
import en from './en'

export type Lang = 'de' | 'en'
export const defaultLang: Lang = 'de'
export const locales: Lang[] = ['de', 'en']

const translations = { de, en } as const

type DeTranslations = typeof de
type EnTranslations = typeof en
export type AllKeys = keyof DeTranslations | keyof EnTranslations

/**
 * Returns a translation lookup function for the given language.
 * Falls back to the key name if the translation is missing.
 * Supports simple parameter interpolation like {param}.
 */
export function useTranslations(lang: Lang) {
  return function t(key: AllKeys, params?: Record<string, string | number>): string {
    const dict = translations[lang] as Record<string, string>
    let text = dict[key] ?? key

    if (params) {
      for (const [param, value] of Object.entries(params)) {
        text = text.replace(`{${param}}`, String(value))
      }
    }

    return text
  }
}

/**
 * Get the other locale for toggling.
 */
export function getOtherLocale(lang: Lang): Lang {
  return lang === 'de' ? 'en' : 'de'
}
