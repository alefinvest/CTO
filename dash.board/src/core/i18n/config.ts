export const defaultLocale = 'en';

export const timeZone = 'Europe/Amsterdam';

export const locales = [defaultLocale,'uk', 'ru'] as const;

export const localesMap = [
  { key: 'en', title: 'English' },
  { key: 'uk', title: 'Українська' },
  { key: 'ru', title: 'Русский' },
];
