"use client";

import { memo } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { X, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { StationResult, StationCode } from "../types/path";
import { STATIONS } from "../constants/stations";
import { ArrivalsTable } from "./ArrivalsTable";
import { useTranslations } from 'next-intl';

interface StationCardProps {
  stationCode: StationCode;
  data: StationResult | null;
  loading: boolean;
  error: string | null;
  hasCachedData?: boolean;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isDragging?: boolean;
  dragHandleProps?: any;
}

export const StationCard = memo(
  ({
    stationCode,
    data,
    loading,
    error,
    hasCachedData = false,
    onRemove,
    onMoveUp,
    onMoveDown,
    isDragging,
    dragHandleProps,
  }: StationCardProps) => {
    const t = useTranslations();
    
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

            {/* Control buttons */}
            <div className="flex items-center gap-1">
              {/* Move up button */}
              {onMoveUp && (
                <button
                  onClick={onMoveUp}
                  className="text-gray-400 hover:text-blue-400 transition-colors p-1 rounded-md hover:bg-blue-900/20"
                  title={t('station.moveStation')}
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              )}

              {/* Move down button */}
              {onMoveDown && (
                <button
                  onClick={onMoveDown}
                  className="text-gray-400 hover:text-blue-400 transition-colors p-1 rounded-md hover:bg-blue-900/20"
                  title={t('station.moveStation')}
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              )}

              {/* Remove button */}
              {onRemove && (
                <button
                  onClick={onRemove}
                  className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-md hover:bg-red-900/20"
                  title={t('station.removeStation')}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading && (
            <div className="flex items-center gap-2 text-gray-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
              <span>{t('station.loadingArrivals')}</span>
            </div>
          )}

          {error && hasCachedData && (
            <div className="mb-4 p-3 bg-orange-800/50 border border-orange-600 rounded">
              <div className="flex items-center gap-2 text-orange-100 text-sm">
                <span>⚠️</span>
                <span>
                  {t('station.errorLatest')}
                </span>
              </div>
              <div className="text-xs text-orange-200 mt-1">{error}</div>
            </div>
          )}

          {error && !hasCachedData && (
            <div className="p-3 bg-red-800/50 border border-red-600 rounded text-sm">
              <div className="flex items-center gap-2 text-red-100 mb-1">
                <span>❌</span>
                <span>{t('station.errorLoading')}</span>
              </div>
              <div className="text-red-200">{error}</div>
            </div>
          )}

          {!error && !loading && data && <ArrivalsTable data={data} />}
          {error && hasCachedData && data && <ArrivalsTable data={data} />}

          {!error && !loading && !data && (
            <p className="text-gray-400">
              {t('station.noArrivals')}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }
);

StationCard.displayName = "StationCard";
