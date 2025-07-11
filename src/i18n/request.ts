import { getRequestConfig } from 'next-intl/server';
import { messages } from './messages';
import { locales } from '@/config/i18n';

export default getRequestConfig(async ({ locale }) => {
  // Ensure we have a valid locale
  const validLocale = locales.includes(locale as any) ? locale : 'en';
  
  return {
    locale: validLocale,
    messages: messages[validLocale as keyof typeof messages]
  };
});