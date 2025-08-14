import { useEffect, useState, useCallback, useRef } from "react";
import { Alert } from "../types/path";
import { fetchAlerts } from "../services/pathApi";
import { ALERTS_POLLING_INTERVAL } from "../constants/stations";
import { cacheAlertsData, getCachedAlertsData } from "../utils/pathHelpers";

export const useAlerts = () => {
  // Initialize with cached data if available - this makes data available immediately
  const [data, setData] = useState<Alert[]>(() => {
    if (typeof window !== "undefined") {
      const cachedData = getCachedAlertsData();
      if (cachedData && cachedData.data) {
        console.log("[Alerts Cache] Initializing with cached data:", {
          dataLength: cachedData.data.length,
          timestamp: cachedData.timestamp,
          age: Date.now() - new Date(cachedData.cachedAt || cachedData.timestamp).getTime()
        });
        return cachedData.data;
      }
    }
    return [];
  });
  
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [lastSuccessfulUpdate, setLastSuccessfulUpdate] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const cachedData = getCachedAlertsData();
      if (cachedData && cachedData.timestamp) {
        return cachedData.timestamp;
      }
    }
    return null;
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCachedData, setHasCachedData] = useState(() => {
    if (typeof window !== "undefined") {
      const cachedData = getCachedAlertsData();
      return !!(cachedData && cachedData.data && cachedData.data.length > 0);
    }
    return false;
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const load = useCallback(async () => {
    try {
      console.log("[Alerts Fetch] Starting fetch...");
      const startTime = Date.now();
      const json = await fetchAlerts();
      const fetchTime = Date.now() - startTime;
      console.log(`[Alerts Fetch] Response received in ${fetchTime}ms:`, {
        status: json.status,
        dataLength: json.data?.length || 0
      });

      if (json.status === "Success" && json.data) {
        // Cache successful data
        const timestamp = new Date().toISOString();
        cacheAlertsData(json.data, timestamp);
        console.log("[Alerts Cache] Saved to localStorage:", {
          dataLength: json.data.length,
          timestamp
        });

        setData(json.data);
        setLastUpdated(timestamp);
        setLastSuccessfulUpdate(timestamp);
        setError(null);
        setHasCachedData(false); // Fresh data, not cached
      } else {
        // Keep existing data if available
        setError("No alerts data available");
        setLastUpdated(null);
        // Don't clear data - preserve existing/cached data
      }
    } catch (e: any) {
      console.error("Alerts API Error:", e);
      setError(e?.message ?? "Failed to fetch alerts");
      setLastUpdated(null);
      // Don't clear data - preserve existing/cached data
      // If we have existing data, mark it as cached
      if (data.length > 0) {
        setHasCachedData(true);
      }
    } finally {
      setLoading(false);
    }
  }, [data.length]);

  // Initial load and polling
  useEffect(() => {
    // Only run in browser environment, not during SSR or crawling
    if (typeof window === "undefined") {
      // For SSR/crawling, initialize with neutral state and recent timestamp
      setLoading(false);
      setError(null);
      setData([]);
      setLastUpdated(new Date().toISOString());
      setLastSuccessfulUpdate(new Date().toISOString());
      return;
    }

    // Additional check for web crawlers and bots that might have window defined
    // but should not trigger API calls
    if (typeof navigator !== "undefined" && navigator.userAgent) {
      const userAgent = navigator.userAgent.toLowerCase();
      const isCrawler =
        /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|developers.google.com\/\+\/web\/snippet\//i.test(
          userAgent
        );

      if (isCrawler) {
        // For crawlers, set up non-error states with recent timestamps
        setLoading(false);
        setError(null);
        setData([]);
        setLastUpdated(new Date().toISOString());
        setLastSuccessfulUpdate(new Date().toISOString());
        return;
      }
    }

    // Only show loading if we don't already have data (from cache)
    if (data.length === 0) {
      setLoading(true);
    }
    
    // Always fetch fresh data in background
    load();
    
    // Set up smart polling with visibility detection
    const setupPolling = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Only poll when tab is visible
      if (document.visibilityState === 'visible') {
        intervalRef.current = setInterval(load, ALERTS_POLLING_INTERVAL);
      }
    };
    
    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Resume polling and fetch fresh data when tab becomes visible
        load();
        setupPolling();
      } else {
        // Stop polling when tab is hidden
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };
    
    // Initial polling setup
    setupPolling();
    
    // Add visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [load, data.length]);

  return {
    data,
    lastUpdated,
    lastSuccessfulUpdate,
    loading,
    error,
    hasCachedData,
  };
};
