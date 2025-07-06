import { useState, useEffect, useCallback } from "react";
import { StationCode, StationResult } from "../types/path";
import { findClosestStation } from "../utils/pathHelpers";
import { fetchRidePath } from "../services/pathApi";

interface GeolocationState {
  closestStation: StationCode | null;
  closestStationData: StationResult | null;
  isLoading: boolean;
  isLoadingData: boolean;
  error: string | null;
  hasPermission: boolean;
  userLocation: { lat: number; lon: number } | null;
}

const LOCATION_REFRESH_INTERVAL = 10000; // 10 seconds

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    closestStation: null,
    closestStationData: null,
    isLoading: false,
    isLoadingData: false,
    error: null,
    hasPermission: false,
    userLocation: null,
  });

  const fetchClosestStationData = useCallback(
    async (stationCode: StationCode) => {
      setState((prev) => ({ ...prev, isLoadingData: true }));

      try {
        const response = await fetchRidePath();
        const stationData = response.results.find(
          (s) => s.consideredStation === stationCode
        );

        setState((prev) => ({
          ...prev,
          closestStationData: stationData || null,
          isLoadingData: false,
        }));
      } catch (error) {
        console.error("Error fetching closest station data:", error);
        setState((prev) => ({
          ...prev,
          closestStationData: null,
          isLoadingData: false,
        }));
      }
    },
    []
  );

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by this browser",
        isLoading: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000, // 1 minute cache for periodic updates
          });
        }
      );

      const { latitude, longitude } = position.coords;
      const closest = findClosestStation(latitude, longitude);

      setState((prev) => ({
        ...prev,
        closestStation: closest,
        userLocation: { lat: latitude, lon: longitude },
        hasPermission: true,
        isLoading: false,
        error: null,
      }));

      // Fetch data for the closest station
      await fetchClosestStationData(closest);
    } catch (error) {
      let errorMessage = "Unable to get your location";

      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
      }

      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
        hasPermission: false,
      }));
    }
  }, [fetchClosestStationData]);

  // Auto-request location on component mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Set up periodic location and data refresh when permission is granted
  useEffect(() => {
    if (!state.hasPermission) return;

    const interval = setInterval(() => {
      requestLocation();
    }, LOCATION_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [state.hasPermission, requestLocation]);

  // Fetch station data periodically for the closest station
  useEffect(() => {
    if (!state.closestStation || !state.hasPermission) return;

    const interval = setInterval(() => {
      fetchClosestStationData(state.closestStation!);
    }, LOCATION_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [state.closestStation, state.hasPermission, fetchClosestStationData]);

  return {
    ...state,
    requestLocation,
  };
};
