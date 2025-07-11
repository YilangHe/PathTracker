"use client";

import React from "react";
import { motion } from "framer-motion";
import { StationCode, CommuteRoute, RouteSegment } from "@/types/path";
import { STATIONS } from "@/constants/stations";
import { useCommute } from "@/contexts/CommuteContext";
import { useMultiStationData } from "@/hooks/useMultiStationData";
import { getAllRouteStations, getTimeRangeLabel } from "@/utils/routeCalculator";
import { formatArrivalTime, arrivalClass, getLineColor } from "@/utils/pathHelpers";
import { 
  Home, 
  Briefcase, 
  Clock, 
  ArrowRight, 
  Route as RouteIcon,
  MapPin,
  Train,
  AlertTriangle
} from "lucide-react";

export function CommuteCard() {
  const { 
    commutePair, 
    currentRoute, 
    currentDirection 
  } = useCommute();

  if (!commutePair || !currentRoute) {
    return null;
  }

  // Get all stations needed for this route
  const routeStations = getAllRouteStations(currentRoute);
  const { stationData } = useMultiStationData(routeStations);

  const directionLabel = currentDirection === "morning" ? "Morning Commute" : "Evening Commute";
  const timeRange = getTimeRangeLabel(currentDirection);
  const fromStation = currentDirection === "morning" ? commutePair.homeStation : commutePair.workStation;
  const toStation = currentDirection === "morning" ? commutePair.workStation : commutePair.homeStation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 text-white rounded-lg shadow-sm border border-gray-700"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {currentDirection === "morning" ? (
                <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              ) : (
                <Home className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              )}
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {directionLabel}
              </h2>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {timeRange}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>~{currentRoute.estimatedDuration} min</span>
          </div>
        </div>

        {/* Route Overview */}
        <div className="mt-3 flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            {currentDirection === "morning" ? (
              <Home className="w-4 h-4 text-gray-500" />
            ) : (
              <Briefcase className="w-4 h-4 text-gray-500" />
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {STATIONS[fromStation]}
            </span>
          </div>
          
          <ArrowRight className="w-4 h-4 text-gray-400" />
          
          <div className="flex items-center space-x-2">
            {currentDirection === "morning" ? (
              <Briefcase className="w-4 h-4 text-gray-500" />
            ) : (
              <Home className="w-4 h-4 text-gray-500" />
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {STATIONS[toStation]}
            </span>
          </div>
          
          {currentRoute.requiresTransfer && (
            <div className="flex items-center space-x-1 text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
              <RouteIcon className="w-3 h-3" />
              <span>Transfer Required</span>
            </div>
          )}
        </div>
      </div>

      {/* Route Segments */}
      <div className="p-4 space-y-4">
        {currentRoute.segments.map((segment, segmentIndex) => (
          <RouteSegmentCard
            key={segmentIndex}
            segment={segment}
            segmentIndex={segmentIndex}
            stationData={stationData}
            isTransfer={segment.isTransfer}
          />
        ))}
      </div>
    </motion.div>
  );
}

interface RouteSegmentCardProps {
  segment: RouteSegment;
  segmentIndex: number;
  stationData: any;
  isTransfer?: boolean;
}

function RouteSegmentCard({ 
  segment, 
  segmentIndex, 
  stationData, 
  isTransfer 
}: RouteSegmentCardProps) {
  const fromStationData = stationData[segment.fromStation];
  const hasData = fromStationData && !fromStationData.loading && !fromStationData.error;
  const arrivals = hasData ? fromStationData.data : null;

  return (
    <div className="space-y-3">
      {/* Transfer Notice */}
      {isTransfer && (
        <div className="flex items-center space-x-2 text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-3 py-2 rounded-md">
          <RouteIcon className="w-4 h-4" />
          <span>Transfer at {STATIONS[segment.fromStation]}</span>
          <span className="text-xs text-gray-500">~3 min transfer time</span>
        </div>
      )}

      {/* Line Information */}
      <div className="flex items-center space-x-3">
        <div
          className="w-4 h-4 rounded-full flex-shrink-0"
          style={{ backgroundColor: segment.color }}
        ></div>
        <div className="flex-1">
          <div className="font-medium text-gray-900 dark:text-white">
            {segment.line.name}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {STATIONS[segment.fromStation]} → {STATIONS[segment.toStation]}
          </div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Every ~{segment.line.frequency} min
        </div>
      </div>

      {/* Station Arrivals */}
      <div className="ml-7 space-y-2">
        {!hasData && fromStationData?.loading && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
            <span>Loading arrivals...</span>
          </div>
        )}

        {fromStationData?.error && (
          <div className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Unable to load arrival times</span>
          </div>
        )}

        {arrivals && (
          <div className="space-y-1">
            {arrivals.destinations.map((destination: any) => {
              // Filter messages for this route's destination
              const relevantMessages = destination.messages.filter((message: any) => {
                return segment.stations.includes(message.target);
              });

              if (relevantMessages.length === 0) return null;

              return (
                <div key={destination.label} className="space-y-1">
                  {relevantMessages.slice(0, 3).map((message: any, messageIndex: number) => (
                    <div
                      key={messageIndex}
                      className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-700 rounded px-3 py-2"
                    >
                      <div className="flex items-center space-x-2">
                        <Train className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {message.headSign}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`font-medium ${arrivalClass(message)}`}
                        >
                          {formatArrivalTime(message.arrivalTimeMessage)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

