import { useEffect, useState, useCallback, useRef } from "react";
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
  const previousStationCodes = useRef<StationCode[]>([]);
  const currentStationCodes = useRef<StationCode[]>(stationCodes);

  // Update the ref whenever stationCodes changes
  useEffect(() => {
    currentStationCodes.current = stationCodes;
  }, [stationCodes]);

  // Load function that doesn't depend on stationCodes directly
  const load = useCallback(async () => {
    const codes = currentStationCodes.current;
    if (codes.length === 0) return;

    try {
      const json = await fetchRidePath();
      console.log("Multi-station API Response:", json);

      setStationData((prev) => {
        const updated = { ...prev };

        codes.forEach((code) => {
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
        const codes = currentStationCodes.current;
        codes.forEach((code) => {
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
  }, []); // No dependencies! This prevents reload on stationCodes change

  // Handle station changes (add/remove) without re-fetching
  useEffect(() => {
    const prevCodes = previousStationCodes.current;
    const currentCodes = stationCodes;

    // Find added and removed stations
    const addedStations = currentCodes.filter(
      (code) => !prevCodes.includes(code)
    );
    const removedStations = prevCodes.filter(
      (code) => !currentCodes.includes(code)
    );

    if (addedStations.length > 0 || removedStations.length > 0) {
      setStationData((prev) => {
        const updated = { ...prev };

        // Initialize new stations
        addedStations.forEach((code) => {
          updated[code] = { data: null, loading: true, error: null };
        });

        // Remove deleted stations (this won't trigger re-renders for other stations)
        removedStations.forEach((code) => {
          delete updated[code];
        });

        return updated;
      });

      // Only fetch new data if we added stations (not if we just removed them)
      if (addedStations.length > 0) {
        console.log(
          "Fetching data because stations were added:",
          addedStations
        );
        // Set loading for existing stations only if we're adding new ones
        setStationData((prev) => {
          const updated = { ...prev };
          currentCodes.forEach((code) => {
            if (updated[code]) {
              updated[code] = { ...updated[code], loading: true };
            }
          });
          return updated;
        });
        // Trigger a fetch for the new stations
        load();
      } else {
        console.log(
          "Stations were only removed, no fetch needed:",
          removedStations
        );
      }
    }

    previousStationCodes.current = currentCodes;
  }, [stationCodes, load]);

  // Initial polling setup - only runs once
  useEffect(() => {
    if (stationCodes.length === 0) return;

    console.log("Setting up initial polling for stations:", stationCodes);

    // Initial load
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
  }, []); // Only run once on mount, never restart polling

  return {
    stationData,
    lastUpdated,
  };
};
