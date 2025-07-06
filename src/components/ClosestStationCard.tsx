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
  isLoadingData: boolean;
  error: string | null;
  userLocation: { lat: number; lon: number } | null;
}

export const ClosestStationCard = memo(
  ({
    stationCode,
    data,
    loading,
    isLoadingData,
    error,
    userLocation,
  }: ClosestStationCardProps) => {
    return (
      <Card className="bg-gradient-to-r from-blue-900 to-blue-800 text-white border-blue-700 sticky top-0 z-10 shadow-lg">
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
          {error && (
            <div className="flex items-center gap-2 text-amber-300 bg-amber-900/20 px-3 py-2 rounded-md text-sm">
              <MapPin className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {loading && !error && (
            <div className="flex items-center gap-2 text-blue-300">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300"></div>
              <span>Finding your closest station...</span>
            </div>
          )}

          {!loading && !error && isLoadingData && (
            <div className="flex items-center gap-2 text-blue-300">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300"></div>
              <span>Loading arrivals...</span>
            </div>
          )}

          {!loading && !error && !isLoadingData && data && (
            <ArrivalsTable data={data} />
          )}

          {!loading && !error && !isLoadingData && !data && (
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
