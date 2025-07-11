"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { StationCode } from "@/types/path";
import { STATIONS } from "@/constants/stations";
import { useCommute } from "@/contexts/CommuteContext";
import { useMultiStationData } from "@/hooks/useMultiStationData";
import { getAllRouteStations } from "@/utils/routeCalculator";
import { formatArrivalTime, arrivalClass } from "@/utils/pathHelpers";
import { 
  Home, 
  Briefcase, 
  Clock, 
  ArrowRight, 
  Train,
  AlertTriangle,
  Settings,
  Route as RouteIcon
} from "lucide-react";

export function CommuteHomeCard() {
  const { 
    commutePair, 
    currentRoute, 
    currentDirection,
    isCommuteConfigured 
  } = useCommute();

  // Don't show the card if commute is not configured
  if (!isCommuteConfigured || !commutePair || !currentRoute) {
    return (
      <CommuteSetupCard />
    );
  }

  const directionLabel = currentDirection === "morning" ? "Morning Commute" : "Evening Commute";
  const fromStation = currentDirection === "morning" ? commutePair.homeStation : commutePair.workStation;
  const toStation = currentDirection === "morning" ? commutePair.workStation : commutePair.homeStation;

  // Get all stations needed for this route
  const routeStations = getAllRouteStations(currentRoute);
  
  // Get unique stations we need data for (starting station + transfer stations)
  const keyStations = [fromStation]; // Always include starting station
  if (currentRoute.requiresTransfer) {
    // Add transfer stations (the starting points of subsequent segments)
    currentRoute.segments.slice(1).forEach(segment => {
      if (!keyStations.includes(segment.fromStation)) {
        keyStations.push(segment.fromStation);
      }
    });
  }
  
  const { stationData } = useMultiStationData(keyStations);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
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
            
            {currentRoute.requiresTransfer && (
              <div className="flex items-center space-x-1 text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                <RouteIcon className="w-3 h-3" />
                <span>Transfer</span>
              </div>
            )}
          </div>
          
          <Link 
            href="/commute"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>

        {/* Route Overview */}
        <div className="mt-2 flex items-center space-x-2 text-sm">
          <div className="flex items-center space-x-1">
            {currentDirection === "morning" ? (
              <Home className="w-4 h-4 text-gray-500" />
            ) : (
              <Briefcase className="w-4 h-4 text-gray-500" />
            )}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {STATIONS[fromStation]}
            </span>
          </div>
          
          <ArrowRight className="w-3 h-3 text-gray-400" />
          
          <div className="flex items-center space-x-1">
            {currentDirection === "morning" ? (
              <Briefcase className="w-4 h-4 text-gray-500" />
            ) : (
              <Home className="w-4 h-4 text-gray-500" />
            )}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {STATIONS[toStation]}
            </span>
          </div>
          
          <span className="text-gray-400">•</span>
          <div className="flex items-center space-x-1 text-gray-500">
            <Clock className="w-3 h-3" />
            <span>~{currentRoute.estimatedDuration} min</span>
          </div>
        </div>
      </div>

      {/* Real-time Arrivals for Key Stations */}
      <div className="p-4 space-y-4">
        {keyStations.map((stationCode, stationIndex) => {
          const stationDataForStation = stationData[stationCode];
          const hasData = stationDataForStation && !stationDataForStation.loading && !stationDataForStation.error;
          const arrivals = hasData ? stationDataForStation.data : null;
          const isStartingStation = stationCode === fromStation;
          const isTransferStation = !isStartingStation;

          return (
            <div key={stationCode} className={`space-y-2 rounded-lg border p-3 ${getStationColor(stationCode, isStartingStation, currentDirection)}`}>
              {/* Station Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    {isStartingStation ? (
                      currentDirection === "morning" ? (
                        <Home className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Briefcase className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      )
                    ) : (
                      <RouteIcon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    )}
                    <h3 className={`text-sm font-semibold ${getStationHeaderColor(stationCode, isStartingStation, currentDirection)}`}>
                      {STATIONS[stationCode]}
                    </h3>
                  </div>
                  
                  {isTransferStation && (
                    <div className="text-xs text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-800/40 px-2 py-0.5 rounded font-medium">
                      Transfer
                    </div>
                  )}
                </div>
              </div>

              {/* Loading/Error States */}
              {stationDataForStation?.loading && (
                <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 dark:bg-gray-700 rounded px-3 py-2">
                  <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
                  <span>Loading arrivals...</span>
                </div>
              )}

              {stationDataForStation?.error && (
                <div className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded px-3 py-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Unable to load arrival times</span>
                </div>
              )}

              {/* Real-time Arrivals */}
              {arrivals && (
                <div className="space-y-2">
                  {arrivals.destinations.map((destination: any, destIndex: number) => {
                    const directionLabel = destination.label === "ToNY" ? "To New York" : "To New Jersey";
                    const relevantMessages = destination.messages.slice(0, 4); // Show more trains for quick access

                    if (relevantMessages.length === 0) return null;

                    return (
                      <div key={destIndex} className="space-y-1">
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                          {directionLabel}
                        </div>
                        <div className="grid grid-cols-1 gap-1">
                          {relevantMessages.map((message: any, messageIndex: number) => {
                            // Highlight trains that match the user's route
                            const isRelevantTrain = currentRoute.segments.some(segment => 
                              stationCode === segment.fromStation && 
                              segment.stations.includes(message.target)
                            );

                            return (
                              <div
                                key={messageIndex}
                                className={`flex items-center justify-between text-sm rounded px-3 py-2 ${
                                  isRelevantTrain 
                                    ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800" 
                                    : "bg-gray-50 dark:bg-gray-700"
                                }`}
                              >
                                <div className="flex items-center space-x-2 min-w-0 flex-1">
                                  <div
                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: message.lineColor }}
                                  ></div>
                                  <Train className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                  <span className="text-gray-900 dark:text-white truncate font-medium">
                                    {message.headSign}
                                  </span>
                                  {isRelevantTrain && (
                                    <div className="flex-shrink-0">
                                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                                        Your Train
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <span
                                  className={`font-bold ml-3 ${arrivalClass(message)}`}
                                >
                                  {formatArrivalTime(message.arrivalTimeMessage)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {arrivals && arrivals.destinations.every((dest: any) => dest.messages.length === 0) && (
                <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded px-3 py-2 text-center">
                  No trains currently scheduled
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4">
        <Link
          href="/commute"
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          View full commute details →
        </Link>
      </div>
    </motion.div>
  );
}

function CommuteSetupCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <RouteIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Set Up Your Commute
          </h2>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Configure your daily home-to-work route to see arrival times automatically 
          based on the time of day.
        </p>
        
        <Link
          href="/commute"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
        >
          <RouteIcon className="w-4 h-4 mr-2" />
          Set Up Commute
        </Link>
      </div>
    </motion.div>
  );
}

function getStationColor(stationCode: StationCode, isStartingStation: boolean, currentDirection: "morning" | "evening"): string {
  if (isStartingStation) {
    // Color code starting station based on direction
    return currentDirection === "morning" 
      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
      : "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700";
  } else {
    // Transfer stations get orange color
    return "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700";
  }
}

function getStationHeaderColor(stationCode: StationCode, isStartingStation: boolean, currentDirection: "morning" | "evening"): string {
  if (isStartingStation) {
    return currentDirection === "morning" 
      ? "text-blue-800 dark:text-blue-200"
      : "text-purple-800 dark:text-purple-200";
  } else {
    return "text-orange-800 dark:text-orange-200";
  }
}

