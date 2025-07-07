import { useEffect, useCallback } from "react";

const CACHE_REFRESH_KEY = "path-tracker-last-cache-refresh";
const CACHE_REFRESH_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function useDailyCacheRefresh() {
  const checkAndRefreshCache = useCallback(() => {
    // Don't run during SSR
    if (typeof window === "undefined") return;

    const lastRefresh = localStorage.getItem(CACHE_REFRESH_KEY);
    const now = Date.now();

    if (!lastRefresh || now - parseInt(lastRefresh) > CACHE_REFRESH_INTERVAL) {
      // Update the timestamp first to prevent multiple reloads
      localStorage.setItem(CACHE_REFRESH_KEY, now.toString());

      // Force cache refresh
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        // Send message to service worker to clear cache
        navigator.serviceWorker.controller.postMessage({
          type: "CLEAR_CACHE",
        });
      }

      // Hard reload to ensure fresh content
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, []);

  const forceCacheRefresh = useCallback(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem(CACHE_REFRESH_KEY, Date.now().toString());

    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "CLEAR_CACHE",
      });
    }

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }, []);

  const getLastRefreshTime = useCallback(() => {
    if (typeof window === "undefined") return null;

    const lastRefresh = localStorage.getItem(CACHE_REFRESH_KEY);
    return lastRefresh ? new Date(parseInt(lastRefresh)) : null;
  }, []);

  const getTimeUntilNextRefresh = useCallback(() => {
    if (typeof window === "undefined") return null;

    const lastRefresh = localStorage.getItem(CACHE_REFRESH_KEY);
    if (!lastRefresh) return 0;

    const nextRefresh = parseInt(lastRefresh) + CACHE_REFRESH_INTERVAL;
    const now = Date.now();

    return Math.max(0, nextRefresh - now);
  }, []);

  useEffect(() => {
    // Check cache on mount and set up periodic checks
    checkAndRefreshCache();

    // Set up a timer to check periodically (every hour)
    const interval = setInterval(checkAndRefreshCache, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkAndRefreshCache]);

  return {
    forceCacheRefresh,
    getLastRefreshTime,
    getTimeUntilNextRefresh,
  };
}
