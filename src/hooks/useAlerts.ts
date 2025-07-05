import { useEffect, useState, useCallback } from "react";
import { Alert } from "../types/path";
import { fetchAlerts } from "../services/pathApi";
import { POLLING_INTERVAL } from "../constants/stations";

export const useAlerts = () => {
  const [data, setData] = useState<Alert[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const json = await fetchAlerts();
      console.log("Alerts API Response:", json);

      if (json.status === "Success" && json.data) {
        setData(json.data);
        setLastUpdated(new Date().toISOString());
        setError(null);
      } else {
        setData([]);
        setError("No alerts data available");
      }
    } catch (e: any) {
      console.error("Alerts API Error:", e);
      setError(e?.message ?? "Failed to fetch alerts");
      setData([]);
      setLastUpdated(null);
    } finally {
      setLoading(false);
    }
  }, []);

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
