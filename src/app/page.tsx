"use client";
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { StationCode } from "../types/path";
import { STATIONS } from "../constants/stations";
import { usePathData } from "../hooks/usePathData";
import { useAlerts } from "../hooks/useAlerts";
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
 */

export default function PathTracker() {
  const [station, setStation] = useState<StationCode>("NWK");
  const { data, lastUpdated, loading, error } = usePathData(station);
  const {
    data: alerts,
    loading: alertsLoading,
    error: alertsError,
  } = useAlerts();

  const prettyTime = formatTime(lastUpdated);
  const staleness = getStalenessStatus(lastUpdated, error);

  return (
    <div className="mx-auto max-w-2xl p-4 space-y-4">
      {/* Prominent Last Updated Ribbon */}
      <StatusRibbon
        staleness={staleness}
        prettyTime={prettyTime}
        loading={loading}
      />

      <h1 className="text-3xl font-bold text-center">RidePATH Arrivals</h1>

      {/* Alerts Card */}
      <AlertsCard alerts={alerts} loading={alertsLoading} error={alertsError} />

      {/* Station selector */}
      <StationSelector value={station} onChange={setStation} />

      <Card className="bg-gray-900 text-white">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold capitalize">
                {STATIONS[station] ?? station}
              </span>
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
