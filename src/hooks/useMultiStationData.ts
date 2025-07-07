import { useEffect, useState, useCallback, useRef } from "react";
import { StationResult, StationCode } from "../types/path";
import { fetchRidePath } from "../services/pathApi";
import { POLLING_INTERVAL } from "../constants/stations";
import { cacheStationData, getCachedStationData } from "../utils/pathHelpers";

interface StationData {
  data: StationResult | null;
  loading: boolean;
  error: string | null;
  hasCachedData: boolean;
}

interface MultiStationData {
  [stationCode: string]: StationData;
}

export const useMultiStationData = (stationCodes: StationCode[]) => {
  const [stationData, setStationData] = useState<MultiStationData>({});
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [lastSuccessfulUpdate, setLastSuccessfulUpdate] = useState<
    string | null
  >(null);
  const previousStationCodes = useRef<StationCode[]>([]);
  const currentStationCodes = useRef<StationCode[]>(stationCodes);

  // Load cached data on initial mount
  useEffect(() => {
    const cachedData = getCachedStationData();
    if (cachedData) {
      console.log("Loading cached station data:", cachedData);
      setStationData((prev) => {
        const updated = { ...prev };

        // Initialize with cached data for current stations
        stationCodes.forEach((code) => {
          const cachedStationData = cachedData.data?.[code];
          if (cachedStationData) {
            updated[code] = {
              data: cachedStationData.data,
              loading: false,
              error: null,
              hasCachedData: true,
            };
          }
        });

        return updated;
      });
      setLastSuccessfulUpdate(cachedData.timestamp);
    }
  }, []);

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

      // Cache successful data
      const cacheData: Record<string, { data: StationResult | null }> = {};
      codes.forEach((code) => {
        const found = json.results.find((s) => s.consideredStation === code);
        cacheData[code] = { data: found || null };
      });
      cacheStationData(cacheData, json.lastUpdated);

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
            hasCachedData: false, // Fresh data, not cached
          };
        });

        return updated;
      });

      setLastUpdated(json.lastUpdated || new Date().toISOString());
      setLastSuccessfulUpdate(json.lastUpdated || new Date().toISOString());
    } catch (e: any) {
      console.error("Multi-station API Error:", e);

      setStationData((prev) => {
        const updated = { ...prev };
        const codes = currentStationCodes.current;
        codes.forEach((code) => {
          // Keep existing data if available, otherwise null
          const existingData = prev[code]?.data || null;
          const hasCachedData = existingData !== null;

          updated[code] = {
            data: existingData,
            loading: false,
            error: e?.message ?? "Fetch failed",
            hasCachedData,
          };
        });
        return updated;
      });

      // Don't update lastUpdated on error, but keep lastSuccessfulUpdate
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

        // Initialize new stations - check if we have cached data for them
        addedStations.forEach((code) => {
          const cachedData = getCachedStationData();
          const cachedStationData = cachedData?.data?.[code];

          if (cachedStationData) {
            updated[code] = {
              data: cachedStationData.data,
              loading: true,
              error: null,
              hasCachedData: true,
            };
          } else {
            updated[code] = {
              data: null,
              loading: true,
              error: null,
              hasCachedData: false,
            };
          }
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
        // Trigger a fetch for the new stations - only in browser environment
        if (typeof window !== "undefined") {
          load();
        }
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
    // Only run in browser environment, not during SSR or crawling
    if (typeof window === "undefined" || stationCodes.length === 0) {
      // For SSR/crawling, initialize with non-error states and a recent timestamp
      if (stationCodes.length > 0) {
        setStationData((prev) => {
          const updated = { ...prev };
          stationCodes.forEach((code) => {
            updated[code] = {
              data: null,
              loading: false,
              error: null,
              hasCachedData: false,
            };
          });
          return updated;
        });
        // Set a recent timestamp for SSR to show "Live" status instead of "Unknown"
        setLastUpdated(new Date().toISOString());
        setLastSuccessfulUpdate(new Date().toISOString());
      }
      return;
    }

    console.log("Setting up initial polling for stations:", stationCodes);

    // Initial load
    setStationData((prev) => {
      const updated = { ...prev };
      stationCodes.forEach((code) => {
        if (updated[code]) {
          updated[code] = { ...updated[code], loading: true };
        } else {
          updated[code] = {
            data: null,
            loading: true,
            error: null,
            hasCachedData: false,
          };
        }
      });
      return updated;
    });

    load();
    const id = setInterval(load, POLLING_INTERVAL);
    return () => clearInterval(id);
  }, []);

  return {
    stationData,
    lastUpdated,
    lastSuccessfulUpdate,
  };
};
