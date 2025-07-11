"use client";

import React, { useState } from "react";
import { StationCode, CommutePair } from "@/types/path";
import { STATIONS } from "@/constants/stations";
import { useCommute } from "@/contexts/CommuteContext";
import { calculateRoute, getCommuteStations } from "@/utils/routeCalculator";
import { Home, Briefcase, ArrowRight, MapPin, Clock, Route } from "lucide-react";

export function CommutePlanner() {
  const { commutePair, setCommutePair, clearCommute } = useCommute();
  
  const [homeStation, setHomeStation] = useState<StationCode | "">(
    commutePair?.homeStation || ""
  );
  const [workStation, setWorkStation] = useState<StationCode | "">(
    commutePair?.workStation || ""
  );
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = () => {
    if (homeStation && workStation && homeStation !== workStation) {
      const newCommutePair: CommutePair = {
        homeStation: homeStation as StationCode,
        workStation: workStation as StationCode,
      };
      setCommutePair(newCommutePair);
      setShowPreview(false);
    }
  };

  const handlePreview = () => {
    if (homeStation && workStation && homeStation !== workStation) {
      setShowPreview(true);
    }
  };

  const handleClear = () => {
    clearCommute();
    setHomeStation("");
    setWorkStation("");
    setShowPreview(false);
  };

  // Calculate preview routes
  const morningRoute = homeStation && workStation && homeStation !== workStation
    ? calculateRoute(homeStation as StationCode, workStation as StationCode)
    : null;
    
  const eveningRoute = homeStation && workStation && homeStation !== workStation
    ? calculateRoute(workStation as StationCode, homeStation as StationCode)
    : null;

  const isValid = homeStation && workStation && homeStation !== workStation;
  const isConfigured = commutePair !== null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Route className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Commute Setup
          </h2>
        </div>
        
        {isConfigured && (
          <button
            onClick={handleClear}
            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
          >
            Clear Commute
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Station Selection */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Home Station */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Home className="w-4 h-4" />
              <span>Home Station</span>
            </label>
            <select
              value={homeStation}
              onChange={(e) => setHomeStation(e.target.value as StationCode | "")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select home station</option>
              {Object.entries(STATIONS).map(([code, name]) => (
                <option key={code} value={code} disabled={code === workStation}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Work Station */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Briefcase className="w-4 h-4" />
              <span>Work Station</span>
            </label>
            <select
              value={workStation}
              onChange={(e) => setWorkStation(e.target.value as StationCode | "")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select work station</option>
              {Object.entries(STATIONS).map(([code, name]) => (
                <option key={code} value={code} disabled={code === homeStation}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {!isConfigured && (
            <>
              <button
                onClick={handlePreview}
                disabled={!isValid}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 disabled:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:disabled:bg-gray-800 dark:text-gray-300 dark:disabled:text-gray-500 rounded-md font-medium transition-colors"
              >
                Preview Routes
              </button>
              <button
                onClick={handleSave}
                disabled={!isValid}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white disabled:text-blue-100 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-800 rounded-md font-medium transition-colors"
              >
                Save Commute
              </button>
            </>
          )}
          
          {isConfigured && (
            <button
              onClick={handleSave}
              disabled={!isValid}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white disabled:text-blue-100 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-blue-800 rounded-md font-medium transition-colors"
            >
              Update Commute
            </button>
          )}
        </div>

        {/* Current Configuration */}
        {isConfigured && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Commute Configured
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-green-700 dark:text-green-300">
              <Home className="w-4 h-4" />
              <span>{STATIONS[commutePair.homeStation]}</span>
              <ArrowRight className="w-4 h-4" />
              <Briefcase className="w-4 h-4" />
              <span>{STATIONS[commutePair.workStation]}</span>
            </div>
          </div>
        )}

        {/* Route Preview */}
        {showPreview && morningRoute && eveningRoute && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Route Preview
            </h3>
            
            {/* Morning Commute Preview */}
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Morning Commute (2:00 AM - 2:00 PM)
                </span>
              </div>
              <RoutePreview route={morningRoute} />
            </div>

            {/* Evening Commute Preview */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                  Evening Commute (2:00 PM - 2:00 AM)
                </span>
              </div>
              <RoutePreview route={eveningRoute} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RoutePreview({ route }: { route: any }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          {route.requiresTransfer ? "With transfer" : "Direct route"}
        </span>
        <span className="text-gray-400">•</span>
        <span className="text-gray-600 dark:text-gray-400">
          ~{route.estimatedDuration} minutes
        </span>
        <span className="text-gray-400">•</span>
        <span className="text-gray-600 dark:text-gray-400">
          {route.totalStations} stations
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {route.segments.map((segment: any, index: number) => (
          <div key={index} className="flex items-center space-x-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: segment.color }}
            ></div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {segment.line.name}
            </span>
            {index < route.segments.length - 1 && (
              <ArrowRight className="w-3 h-3 text-gray-400 ml-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}