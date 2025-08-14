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
        const age = Date.now() - new Date(cachedData.cachedAt || cachedData.timestamp).getTime();
        console.log(`[Alerts] Using cached data: ${cachedData.data.length} alerts (${Math.round(age/1000)}s old)`);
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
      const startTime = Date.now();
      const json = await fetchAlerts();
      const fetchTime = Date.now() - startTime;
      
      if (json.status === "Success" && json.data) {
        // Cache successful data
        const timestamp = new Date().toISOString();
        cacheAlertsData(json.data, timestamp);
        console.log(`[Alerts] Fetched and cached ${json.data.length} alerts in ${fetchTime}ms`);

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

    // Check if cache is fresh enough (less than 30 seconds old)
    const cachedData = getCachedAlertsData();
    const isCacheFresh = cachedData && cachedData.cachedAt && 
      (Date.now() - new Date(cachedData.cachedAt).getTime()) < 30000; // 30 seconds
    
    if (isCacheFresh) {
      console.log("[Alerts Cache] Cache is fresh, skipping initial fetch");
      // Don't fetch immediately if cache is fresh
      // Just set up polling for later updates
    } else {
      console.log("[Alerts Cache] Cache is stale or missing, fetching fresh data");
      // Only show loading if we don't already have data (from cache)
      if (data.length === 0) {
        setLoading(true);
      }
      // Fetch fresh data
      load();
    }
    
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
        // Check cache freshness before fetching when tab becomes visible
        const cachedData = getCachedAlertsData();
        const isCacheFresh = cachedData && cachedData.cachedAt && 
          (Date.now() - new Date(cachedData.cachedAt).getTime()) < 30000; // 30 seconds
        
        if (!isCacheFresh) {
          console.log("[Alerts Cache] Tab became visible, cache is stale, fetching...");
          load();
        } else {
          console.log("[Alerts Cache] Tab became visible, cache is still fresh");
        }
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
