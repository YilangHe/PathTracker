import { useState, useEffect } from "react";
import { StationCode } from "../types/path";
import { findClosestStation } from "../utils/pathHelpers";

interface GeolocationState {
  closestStation: StationCode | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
  userLocation: { lat: number; lon: number } | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    closestStation: null,
    isLoading: false,
    error: null,
    hasPermission: false,
    userLocation: null,
  });

  const requestLocation = async () => {
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
            maximumAge: 300000, // 5 minutes
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
      }));
    }
  };

  // Auto-request location on component mount
  useEffect(() => {
    requestLocation();
  }, []);

  return {
    ...state,
    requestLocation,
  };
};
