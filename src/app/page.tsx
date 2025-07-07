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
import { StationCode, StationConfig } from "../types/path";
import { useMultiStationData } from "../hooks/useMultiStationData";
import { useAlerts } from "../hooks/useAlerts";
import { useGeolocation } from "../hooks/useGeolocation";
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
  const {
    closestStation,
    closestStationData,
    isLoading: locationLoading,
    isLoadingData: locationDataLoading,
    error: locationError,
    hasPermission,
    userLocation,
  } = useGeolocation();

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

  // For SSR/crawling, force neutral states to prevent soft 404 errors
  const isSSR = typeof window === "undefined";

  // Check if we have any station data with errors but cached data
  const hasStationErrors = isSSR
    ? false
    : Object.values(stationData).some((station) => station.error);
  const hasStationCachedData = isSSR
    ? false
    : Object.values(stationData).some((station) => station.hasCachedData);

  const staleness = getStalenessStatus(
    isSSR ? new Date().toISOString() : lastUpdated || lastSuccessfulUpdate,
    hasStationErrors ? "Station data may be outdated" : null,
    hasStationCachedData || (isSSR ? false : alertsHasCachedData)
  );

  // Don't render until we've loaded from localStorage
  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-4xl p-4 space-y-4">
        <div className="text-center text-gray-500">
          Loading your saved stations...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4 space-y-4">
      {/* SEO-friendly description for crawlers */}
      {isSSR && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-blue-900 mb-3">
            Real-time PATH Train Arrivals
          </h1>
          <p className="text-blue-800 mb-4">
            Track live PATH train arrivals across New York and New Jersey. Get
            real-time updates for all PATH stations including Newark, Jersey
            City, Hoboken, and Manhattan destinations.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <h3 className="font-semibold mb-2">Features:</h3>
              <ul className="space-y-1">
                <li>• Real-time train arrival information</li>
                <li>• All PATH stations supported</li>
                <li>• Live service alerts and updates</li>
                <li>• Location-based closest station finder</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Stations Covered:</h3>
              <ul className="space-y-1">
                <li>• Newark, Harrison, Journal Square</li>
                <li>• Grove Street, Exchange Place, Newport</li>
                <li>• Hoboken, Christopher Street, 9th Street</li>
                <li>• 14th Street, 23rd Street, 33rd Street, WTC</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Prominent Last Updated Ribbon */}
      <StatusRibbon
        staleness={staleness}
        prettyTime={prettyTime || prettySuccessfulTime}
        loading={false}
      />

      {/* Alerts Card */}
      <AlertsCard
        alerts={alerts}
        loading={isSSR ? false : alertsLoading}
        error={isSSR ? null : alertsError}
        hasCachedData={isSSR ? false : alertsHasCachedData}
      />

      {/* Weather Widget - Only show if user has granted location permission */}
      {!isSSR && hasPermission && userLocation && (
        <WeatherWidget userLocation={userLocation} />
      )}

      {/* Closest Station Card - Only show if user has granted location permission */}
      {!isSSR && hasPermission && closestStation && (
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
                  loading={isSSR ? false : data?.loading || false}
                  error={isSSR ? null : data?.error || null}
                  hasCachedData={isSSR ? false : data?.hasCachedData || false}
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
