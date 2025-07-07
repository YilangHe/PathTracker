"use client";

import { useEffect } from "react";
import { isCrawlerCached } from "../utils/crawlerDetection";
import { useDailyCacheRefresh } from "../hooks/useDailyCacheRefresh";

export function PWAProvider({ children }: { children: React.ReactNode }) {
  // Initialize daily cache refresh functionality
  useDailyCacheRefresh();

  useEffect(() => {
    // Only run for real users, not during SSR or crawling
    if (isCrawlerCached()) return;

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.log("Service Worker registration failed:", error);
        });
    }

    // Handle install prompt
    let deferredPrompt: any;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      // You can show a custom install button here
      console.log("PWA install prompt available");
    };

    const handleAppInstalled = () => {
      console.log("PWA was installed");
      deferredPrompt = null;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  return <>{children}</>;
}
