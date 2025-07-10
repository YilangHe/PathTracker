"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { motion, AnimatePresence } from "framer-motion";
import { StationCode, StationConfig } from "../types/path";
import { useMultiStationData } from "../hooks/useMultiStationData";
import { useAlerts } from "../hooks/useAlerts";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUserPreferences } from "../contexts/UserPreferencesContext";
import { getStalenessStatus, formatTime } from "../utils/pathHelpers";
import { StatusRibbon } from "../components/StatusRibbon";
import { AlertsCard } from "../components/AlertsCard";
import { DraggableStationCard } from "../components/DraggableStationCard";
import { AddStationCard } from "../components/AddStationCard";
import { ClosestStationCard } from "../components/ClosestStationCard";
import { WeatherWidget } from "../components/WeatherWidget";

// LocalStorage keys
const STATIONS_STORAGE_KEY = "pathTracker_stations";

// Default stations configuration
const DEFAULT_STATIONS: StationConfig[] = [
  { id: "default-1", stationCode: "NWK" },
];

// LocalStorage utility functions
const saveToStorage = (key: string, value: any) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

const loadFromStorage = function <T>(key: string, defaultValue: T): T {
  try {
    if (typeof window !== "undefined") {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error);
  }
  return defaultValue;
};

// Static content component for SEO and crawlers
const StaticContent = () => (
  <div className="mx-auto max-w-4xl p-4 space-y-6">
    <div className="text-center space-y-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        PATH Train Tracker
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">
        Real-time PATH train arrivals for New York and New Jersey
      </p>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Track live train arrivals • Multiple stations • Real-time updates
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
          Features
        </h2>
        <ul className="space-y-2 text-gray-600 dark:text-gray-300">
          <li className="flex items-center">
            <span className="mr-2">🚊</span>
            Real-time train arrivals
          </li>
          <li className="flex items-center">
            <span className="mr-2">📍</span>
            Multiple station tracking
          </li>
          <li className="flex items-center">
            <span className="mr-2">🔄</span>
            Live updates every 30 seconds
          </li>
          <li className="flex items-center">
            <span className="mr-2">📱</span>
            Mobile-friendly design
          </li>
          <li className="flex items-center">
            <span className="mr-2">🌍</span>
            Location-based closest station
          </li>
        </ul>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
          PATH System
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          The PATH system connects New York City and New Jersey with 13 stations
          across 4 lines.
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>• 24/7 service between NYC and NJ</p>
          <p>• Connects to NYC subway system</p>
          <p>• Serves over 80 million riders annually</p>
        </div>
      </div>
    </div>

    <div className="text-center">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Loading your personalized train tracker...
      </div>
    </div>
  </div>
);

/**
 * PATH realtime feed UI
 *  — Multi-station support with drag-and-drop reordering
 *  — Add/remove stations dynamically
 *  — CORS‑proxy fallback
 *  — Per‑route colour bullets
 *  — Arrival heat‑map + deep‑red Delayed flag
 *  — Right‑aligned Arrival column
 *  — Friendly station list that mirrors live feed codes
 *  — Row‑level refresh with cube‑rotation animation (no full card flicker)
 *  — **Enhanced: Prominent "Last updated" ribbon in the header** (priority #1)
 *  — **NEW: PATH Alerts from Port Authority API**
 *  — **NEW: Pinned closest station card with auto-refresh**
 *  — **NEW: Multi-station dashboard with drag-and-drop**
 *  — **NEW: Persistent station configuration across browser sessions**
 */

