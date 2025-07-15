import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ServiceMapsPageClient } from "./page-client";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "serviceMaps" });

  return {
    title: `${t("title")} - PATH Train Tracker`,
    description: t("description"),
    keywords: [
      "PATH service maps",
      "PATH train map",
      "PATH system map",
      "New York PATH map",
      "New Jersey PATH map",
      "PATH weekdays map",
      "PATH weekends map",
      "PATH schedule map",
      "public transportation map",
    ],
  };
}

export default function ServiceMapsPage({ params: { locale } }: Props) {
  return <ServiceMapsPageClient />;
}
