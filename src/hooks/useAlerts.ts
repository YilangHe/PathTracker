import { useEffect, useState, useCallback } from "react";
import { Alert } from "../types/path";
import { fetchAlerts } from "../services/pathApi";
import { POLLING_INTERVAL } from "../constants/stations";
import { cacheAlertsData, getCachedAlertsData } from "../utils/pathHelpers";
import { isCrawlerCached } from "../utils/crawlerDetection";

export const useAlerts = () => {
  const [data, setData] = useState<Alert[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [lastSuccessfulUpdate, setLastSuccessfulUpdate] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCachedData, setHasCachedData] = useState(false);

  // Load cached data on initial mount
  useEffect(() => {
    const cachedData = getCachedAlertsData();
    if (cachedData && cachedData.data) {
      console.log("Loading cached alerts data:", cachedData);
      setData(cachedData.data);
      setLastSuccessfulUpdate(cachedData.timestamp);
      setHasCachedData(true);
    }
  }, []);

  const load = useCallback(async () => {
    try {
      const json = await fetchAlerts();
      console.log("Alerts API Response:", json);

      if (json.status === "Success" && json.data) {
        // Cache successful data
        cacheAlertsData(json.data, new Date().toISOString());

        setData(json.data);
        setLastUpdated(new Date().toISOString());
        setLastSuccessfulUpdate(new Date().toISOString());
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
    // Only run for real users, not during SSR or crawling
    if (isCrawlerCached()) {
      // For SSR/crawling, initialize with neutral state and recent timestamp
      setLoading(false);
      setError(null);
      setData([]);
      setLastUpdated(new Date().toISOString());
      setLastSuccessfulUpdate(new Date().toISOString());
      return;
    }

    setLoading(true);
    load();
    const id = setInterval(load, POLLING_INTERVAL);
    return () => clearInterval(id);
  }, [load]);

  return {
    data,
    lastUpdated,
    lastSuccessfulUpdate,
    loading,
    error,
    hasCachedData,
  };
};
