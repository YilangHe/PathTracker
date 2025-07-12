import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import Link from "next/link";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale });
  
  return {
    title: `${t('addToHomeScreen.title')} - Path Tracker`,
    description: t('addToHomeScreen.description'),
    alternates: {
      canonical: `/${locale}/add-to-home-screen`,
      languages: {
        'en': '/en/add-to-home-screen',
        'zh': '/zh/add-to-home-screen',
        'es': '/es/add-to-home-screen',
      },
    },
    openGraph: {
      title: t('addToHomeScreen.title'),
      description: t('addToHomeScreen.description'),
      url: `https://www.livepathtracker.com/${locale}/add-to-home-screen`,
      images: [
        {
          url: "/AddToHomeScreenInstructions/step_1.jpg",
          width: 250,
          height: 400,
          alt: "Add to Home Screen Instructions",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t('addToHomeScreen.title'),
      description: t('addToHomeScreen.description'),
      images: ["/AddToHomeScreenInstructions/step_1.jpg"],
    },
  };
}

export default async function AddToHomeScreenPage({ params: { locale } }: Props) {
  const t = await getTranslations({ locale });
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: t('addToHomeScreen.title'),
            description: t('addToHomeScreen.description'),
            image:
              "https://www.livepathtracker.com/AddToHomeScreenInstructions/step_1.jpg",
            totalTime: "PT2M",
            estimatedCost: {
              "@type": "MonetaryAmount",
              currency: "USD",
              value: "0",
            },
            tool: [
              {
                "@type": "HowToTool",
                name: "Mobile web browser (Safari, Chrome, Firefox)",
              },
            ],
            step: [
              {
                "@type": "HowToStep",
                name: t('addToHomeScreen.step1'),
                text: "While viewing Path Tracker in your browser, tap the share button at the bottom of your screen (Safari) or in the browser menu.",
                image:
                  "https://www.livepathtracker.com/AddToHomeScreenInstructions/step_1.jpg",
              },
              {
                "@type": "HowToStep",
                name: t('addToHomeScreen.step2'),
                text: "Look for the 'Add to Home Screen' option in the share menu. You may need to scroll down to find it.",
                image:
                  "https://www.livepathtracker.com/AddToHomeScreenInstructions/step_2.jpg",
              },
              {
                "@type": "HowToStep",
                name: t('addToHomeScreen.step3'),
                text: "Tap 'Add to Home Screen' and then confirm by tapping 'Add' in the popup dialog. The app will now appear on your home screen!",
                image:
                  "https://www.livepathtracker.com/AddToHomeScreenInstructions/step_3.jpg",
              },
            ],
          }),
        }}
      />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          {t('addToHomeScreen.title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('addToHomeScreen.description')}
        </p>
      </div>

      <div className="space-y-8">
        {/* Step 1 */}
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  {t('addToHomeScreen.step1')}
                </h2>
              </div>
              <p className="text-muted-foreground pl-13">
                {t('addToHomeScreen.step1Desc')}
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-[250px] h-[400px] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/AddToHomeScreenInstructions/step_1.jpg"
                  alt={t('addToHomeScreen.step1')}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 250px"
                  priority
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Step 2 */}
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  {t('addToHomeScreen.step2')}
                </h2>
              </div>
              <p className="text-muted-foreground pl-13">
                {t('addToHomeScreen.step2Desc')}
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-[250px] h-[400px] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/AddToHomeScreenInstructions/step_2.jpg"
                  alt={t('addToHomeScreen.step2')}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 250px"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Step 3 */}
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  {t('addToHomeScreen.step3')}
                </h2>
              </div>
              <p className="text-muted-foreground pl-13">
                {t('addToHomeScreen.step3Desc')}
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-[250px] h-[400px] rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/AddToHomeScreenInstructions/step_3.jpg"
                  alt={t('addToHomeScreen.step3')}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 250px"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Benefits */}
      <div className="mt-12 bg-muted/30 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          {t('addToHomeScreen.whyAdd')}
        </h2>
        <ul className="space-y-3 text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">✓</span>
            <span>{t('addToHomeScreen.benefit1')}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">✓</span>
            <span>{t('addToHomeScreen.benefit2')}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">✓</span>
            <span>{t('addToHomeScreen.benefit3')}</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">✓</span>
            <span>{t('addToHomeScreen.benefit4')}</span>
          </li>
        </ul>
      </div>

      {/* Back to Home */}
      <div className="text-center mt-12">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          {t('addToHomeScreen.backToTracker')}
        </Link>
      </div>
    </div>
  );
}