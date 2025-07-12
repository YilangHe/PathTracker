'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales, localeNames, localeFlags } from '@/config/i18n';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    // Get the current pathname segments
    const segments = pathname.split('/').filter(Boolean);
    
    // Remove the locale segment if it exists
    if (locales.includes(segments[0] as any)) {
      segments.shift();
    }
    
    // Build the new path with the new locale
    const newPath = `/${newLocale}${segments.length > 0 ? '/' + segments.join('/') : ''}`;
    router.push(newPath);
  };

  return (
    <Select value={locale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="w-auto min-w-[50px] h-9 px-2 sm:px-3">
        <span className="text-lg">{localeFlags[locale as keyof typeof localeFlags]}</span>
        <span className="hidden sm:inline ml-2">{localeNames[locale as keyof typeof localeNames]}</span>
      </SelectTrigger>
      <SelectContent>
        {locales.map((loc) => (
          <SelectItem key={loc} value={loc} className="flex items-center">
            <span className="text-lg mr-2">{localeFlags[loc]}</span>
            <span>{localeNames[loc]}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}