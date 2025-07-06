import { memo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";
import { StationResult, StationCode } from "../types/path";
import { STATIONS } from "../constants/stations";
import { ArrivalsTable } from "./ArrivalsTable";

interface ClosestStationCardProps {
  stationCode: StationCode;
  data: StationResult | null;
  loading: boolean;
  error: string | null;
  userLocation: { lat: number; lon: number } | null;
}

export const ClosestStationCard = memo(
  ({
    stationCode,
    data,
    loading,
    error,
    userLocation,
  }: ClosestStationCardProps) => {
    return (
      <Card className="bg-gradient-to-r from-blue-900 to-blue-800 text-white border-blue-700 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-300" />
                <span className="text-lg font-semibold">Closest Station</span>
              </div>

              <div className="flex items-center gap-2">
                {loading && (
                  <Navigation className="w-4 h-4 animate-spin text-blue-300" />
                )}
                <span className="text-xl font-bold capitalize">
                  {STATIONS[stationCode] ?? stationCode}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-blue-200">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Auto-updating</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading && (
            <div className="flex items-center gap-2 text-blue-300">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300"></div>
              <span>Loading arrivals...</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-800/50 border border-red-600 rounded text-sm">
              <div className="flex items-center gap-2 text-red-100 mb-1">
                <span>❌</span>
                <span>Error loading arrivals:</span>
              </div>
              <div className="text-red-200">{error}</div>
            </div>
          )}

          {!error && !loading && data && <ArrivalsTable data={data} />}

          {!error && !loading && !data && (
            <div className="text-blue-200">
              No arrivals scheduled for this station at the moment.
            </div>
          )}

          {userLocation && (
            <div className="mt-3 text-xs text-blue-300 opacity-75">
              Based on your location: {userLocation.lat.toFixed(4)},{" "}
              {userLocation.lon.toFixed(4)}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

ClosestStationCard.displayName = "ClosestStationCard";
