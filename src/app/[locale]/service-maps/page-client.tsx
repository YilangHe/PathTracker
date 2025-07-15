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
            <h2 className="text-xl font-semibold">About PATH Service Maps</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <h3 className="font-medium mb-2">{t("weekdays")}</h3>
                <p className="text-muted-foreground">
                  Regular service Monday through Friday, typically 6:00 AM to
                  10:00 PM
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">{t("weeknights")}</h3>
                <p className="text-muted-foreground">
                  Late night service Monday through Friday, typically 10:00 PM
                  to 6:00 AM
                </p>
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <h3 className="font-medium mb-2">{t("weekends")}</h3>
                <p className="text-muted-foreground">
                  Saturday and Sunday service with modified schedules and routes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
