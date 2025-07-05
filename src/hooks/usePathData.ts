import { useEffect, useState, useCallback } from "react";
import { StationResult, StationCode } from "../types/path";
import { fetchRidePath } from "../services/pathApi";
import { POLLING_INTERVAL } from "../constants/stations";

export const usePathData = (station: StationCode) => {
  const [data, setData] = useState<StationResult | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const json = await fetchRidePath();
      console.log("API Response:", json); // Debug: Check what we're getting
      const found = json.results.find((s) => s.consideredStation === station);
      setData((prev) =>
        JSON.stringify(prev) === JSON.stringify(found) ? prev : found ?? null
      );

      // Debug: Check the lastUpdated field
      console.log("LastUpdated from API:", json.lastUpdated);
      setLastUpdated(json.lastUpdated || new Date().toISOString());
      setError(null);
    } catch (e: any) {
      console.error("API Error:", e);
      setError(e?.message ?? "Fetch failed");
      setData(null);
      // Set lastUpdated to null on error to show stale state
      setLastUpdated(null);
    } finally {
      setLoading(false);
    }
  }, [station]);

  // Initial load and polling
  useEffect(() => {
    setLoading(true);
    load();
    const id = setInterval(load, POLLING_INTERVAL);
    return () => clearInterval(id);
  }, [load]);

  return {
    data,
    lastUpdated,
    loading,
    error,
  };
};
