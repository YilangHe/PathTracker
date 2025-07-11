import { getRequestConfig } from 'next-intl/server';
import { messages } from './messages';
import { locales } from '@/config/i18n';

export default getRequestConfig(async ({ locale }) => {
  // Ensure we have a valid locale, handling undefined case
  const validLocale = locale && locales.includes(locale as any) ? locale : 'en';
  
  return {
    locale: validLocale,
    messages: messages[validLocale as keyof typeof messages]
  };
});