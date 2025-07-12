import { getTranslations } from 'next-intl/server';
import PathTrackerClient from './page-client';

export default async function PathTrackerPage() {
  // Pre-load translations on the server
  const t = await getTranslations();
  
  // Pass initial translations as props if needed, or just render the client component
  // The NextIntlClientProvider in the layout will provide translations to client components
  return <PathTrackerClient />;
}