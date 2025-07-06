import { RidePathResponse, AlertsResponse } from "../types/path";
import {
  RAW_API_URL,
  PROXY_API_URL,
  ALERTS_API_URL,
  ALERTS_PROXY_URL,
} from "../constants/stations";

// Helper function to convert HTTP status codes to user-friendly messages
const getErrorMessage = (status: number): string => {
  switch (status) {
    case 403:
      return "Access temporarily restricted. Please try again later.";
    case 404:
      return "PATH service temporarily unavailable.";
    case 500:
      return "PATH server is experiencing issues. Please try again later.";
    case 502:
    case 503:
      return "PATH service is temporarily down for maintenance.";
    case 504:
      return "PATH service is taking too long to respond.";
    default:
      return "Unable to connect to PATH service. Please try again later.";
  }
};

export const fetchRidePath = async (): Promise<RidePathResponse> => {
  const attempt = async (url: string) => {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(getErrorMessage(res.status));
    return res.json();
  };

  try {
    return await attempt(RAW_API_URL);
  } catch {
    return await attempt(PROXY_API_URL);
  }
};

export const fetchAlerts = async (): Promise<AlertsResponse> => {
  const attempt = async (url: string) => {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(getErrorMessage(res.status));
    return res.json();
  };

  try {
    return await attempt(ALERTS_API_URL);
  } catch {
    return await attempt(ALERTS_PROXY_URL);
  }
};
