"use client";

import { useTranslations } from "next-intl";
import { ServiceMapsViewer } from "@/components/ServiceMapsViewer";

export function ServiceMapsPageClient() {
  const t = useTranslations("serviceMaps");

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>

          {/* Service Maps Viewer */}
          <ServiceMapsViewer />

          {/* Additional Information */}
          <div className="bg-muted/50 rounded-lg p-4 sm:p-6 space-y-4">
            <h2 className="text-xl font-semibold">{t("aboutTitle")}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <h3 className="font-medium mb-2">{t("weekdays")}</h3>
                <p className="text-muted-foreground">{t("weekdaysDesc")}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">{t("weeknights")}</h3>
                <p className="text-muted-foreground">{t("weeknightsDesc")}</p>
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <h3 className="font-medium mb-2">{t("weekends")}</h3>
                <p className="text-muted-foreground">{t("weekendsDesc")}</p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-6 space-y-3">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
              {t("disclaimerTitle")}
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
              {t("disclaimerText")}
            </p>
            <div className="pt-2">
              <a
                href="https://www.panynj.gov/path/en/schedules-maps.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                {t("officialSource")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
