import PathTrackerClient from './page-client';

interface Props {
  params: { locale: string };
}

// This is a server component that wraps the client component
// It ensures translations are properly loaded before rendering
export default function PathTrackerPage({ params: { locale } }: Props) {
  // The locale is automatically available to client components through the NextIntlClientProvider
  // in the layout, so we don't need to pass it as a prop
  return <PathTrackerClient />;
}