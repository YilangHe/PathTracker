import { Message, StalenessStatus, StationCode, Alert } from "../types/path";
import { STATION_COORDINATES } from "../constants/stations";

export const getLineColor = (raw: string): string => {
  const [first] = raw.split(",").map((c) => c.trim());
  return first ? (first.startsWith("#") ? first : `#${first}`) : "#666";
};

const heat = (seconds: number): string => {
  if (seconds < 120) return "text-red-400";
  if (seconds < 300) return "text-orange-400";
  if (seconds < 600) return "text-yellow-400";
  return "text-green-400";
};

export const formatMessage = (msg: Message): string => {
  return `${msg.target} ${msg.secondsToArrival}"`;
};

export const arrivalClass = (message: Message): string =>
  message.arrivalTimeMessage.toLowerCase().includes("delay")
    ? "text-red-500 font-semibold"
    : heat(parseInt(message.secondsToArrival, 10));

export const formatArrivalTime = (
  arrivalTimeMessage: string, 
  tNow?: string
): string => {
  // Parse the numeric value from the arrival time message
  const timeMatch = arrivalTimeMessage.match(/(\d+)/);

  if (timeMatch) {
    const minutes = parseInt(timeMatch[1], 10);

    // If it's 0 minutes, show "Now"
    if (minutes === 0) {
      return tNow || "Now";
    }

    // Apply -1 offset for times greater than 0
    const adjustedMinutes = Math.max(0, minutes - 1);

    // If after adjustment it becomes 0, show "Now"
    if (adjustedMinutes === 0) {
      return tNow || "Now";
    }

    // Return the adjusted time with the same format
    return arrivalTimeMessage.replace(/\d+/, adjustedMinutes.toString());
  }

  // If no numeric value found, return original message
  return arrivalTimeMessage;
};

// Data caching utilities
const CACHE_KEYS = {
  STATION_DATA: "pathTracker_stationData",
  ALERTS_DATA: "pathTracker_alertsData",
  LAST_SUCCESSFUL_UPDATE: "pathTracker_lastSuccessfulUpdate",
} as const;

export const cacheData = (key: string, data: any, timestamp?: string) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        key,
        JSON.stringify({
          data,
          timestamp: timestamp || new Date().toISOString(),
          cachedAt: new Date().toISOString(),
        })
      );
    }
  } catch (error) {
    console.error("Error caching data:", error);
  }
};

export const getCachedData = (key: string, maxAge?: number) => {
  try {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(key);
      if (cached) {
        const parsed = JSON.parse(cached);
        
        // Check if cache is expired (default 10 minutes for alerts, 5 minutes for other data)
        if (maxAge) {
          const cacheAge = Date.now() - new Date(parsed.cachedAt).getTime();
          if (cacheAge > maxAge) {
            localStorage.removeItem(key);
            return null;
          }
        }
        
        return {
          data: parsed.data,
          timestamp: parsed.timestamp,
          cachedAt: parsed.cachedAt,
        };
      }
    }
  } catch (error) {
    console.error("Error loading cached data:", error);
  }
  return null;
};

export const cacheStationData = (stationData: any, timestamp: string) => {
  cacheData(CACHE_KEYS.STATION_DATA, stationData, timestamp);
};

export const getCachedStationData = () => {
  return getCachedData(CACHE_KEYS.STATION_DATA);
};

export const cacheAlertsData = (alertsData: Alert[], timestamp: string) => {
  cacheData(CACHE_KEYS.ALERTS_DATA, alertsData, timestamp);
};

export const getCachedAlertsData = (): { data: Alert[]; timestamp: string; cachedAt?: string } | null => {
  // Allow alerts cache to live for 10 minutes
  return getCachedData(CACHE_KEYS.ALERTS_DATA, 10 * 60 * 1000);
};

export const getStalenessStatus = (
  lastUpdated: string | null,
  error: string | null,
  hasCachedData: boolean = false
): StalenessStatus => {
  if (error) {
    if (hasCachedData) {
      return {
        status: "error",
        color: "bg-orange-500",
        text: "Using cached data",
      };
    }
    return {
      status: "error",
      color: "bg-red-500",
      text: "Error",
    };
  }

  if (!lastUpdated) {
    if (hasCachedData) {
      return {
        status: "unknown",
        color: "bg-orange-500",
        text: "Using cached data",
      };
    }
    return {
      status: "unknown",
      color: "bg-gray-500",
      text: "Unknown",
    };
  }

  const now = new Date();
  const updated = new Date(lastUpdated);
  const diff = now.getTime() - updated.getTime();

  if (diff < 30_000) {
    return {
      status: "fresh",
      color: "bg-green-500",
      text: "Live",
    };
  }

  if (diff < 60_000) {
    return {
      status: "recent",
      color: "bg-yellow-500",
      text: "Recent",
    };
  }

  if (diff < 120_000) {
    return {
      status: "stale",
      color: "bg-orange-500",
      text: "Stale",
    };
  }

  return {
    status: "very-stale",
    color: "bg-red-500",
    text: "Very Stale",
  };
};

export const formatTime = (lastUpdated: string | null): string | null => {
  if (!lastUpdated) return null;
  const updated = new Date(lastUpdated);
  return updated.toLocaleString();
};

// Calculate distance between two points using Haversine formula
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const findClosestStation = (
  userLat: number,
  userLon: number
): StationCode => {
  let closestStation: StationCode = "NWK";
  let minDistance = Infinity;

  Object.entries(STATION_COORDINATES).forEach(([code, coords]) => {
    const [stationLat, stationLon] = coords;
    const distance = calculateDistance(
      userLat,
      userLon,
      stationLat,
      stationLon
    );
    if (distance < minDistance) {
      minDistance = distance;
      closestStation = code as StationCode;
    }
  });

  return closestStation;
};
