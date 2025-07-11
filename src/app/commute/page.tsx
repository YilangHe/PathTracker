"use client";

import React from "react";
import { CommutePlanner } from "@/components/CommutePlanner";
import { CommuteCard } from "@/components/CommuteCard";
import { useCommute } from "@/contexts/CommuteContext";
import { Route, Clock, Train } from "lucide-react";

export default function CommutePage() {
  const { isCommuteConfigured } = useCommute();

  return (
    <div className="mx-auto max-w-4xl p-4 space-y-6">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Route className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Commute Planner
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Set up your daily commute between home and work. We'll automatically show you the right 
          direction based on the time of day and handle transfers when needed.
        </p>
      </div>

      {/* Features Overview */}
      {!isCommuteConfigured && (
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-medium text-blue-900 dark:text-blue-100">
                Time-Based Direction
              </h3>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Automatically shows home→work (2AM-2PM) or work→home (2PM-2AM) based on current time.
            </p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-2 mb-2">
              <Route className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h3 className="font-medium text-green-900 dark:text-green-100">
                Smart Routing
              </h3>
            </div>
            <p className="text-sm text-green-800 dark:text-green-200">
              Calculates the best route with transfers when needed and shows all required trains.
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center space-x-2 mb-2">
              <Train className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-medium text-purple-900 dark:text-purple-100">
                Live Arrivals
              </h3>
            </div>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              Shows real-time arrival information for each train you need to take.
            </p>
          </div>
        </div>
      )}

      {/* Commute Setup */}
      <CommutePlanner />

      {/* Active Commute Display */}
      {isCommuteConfigured && (
        <CommuteCard />
      )}

      {/* Help Information */}
      {!isCommuteConfigured && (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
            How it works
          </h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong>1. Set your stations:</strong> Choose your home station and work station from the dropdown menus.
            </p>
            <p>
              <strong>2. Preview routes:</strong> See how your commute will work in both directions, including any required transfers.
            </p>
            <p>
              <strong>3. Save your commute:</strong> Your preferences are saved locally and will automatically show the right direction.
            </p>
            <p>
              <strong>4. View live arrivals:</strong> Get real-time train information for your current commute direction.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}