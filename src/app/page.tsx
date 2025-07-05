"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";
import { StationCode } from "../types/path";
import { STATIONS } from "../constants/stations";
import { usePathData } from "../hooks/usePathData";
import { useAlerts } from "../hooks/useAlerts";
import { useGeolocation } from "../hooks/useGeolocation";
import { getStalenessStatus, formatTime } from "../utils/pathHelpers";
import { StatusRibbon } from "../components/StatusRibbon";
import { StationSelector } from "../components/StationSelector";
import { ArrivalsTable } from "../components/ArrivalsTable";
import { AlertsCard } from "../components/AlertsCard";

/**
 * PATH realtime feed UI
 *  — CORS‑proxy fallback
 *  — Per‑route colour bullets
 *  — Arrival heat‑map + deep‑red Delayed flag
 *  — Right‑aligned Arrival column
 *  — Friendly station list that mirrors live feed codes
 *  — Row‑level refresh with cube‑rotation animation (no full card flicker)
 *  — **Enhanced: Prominent "Last updated" ribbon in the header** (priority #1)
 *  — **NEW: PATH Alerts from Port Authority API**
 *  — **NEW: Auto-select closest station based on user location**
 */

export default function PathTracker() {
  const [station, setStation] = useState<StationCode>("NWK");
  const [hasAutoSelected, setHasAutoSelected] = useState(false);
  const { data, lastUpdated, loading, error } = usePathData(station);
  const {
    data: alerts,
    loading: alertsLoading,
    error: alertsError,
  } = useAlerts();
  const {
    closestStation,
    isLoading: locationLoading,
    error: locationError,
    hasPermission,
    requestLocation,
  } = useGeolocation();

  // Auto-select closest station when detected (only once)
  useEffect(() => {
    if (closestStation && !hasAutoSelected) {
      setStation(closestStation);
      setHasAutoSelected(true);
    }
  }, [closestStation, hasAutoSelected]);

  const handleStationChange = (newStation: StationCode) => {
    setStation(newStation);
    // Don't reset hasAutoSelected here - it's just a flag to prevent auto-selection from happening again
  };

  const prettyTime = formatTime(lastUpdated);
  const staleness = getStalenessStatus(lastUpdated, error);

  // Check if current station is the closest station
  const isCurrentStationClosest = closestStation === station;

  const renderLocationStatus = () => {
    if (locationLoading) {
      return (
        <div className="flex items-center gap-2 text-sm text-blue-400 bg-blue-900/20 px-3 py-2 rounded-md">
          <Navigation className="w-4 h-4 animate-spin" />
          <span>Finding your closest station...</span>
        </div>
      );
    }

    if (locationError) {
      return (
        <div className="flex items-center gap-2 text-sm text-amber-400 bg-amber-900/20 px-3 py-2 rounded-md">
          <MapPin className="w-4 h-4" />
          <span>Unable to detect location</span>
          <button
            onClick={requestLocation}
            className="text-amber-300 hover:text-amber-100 underline ml-2"
          >
            Try again
          </button>
        </div>
      );
    }

    if (hasPermission && hasAutoSelected && isCurrentStationClosest) {
      return (
        <div className="flex items-center gap-2 text-sm text-green-400 bg-green-900/20 px-3 py-2 rounded-md">
          <MapPin className="w-4 h-4" />
          <span>Auto-selected closest station to your location</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="mx-auto max-w-2xl p-4 space-y-4">
      {/* Prominent Last Updated Ribbon */}
      <StatusRibbon
        staleness={staleness}
        prettyTime={prettyTime}
        loading={loading}
      />

      <h1 className="text-3xl font-bold text-center">RidePATH Arrivals</h1>

      {/* Location Status */}
      {renderLocationStatus()}

      {/* Alerts Card */}
      <AlertsCard alerts={alerts} loading={alertsLoading} error={alertsError} />

      {/* Station selector */}
      <StationSelector value={station} onChange={handleStationChange} />

      <Card className="bg-gray-900 text-white">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold capitalize">
                {STATIONS[station] ?? station}
              </span>
              {hasPermission && isCurrentStationClosest && (
                <div className="flex items-center gap-1 text-sm text-green-400">
                  <MapPin className="w-4 h-4" />
                  <span>Closest</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

          {!error && data && <ArrivalsTable data={data} />}

          {!error && !data && (
            <p className="text-gray-400">
              No arrivals scheduled for this station at the moment.
            </p>
          )}
        </CardContent>
      </Card>

      <footer className="text-center text-xs text-gray-500 pt-4">
        Data © Port Authority of NY & NJ · updates every 10 s
      </footer>
    </div>
  );
}
