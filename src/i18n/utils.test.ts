import { describe, it, expect } from 'vitest';
import { useTranslations } from './utils';

describe('useTranslations', () => {
  it('returns German strings for "de"', () => {
    const t = useTranslations('de');
    expect(t('site.title')).toBe('Siam IT – Freelancer Portfolio');
    expect(t('nav.home')).toBe('Startseite');
  });

  it('returns English strings for "en"', () => {
    const t = useTranslations('en');
    expect(t('site.title')).toBe('Siam IT – Freelancer Portfolio');
    expect(t('nav.home')).toBe('Home');
  });

  it('falls back to the key name for missing translations', () => {
    const t = useTranslations('de');
    expect(t('nonexistent.key' as any)).toBe('nonexistent.key');
  });
});
