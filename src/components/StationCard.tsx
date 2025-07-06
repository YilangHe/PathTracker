import { memo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { X, GripVertical } from "lucide-react";
import { StationResult, StationCode } from "../types/path";
import { STATIONS } from "../constants/stations";
import { ArrivalsTable } from "./ArrivalsTable";

interface StationCardProps {
  stationCode: StationCode;
  data: StationResult | null;
  loading: boolean;
  error: string | null;
  onRemove?: () => void;
  isDragging?: boolean;
  dragHandleProps?: any;
}

export const StationCard = memo(
  ({
    stationCode,
    data,
    loading,
    error,
    onRemove,
    isDragging,
    dragHandleProps,
  }: StationCardProps) => {
    return (
      <Card
        className={`bg-gray-900 text-white transition-all duration-200 ${
          isDragging ? "shadow-lg scale-105 rotate-2" : ""
        }`}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Drag handle */}
              {dragHandleProps && (
                <div
                  {...dragHandleProps}
                  className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <GripVertical className="w-4 h-4" />
                </div>
              )}

              <span className="text-xl font-semibold capitalize">
                {STATIONS[stationCode] ?? stationCode}
              </span>
            </div>

            {/* Remove button */}
            {onRemove && (
              <button
                onClick={onRemove}
                className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-md hover:bg-red-900/20"
                title="Remove station"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {loading && (
            <div className="flex items-center gap-2 text-gray-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
              <span>Loading arrivals...</span>
            </div>
          )}

          {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

          {!error && !loading && data && <ArrivalsTable data={data} />}

          {!error && !loading && !data && (
            <p className="text-gray-400">
              No arrivals scheduled for this station at the moment.
            </p>
          )}
        </CardContent>
      </Card>
    );
  }
);

StationCard.displayName = "StationCard";
