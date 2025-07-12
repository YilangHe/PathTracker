'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useState } from 'react';

export default function ClientTranslationTest() {
  const t = useTranslations();
  const locale = useLocale();
  const [key, setKey] = useState('app.title');
  
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Client-side Translations</h2>
      
      <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
        <p className="font-semibold mb-2">Current Locale: {locale}</p>
      </div>
      
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg space-y-2">
        <p><strong>app.title:</strong> {t('app.title')}</p>
        <p><strong>app.description:</strong> {t('app.description')}</p>
        <p><strong>nav.features:</strong> {t('nav.features')}</p>
        <p><strong>home.realTimeArrivals:</strong> {t('home.realTimeArrivals')}</p>
      </div>
      
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold">Dynamic Translation Test</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            placeholder="Enter translation key (e.g., app.title)"
          />
        </div>
        <div className="p-3 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">
          <p><strong>Result:</strong> {key ? t(key) : 'Enter a key'}</p>
        </div>
      </div>
      
      <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">How to Test:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Visit /en/test-translations for English</li>
          <li>Visit /zh/test-translations for Chinese</li>
          <li>Visit /es/test-translations for Spanish</li>
          <li>Check if translations change based on URL locale</li>
        </ol>
      </div>
    </section>
  );
}