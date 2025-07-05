import { Message, StalenessStatus, StationCode } from "../types/path";
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

export const arrivalClass = (message: Message): string =>
  message.arrivalTimeMessage.toLowerCase().includes("delay")
    ? "text-red-500 font-semibold"
    : heat(parseInt(message.secondsToArrival, 10));

export const getStalenessStatus = (
  lastUpdated: string | null,
  error: string | null
): StalenessStatus => {
  if (error) {
    return {
      status: "error",
      color: "bg-red-500",
      text: "Error",
    };
  }

  if (!lastUpdated) {
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

export const formatTime = (timestamp: string | null): string => {
  if (!timestamp) return "Unknown";
  return new Date(timestamp).toLocaleTimeString();
};

// Geolocation utility functions
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
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
