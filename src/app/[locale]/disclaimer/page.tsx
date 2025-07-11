import Link from "next/link";
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale });
  
  return {
    title: `${t('disclaimer.title')} - Path Tracker`,
    description: t('disclaimer.title'),
    alternates: {
      canonical: `/${locale}/disclaimer`,
      languages: {
        'en': '/en/disclaimer',
        'zh': '/zh/disclaimer',
        'es': '/es/disclaimer',
      },
    },
    openGraph: {
      title: `${t('disclaimer.title')} - Path Tracker`,
      description: t('disclaimer.title'),
      url: `https://www.livepathtracker.com/${locale}/disclaimer`,
    },
    twitter: {
      card: "summary",
      title: `${t('disclaimer.title')} - Path Tracker`,
      description: t('disclaimer.title'),
    },
  };
}

export default async function DisclaimerPage({ params: { locale } }: Props) {
  const t = await getTranslations({ locale });
  
  return (
    <div className="mx-auto max-w-4xl p-4 space-y-6">
      <div className="max-w-3xl mx-auto py-8">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center text-primary hover:text-primary/80 mb-6 transition-colors"
        >
          ← Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-center mb-8 text-foreground">
          {t('disclaimer.title')}
        </h1>

        <div className="prose prose-lg max-w-none space-y-6">
          <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg dark:bg-primary/10">
            <h2 className="text-xl font-semibold text-primary mb-4">
              {t('disclaimer.importantNotice')}
            </h2>
            <p className="text-foreground leading-relaxed">
              {t('disclaimer.independentPlatform')}
            </p>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg dark:bg-amber-950/20 dark:border-amber-400">
            <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-4">
              {t('disclaimer.accuracyTitle')}
            </h2>
            <p className="text-foreground leading-relaxed">
              While every effort is made to ensure the accuracy of the
              information provided on Path Tracker, schedules and updates are
              subject to change, and real-time data may vary. Users are
              encouraged to verify critical travel details through official
              sources and use Path Tracker as a complementary tool for trip
              planning.
            </p>
          </div>

          <div className="bg-muted/30 border-l-4 border-muted-foreground/50 p-6 rounded-r-lg">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              {t('disclaimer.officialResources')}
            </h2>
            <p className="text-foreground leading-relaxed mb-4">
              {t('disclaimer.officialInfo')}
            </p>
            <ul className="space-y-2 text-foreground">
              <li>
                •{" "}
                <a
                  href="https://www.panynj.gov/path"
                  className="text-primary hover:text-primary/80 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Official PATH Website
                </a>
              </li>
              <li>
                •{" "}
                <a
                  href="https://www.panynj.gov/path/en/schedules-maps.html"
                  className="text-primary hover:text-primary/80 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  PATH Schedules and Maps
                </a>
              </li>
              <li>• Official PATH mobile app</li>
              <li>• Station announcements and displays</li>
            </ul>
          </div>

          <div className="text-center pt-8">
            <p className="text-sm text-muted-foreground">
              {t('disclaimer.lastUpdated')} {new Date().toLocaleDateString(locale === 'zh' ? 'zh-CN' : locale === 'es' ? 'es-ES' : 'en-US')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}