export default function PathTracker() {
  const [stations, setStations] = useState<StationConfig[]>(DEFAULT_STATIONS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAlertsCard, setShowAlertsCard] = useState(true);

  // Load saved configuration on mount
  useEffect(() => {
    const savedStations = loadFromStorage(
      STATIONS_STORAGE_KEY,
      DEFAULT_STATIONS
    );

    setStations(savedStations);
    setIsLoaded(true);
  }, []);

  // Save stations to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STATIONS_STORAGE_KEY, stations);
    }
  }, [stations, isLoaded]);

  // Memoize stationCodes to prevent infinite re-renders
  const stationCodes = useMemo(
    () => stations.map((s) => s.stationCode),
    [stations]
  );

  const { stationData, lastUpdated, lastSuccessfulUpdate } =
    useMultiStationData(stationCodes);
  const {
    data: alerts,
    loading: alertsLoading,
    error: alertsError,
    hasCachedData: alertsHasCachedData,
  } = useAlerts();

  // Manage alerts card visibility with better UX workflow
  useEffect(() => {
    if (alertsLoading) {
      // Always show when loading
      setShowAlertsCard(true);
    } else if (alertsError || alerts.length > 0) {
      // Always show when there are alerts or errors
      setShowAlertsCard(true);
    } else {
      // No alerts - show "no alerts" status briefly, then hide
      setShowAlertsCard(true);
      const timer = setTimeout(() => {
        setShowAlertsCard(false);
      }, 1000); // Show "no alerts" for 1 second before hiding

      return () => clearTimeout(timer);
    }
  }, [alertsLoading, alertsError, alerts.length]);

  const {
    closestStation,
    closestStationData,
    isLoading: locationLoading,
    isLoadingData: locationDataLoading,
    error: locationError,
    hasPermission,
    userLocation,
  } = useGeolocation();

  const { preferences } = useUserPreferences();

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setStations((stations) => {
        const oldIndex = stations.findIndex(
          (station) => station.id === active.id
        );
        const newIndex = stations.findIndex(
          (station) => station.id === over?.id
        );

        return arrayMove(stations, oldIndex, newIndex);
      });
    }
  }, []);

  const handleAddStation = useCallback((stationCode: StationCode) => {
    const newStation: StationConfig = {
      id: `station-${Date.now()}`,
      stationCode,
    };
    setStations((prev) => [...prev, newStation]);
  }, []);

  const handleRemoveStation = useCallback((stationId: string) => {
    setStations((prev) => prev.filter((station) => station.id !== stationId));
  }, []);

  const handleMoveStationUp = useCallback((stationId: string) => {
    setStations((prev) => {
      const index = prev.findIndex((station) => station.id === stationId);
      if (index > 0) {
        return arrayMove(prev, index, index - 1);
      }
      return prev;
    });
  }, []);

  const handleMoveStationDown = useCallback((stationId: string) => {
    setStations((prev) => {
      const index = prev.findIndex((station) => station.id === stationId);
      if (index < prev.length - 1) {
        return arrayMove(prev, index, index + 1);
      }
      return prev;
    });
  }, []);

  const prettyTime = formatTime(lastUpdated);
  const prettySuccessfulTime = formatTime(lastSuccessfulUpdate);

  // Check if we have any station data with errors but cached data
  const hasStationErrors = Object.values(stationData).some(
    (station) => station.error
  );
  const hasStationCachedData = Object.values(stationData).some(
    (station) => station.hasCachedData
  );

  const staleness = getStalenessStatus(
    lastUpdated || lastSuccessfulUpdate,
    hasStationErrors ? "Station data may be outdated" : null,
    hasStationCachedData || alertsHasCachedData
  );

  // Show static content until JavaScript loads and data is available
  if (!isLoaded) {
    return <StaticContent />;
  }

  return (
    <div className="mx-auto max-w-4xl p-4 space-y-4">
      {/* Prominent Last Updated Ribbon */}
      <StatusRibbon
        staleness={staleness}
        prettyTime={prettyTime || prettySuccessfulTime}
        loading={false}
      />

      {/* Alerts Card */}
      <AnimatePresence>
        {showAlertsCard && (
          <motion.div
            key="alerts-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <AlertsCard
              alerts={alerts}
              loading={alertsLoading}
              error={alertsError}
              hasCachedData={alertsHasCachedData}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weather Widget - Only show if user has granted location permission and enabled it in preferences */}
      {hasPermission && userLocation && preferences.showWeatherWidget && (
        <WeatherWidget userLocation={userLocation} />
      )}

      {/* Closest Station Card - Only show if user has granted location permission */}
      {hasPermission && closestStation && (
        <ClosestStationCard
          stationCode={closestStation}
          data={closestStationData}
          loading={locationLoading}
          error={locationError}
          userLocation={userLocation}
        />
      )}

      {/* Draggable Station Cards */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={stations.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {stations.map((station, index) => {
              const data = stationData[station.stationCode];

              return (
                <DraggableStationCard
                  key={station.id}
                  id={station.id}
                  stationCode={station.stationCode}
                  data={data?.data || null}
                  loading={data?.loading || false}
                  error={data?.error || null}
                  hasCachedData={data?.hasCachedData || false}
                  onRemove={
                    stations.length > 1 ? handleRemoveStation : undefined
                  }
                  onMoveUp={index > 0 ? handleMoveStationUp : undefined}
                  onMoveDown={
                    index < stations.length - 1
                      ? handleMoveStationDown
                      : undefined
                  }
                  stationId={station.id}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add Station Card */}
      <AddStationCard
        onAddStation={handleAddStation}
        existingStations={stationCodes}
      />
    </div>
  );
}
