"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { StationCode } from "@/types/path";
import { STATIONS } from "@/constants/stations";
import { useCommute } from "@/contexts/CommuteContext";
import { useMultiStationData } from "@/hooks/useMultiStationData";
import { getAllRouteStations } from "@/utils/routeCalculator";
import { formatArrivalTime, arrivalClass, getLineColor } from "@/utils/pathHelpers";
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
      className="bg-gray-900 text-white rounded-lg shadow-sm border border-gray-700"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {currentDirection === "morning" ? (
                <Briefcase className="w-5 h-5 text-blue-400" />
              ) : (
                <Home className="w-5 h-5 text-purple-400" />
              )}
              <h2 className="text-lg font-semibold text-white">
                {directionLabel}
              </h2>
            </div>
            
            {currentRoute.requiresTransfer && (
              <div className="flex items-center space-x-1 text-xs text-orange-400 bg-orange-900/20 px-2 py-1 rounded">
                <RouteIcon className="w-3 h-3" />
                <span>Transfer</span>
              </div>
            )}
          </div>
          
          <Link 
            href="/commute"
            className="text-blue-400 hover:text-blue-300"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>

        {/* Route Overview */}
        <div className="mt-2 flex items-center space-x-2 text-sm">
          <div className="flex items-center space-x-1">
            {currentDirection === "morning" ? (
              <Home className="w-4 h-4 text-gray-400" />
            ) : (
              <Briefcase className="w-4 h-4 text-gray-400" />
            )}
            <span className="font-medium text-gray-300">
              {STATIONS[fromStation]}
            </span>
          </div>
          
          <ArrowRight className="w-3 h-3 text-gray-500" />
          
          <div className="flex items-center space-x-1">
            {currentDirection === "morning" ? (
              <Briefcase className="w-4 h-4 text-gray-400" />
            ) : (
              <Home className="w-4 h-4 text-gray-400" />
            )}
            <span className="font-medium text-gray-300">
              {STATIONS[toStation]}
            </span>
          </div>
          
          <span className="text-gray-500">•</span>
          <div className="flex items-center space-x-1 text-gray-400">
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

          return (
            <div key={stationCode} className="space-y-3">
              {/* Station Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {isStartingStation ? (
                    currentDirection === "morning" ? (
                      <Home className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Briefcase className="w-4 h-4 text-purple-400" />
                    )
                  ) : (
                    <RouteIcon className="w-4 h-4 text-orange-400" />
                  )}
                  <h3 className="text-lg font-semibold text-white">
                    {STATIONS[stationCode]}
                  </h3>
                  {!isStartingStation && (
                    <div className="text-xs text-orange-400 bg-orange-900/20 px-2 py-0.5 rounded font-medium">
                      Transfer
                    </div>
                  )}
                </div>
              </div>

              {/* Loading/Error States */}
              {stationDataForStation?.loading && (
                <div className="flex items-center space-x-2 text-sm text-gray-400 bg-gray-800 rounded px-3 py-2">
                  <div className="animate-spin w-4 h-4 border-2 border-gray-600 border-t-blue-400 rounded-full"></div>
                  <span>Loading arrivals...</span>
                </div>
              )}

              {stationDataForStation?.error && (
                <div className="flex items-center space-x-2 text-sm text-red-400 bg-red-900/20 rounded px-3 py-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Unable to load arrival times</span>
                </div>
              )}

              {/* Real-time Arrivals in ArrivalsTable Style */}
              {arrivals && (
                <div className="space-y-2">
                  {arrivals.destinations.map((destination: any, destIndex: number) => {
                    const directionLabel = destination.label === "ToNY" ? "To New York" : "To New Jersey";
                    const relevantMessages = destination.messages.slice(0, 3); // Show 3 trains per direction

                    if (relevantMessages.length === 0) return null;

                    return (
                      <div key={destIndex} className="space-y-2">
                        <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                          {directionLabel}
                        </div>
                        <div className="space-y-2">
                          {relevantMessages.map((message: any, messageIndex: number) => {
                            // Check if this train matches the user's route
                            const isRelevantTrain = currentRoute.segments.some(segment => 
                              stationCode === segment.fromStation && 
                              segment.stations.includes(message.target)
                            );

                            return (
                              <div
                                key={messageIndex}
                                className={`bg-gray-800 rounded-lg p-3 flex items-center justify-between border-l-4 ${
                                  isRelevantTrain ? "bg-blue-900/30" : ""
                                }`}
                                style={{
                                  borderLeftColor: getLineColor(message.lineColor),
                                }}
                              >
                                <div className="flex items-center space-x-3">
                                  {/* PATH Logo */}
                                  <div className="relative">
                                    <svg
                                      width="32"
                                      height="24"
                                      viewBox="0 0 104 75"
                                      className="flex-shrink-0"
                                    >
                                      <g fill={getLineColor(message.lineColor)}>
                                        <path d="M 75.297,0.792 c 0,0 -0.994,4.245 -1.209,5.174 c -1.151,0 -50.824,0 -50.824,0  c -13.046,0 -15.146,9.957 -15.167,10.056 c 0.007,-0.029 -6.489,26.344 -6.489,26.344 l -0.292,1.187 L 32.517,35.9 l 0.094,-0.456  c 0.039 -0.179,3.719 -17.75,4.817 -21.155 c 0.621 -1.926,2.194 -2.02,3.75 -1.952 l 0.441,0.014 c 0,0,29.191,0,30.953,0  c -0.307,1.308 -1.475,6.282 -1.475,6.282 l 33.195,-9.055 L 75.479,0 L 75.297,0.792" />
                                        <path d="M101.033,12.585 l -30.545,8.741 l -0.099,0.427 c -0.039,0.171 -4.016,17.456 -4.72,20.882  c -0.394,1.916 -1.588,2.02 -3.369,1.964 l -0.82,-0.007 c -0.57,0.02 -20.154,0.007 -31.235,0 c 0.333 -1.322,1.581 -6.279,1.581 -6.279 L 0,46.195  l 22.956,28.716 c 0,0,5.386 -22.943,5.64 -24.029 c 1.149,0,51.258,0,51.258,0 c 13.645,0,15.412 -9.248,15.537 -10.054  c 0.012 -0.053,6.861 -28.595,6.861 -28.595 L 101.033,12.585" />
                                      </g>
                                    </svg>
                                  </div>

                                  <ArrowRight className="w-4 h-4 text-white" />

                                  {/* Destination */}
                                  <div className="flex flex-col">
                                    <div
                                      className="text-sm font-medium"
                                      style={{ color: getLineColor(message.lineColor) }}
                                    >
                                      {message.headSign}
                                    </div>
                                    {isRelevantTrain && (
                                      <div className="text-xs text-blue-400 font-medium">
                                        Your Train
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Arrival Time */}
                                <div className="flex items-center space-x-1">
                                  <div className={`text-xl font-bold ${arrivalClass(message)}`}>
                                    {formatArrivalTime(message.arrivalTimeMessage)}
                                  </div>
                                </div>
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
                <div className="text-sm text-gray-400 bg-gray-800 rounded px-3 py-2 text-center">
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
          className="text-sm text-blue-400 hover:text-blue-300 font-medium"
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
      className="bg-gray-900 text-white rounded-lg shadow-sm border border-gray-700"
    >
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <RouteIcon className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">
            Set Up Your Commute
          </h2>
        </div>
        
        <p className="text-sm text-gray-400 mb-4">
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


