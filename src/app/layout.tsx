import { ReactNode } from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.livepathtracker.com"),
  title: "PATH Train Tracker - Real-time Arrivals for NYC & NJ",
  description: "Track real-time PATH train arrivals across New York and New Jersey. Monitor multiple stations, get live updates, and never miss your train. Free PATH tracker for commuters.",
  keywords: [
    "PATH train tracker",
    "real-time PATH arrivals",
    "NYC PATH train",
    "NJ PATH train",
    "train arrivals",
    "PATH system",
    "New York commuter",
    "New Jersey transit",
    "live train updates",
  ],
  authors: [{ name: "Path Tracker Team" }],
  creator: "Path Tracker Team",
  publisher: "Path Tracker",
  category: "Transportation",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
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
        <script
          defer
          data-domain="livepathtracker.com"
          src="https://plausible.io/js/script.js"
        ></script>
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>{children}</body>
    </html>
  );
}