import { getTranslations } from 'next-intl/server';
import ClientTranslationTest from './client-test';

interface Props {
  params: { locale: string };
}

// Server component that loads translations
export default async function TestTranslationsPage({ params: { locale } }: Props) {
  const t = await getTranslations({ locale });
  
  return (
    <div className="mx-auto max-w-4xl p-8 space-y-8">
      <h1 className="text-3xl font-bold">Translation Test Page</h1>
      
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Server-side Translations</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg space-y-2">
          <p><strong>app.title:</strong> {t('app.title')}</p>
          <p><strong>app.description:</strong> {t('app.description')}</p>
          <p><strong>nav.features:</strong> {t('nav.features')}</p>
          <p><strong>home.realTimeArrivals:</strong> {t('home.realTimeArrivals')}</p>
        </div>
      </section>
      
      <ClientTranslationTest />
    </div>
  );
}