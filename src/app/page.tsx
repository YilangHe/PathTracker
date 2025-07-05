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
import { MapPin, Navigation } from "lucide-react";
import { StationCode, StationConfig } from "../types/path";
import { useMultiStationData } from "../hooks/useMultiStationData";
import { useAlerts } from "../hooks/useAlerts";
import { useGeolocation } from "../hooks/useGeolocation";
import { getStalenessStatus, formatTime } from "../utils/pathHelpers";
import { StatusRibbon } from "../components/StatusRibbon";
import { AlertsCard } from "../components/AlertsCard";
import { DraggableStationCard } from "../components/DraggableStationCard";
import { AddStationCard } from "../components/AddStationCard";

// LocalStorage keys
const STATIONS_STORAGE_KEY = "pathTracker_stations";
const AUTO_SELECTED_STORAGE_KEY = "pathTracker_hasAutoSelected";

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
 *  — **NEW: Auto-select closest station based on user location**
 *  — **NEW: Multi-station dashboard with drag-and-drop**
 *  — **NEW: Persistent station configuration across browser sessions**
 */

export default function PathTracker() {
  const [stations, setStations] = useState<StationConfig[]>(DEFAULT_STATIONS);
  const [hasAutoSelected, setHasAutoSelected] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved configuration on mount
  useEffect(() => {
    const savedStations = loadFromStorage(
      STATIONS_STORAGE_KEY,
      DEFAULT_STATIONS
    );
    const savedHasAutoSelected = loadFromStorage(
      AUTO_SELECTED_STORAGE_KEY,
      false
    );

    setStations(savedStations);
    setHasAutoSelected(savedHasAutoSelected);
    setIsLoaded(true);
  }, []);

  // Save stations to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STATIONS_STORAGE_KEY, stations);
    }
  }, [stations, isLoaded]);

  // Save hasAutoSelected to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(AUTO_SELECTED_STORAGE_KEY, hasAutoSelected);
    }
  }, [hasAutoSelected, isLoaded]);

  // Memoize stationCodes to prevent infinite re-renders
  const stationCodes = useMemo(
    () => stations.map((s) => s.stationCode),
    [stations]
  );

  const { stationData, lastUpdated } = useMultiStationData(stationCodes);
  const {
    data: alerts,
    loading: alertsLoading,
    error: alertsError,
  } = useAlerts();
  const {
    closestStation,
    isLoading: locationLoading,
    error: locationError,
    hasPermission,
    requestLocation,
  } = useGeolocation();

  // Auto-select closest station when detected (only once)
  useEffect(() => {
    if (closestStation && !hasAutoSelected && isLoaded) {
      setStations((prev) =>
        prev.map((station) =>
          station.id === "default-1"
            ? { ...station, stationCode: closestStation, isClosest: true }
            : station
        )
      );
      setHasAutoSelected(true);
    }
  }, [closestStation, hasAutoSelected, isLoaded]);

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

  const prettyTime = formatTime(lastUpdated);
  const staleness = getStalenessStatus(lastUpdated, null);

  const renderLocationStatus = () => {
    if (locationLoading) {
      return (
        <div className="flex items-center gap-2 text-sm text-blue-400 bg-blue-900/20 px-3 py-2 rounded-md">
          <Navigation className="w-4 h-4 animate-spin" />
          <span>Finding your closest station...</span>
        </div>
      );
    }

    if (locationError) {
      return (
        <div className="flex items-center gap-2 text-sm text-amber-400 bg-amber-900/20 px-3 py-2 rounded-md">
          <MapPin className="w-4 h-4" />
          <span>Unable to detect location</span>
          <button
            onClick={requestLocation}
            className="text-amber-300 hover:text-amber-100 underline ml-2"
          >
            Try again
          </button>
        </div>
      );
    }

    if (hasPermission && hasAutoSelected) {
      return (
        <div className="flex items-center gap-2 text-sm text-green-400 bg-green-900/20 px-3 py-2 rounded-md">
          <MapPin className="w-4 h-4" />
          <span>Auto-selected closest station to your location</span>
        </div>
      );
    }

    return null;
  };

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
      {/* Prominent Last Updated Ribbon */}
      <StatusRibbon
        staleness={staleness}
        prettyTime={prettyTime}
        loading={false}
      />

      <h1 className="text-3xl font-bold text-center">RidePATH Arrivals</h1>

      <div className="text-center text-sm text-gray-500">
        {stations.length === 1 ? "1 station" : `${stations.length} stations`} •
        Drag cards to reorder • Click + to add more
      </div>

      {/* Location Status */}
      {renderLocationStatus()}

      {/* Alerts Card */}
      <AlertsCard alerts={alerts} loading={alertsLoading} error={alertsError} />

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
            {stations.map((station) => {
              const data = stationData[station.stationCode];
              const isClosest =
                closestStation === station.stationCode && hasPermission;

              return (
                <DraggableStationCard
                  key={station.id}
                  id={station.id}
                  stationCode={station.stationCode}
                  data={data?.data || null}
                  loading={data?.loading || false}
                  error={data?.error || null}
                  isClosest={isClosest}
                  onRemove={
                    stations.length > 1 ? handleRemoveStation : undefined
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

      <footer className="text-center text-xs text-gray-500 pt-4">
        Data © Port Authority of NY & NJ · updates every 10 s
      </footer>
    </div>
  );
}
