import { useEffect, useState, useCallback } from "react";
import { StationResult, StationCode } from "../types/path";
import { fetchRidePath } from "../services/pathApi";
import { POLLING_INTERVAL } from "../constants/stations";

interface StationData {
  data: StationResult | null;
  loading: boolean;
  error: string | null;
}

interface MultiStationData {
  [stationCode: string]: StationData;
}

export const useMultiStationData = (stationCodes: StationCode[]) => {
  const [stationData, setStationData] = useState<MultiStationData>({});
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (stationCodes.length === 0) return;

    try {
      const json = await fetchRidePath();
      console.log("Multi-station API Response:", json);

      setStationData((prev) => {
        const updated = { ...prev };

        stationCodes.forEach((code) => {
          const found = json.results.find((s) => s.consideredStation === code);
          const newStationData = found ?? null;

          // Apply the same object reference preservation pattern as the original code
          // Only update if data has actually changed to prevent unnecessary re-renders
          const prevStationData = prev[code]?.data;
          const shouldUpdate =
            JSON.stringify(prevStationData) !== JSON.stringify(newStationData);

          updated[code] = {
            data: shouldUpdate ? newStationData : prevStationData,
            loading: false,
            error: null,
          };
        });

        return updated;
      });

      setLastUpdated(json.lastUpdated || new Date().toISOString());
    } catch (e: any) {
      console.error("Multi-station API Error:", e);

      setStationData((prev) => {
        const updated = { ...prev };
        stationCodes.forEach((code) => {
          updated[code] = {
            data: prev[code]?.data || null,
            loading: false,
            error: e?.message ?? "Fetch failed",
          };
        });
        return updated;
      });

      setLastUpdated(null);
    }
  }, [stationCodes]);

  // Initialize data for new stations
  useEffect(() => {
    setStationData((prev) => {
      const updated = { ...prev };
      let hasChanges = false;

      stationCodes.forEach((code) => {
        if (!updated[code]) {
          updated[code] = { data: null, loading: true, error: null };
          hasChanges = true;
        }
      });

      return hasChanges ? updated : prev;
    });
  }, [stationCodes]);

  // Polling effect
  useEffect(() => {
    if (stationCodes.length === 0) return;

    // Set initial loading state
    setStationData((prev) => {
      const updated = { ...prev };
      stationCodes.forEach((code) => {
        if (updated[code]) {
          updated[code] = { ...updated[code], loading: true };
        } else {
          updated[code] = { data: null, loading: true, error: null };
        }
      });
      return updated;
    });

    load();
    const id = setInterval(load, POLLING_INTERVAL);
    return () => clearInterval(id);
  }, [load]);

  return {
    stationData,
    lastUpdated,
  };
};
