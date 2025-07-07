"use client";

import { useEffect, useState } from "react";
import { UpdateNotification } from "./UpdateNotification";
import {
  getAppVersion,
  logVersionInfo,
  formatVersion,
  CACHE_CONFIG,
} from "@/lib/version";

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);
  const [currentVersion, setCurrentVersion] = useState<string>("");
  const [newVersion, setNewVersion] = useState<string>("");

  useEffect(() => {
    // Log version info in development
    logVersionInfo();
    setCurrentVersion(getAppVersion());

    // Register service worker with enhanced update detection
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("Service Worker registered with scope:", reg.scope);
          setRegistration(reg);

          // Check for updates on registration
          checkForUpdates(reg);

          // Set up update detection
          reg.addEventListener("updatefound", () => {
            console.log("New service worker found");
            const newWorker = reg.installing;

            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  console.log("New content is available");
                  setUpdateAvailable(true);
                  setShowUpdatePrompt(true);
                }
              });
            }
          });

          // Listen for messages from service worker
          navigator.serviceWorker.addEventListener("message", (event) => {
            if (event.data && event.data.type === "SW_UPDATED") {
              console.log(
                "Service worker updated to version:",
                event.data.version
              );
              setNewVersion(event.data.version);
              setUpdateAvailable(true);
              setShowUpdatePrompt(true);
            }
          });

          // Check for updates periodically
          const updateInterval = setInterval(() => {
            checkForUpdates(reg);
          }, CACHE_CONFIG.UPDATE_CHECK_INTERVAL);

          return () => clearInterval(updateInterval);
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
      console.log("PWA install prompt available");
    };

    const handleAppInstalled = () => {
      console.log("PWA was installed");
      deferredPrompt = null;
    };

    // Handle page visibility changes to check for updates
    const handleVisibilityChange = () => {
      if (!document.hidden && registration) {
        // Delay the update check slightly to avoid performance issues
        setTimeout(() => {
          checkForUpdates(registration);
        }, CACHE_CONFIG.VISIBILITY_CHECK_DELAY);
      }
    };

    // Handle online/offline events
    const handleOnline = () => {
      console.log("App is back online");
      if (registration) {
        checkForUpdates(registration);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", handleOnline);
    };
  }, [registration]);

  const checkForUpdates = async (reg: ServiceWorkerRegistration) => {
    try {
      await reg.update();
      console.log("Checked for service worker updates");
    } catch (error) {
      console.error("Failed to check for updates:", error);
    }
  };

  const applyUpdate = async () => {
    try {
      if (registration && registration.waiting) {
        // Tell the waiting service worker to skip waiting
        registration.waiting.postMessage({ type: "SKIP_WAITING" });

        // Wait a moment for the service worker to activate
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Reload the page to apply the update
      window.location.reload();
    } catch (error) {
      console.error("Error applying update:", error);
      // Fallback: just reload
      window.location.reload();
    }
  };

  const dismissUpdate = () => {
    setShowUpdatePrompt(false);

    // Store dismissal in sessionStorage to avoid showing again in this session
    try {
      sessionStorage.setItem("updateDismissed", currentVersion);
    } catch (error) {
      console.warn("Could not store update dismissal:", error);
    }
  };

  // Check if update was already dismissed in this session
  useEffect(() => {
    if (updateAvailable) {
      try {
        const dismissed = sessionStorage.getItem("updateDismissed");
        if (dismissed === currentVersion) {
          setShowUpdatePrompt(false);
        }
      } catch (error) {
        console.warn("Could not check update dismissal:", error);
      }
    }
  }, [updateAvailable, currentVersion]);

  return (
    <>
      {children}

      <UpdateNotification
        show={showUpdatePrompt}
        onUpdate={applyUpdate}
        onDismiss={dismissUpdate}
        version={newVersion ? formatVersion(newVersion) : undefined}
      />
    </>
  );
}
