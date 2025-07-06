import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PWAProvider } from "@/components/PWAProvider";
import { OpenPanelComponent } from "@openpanel/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Path Tracker",
  description: "Real-time PATH train arrivals tracker",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: [
    "PATH",
    "train",
    "arrivals",
    "real-time",
    "tracker",
    "NJ Transit",
    "New York",
    "New Jersey",
  ],
  authors: [{ name: "Path Tracker Team" }],
  creator: "Path Tracker Team",
  publisher: "Path Tracker",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://path-tracker.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Path Tracker",
    description: "Real-time PATH train arrivals tracker",
    url: "https://path-tracker.vercel.app",
    siteName: "Path Tracker",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Path Tracker Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Path Tracker",
    description: "Real-time PATH train arrivals tracker",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#2563eb",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Path Tracker",
    startupImage: [
      {
        url: "/logo.png",
        media:
          "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Path Tracker",
    "application-name": "Path Tracker",
    "msapplication-TileColor": "#2563eb",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#2563eb",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Path Tracker" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Path Tracker" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <PWAProvider>
          <OpenPanelComponent
            clientId={process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID!}
            trackScreenViews={true}
            trackOutgoingLinks={true}
            trackAttributes={true}
          />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </PWAProvider>
      </body>
    </html>
  );
}
