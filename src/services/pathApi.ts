import { RidePathResponse, AlertsResponse } from "../types/path";
import {
  RAW_API_URL,
  PROXY_API_URL,
  ALERTS_API_URL,
  ALERTS_PROXY_URL,
} from "../constants/stations";

export const fetchRidePath = async (): Promise<RidePathResponse> => {
  const attempt = async (url: string) => {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
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
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  };

  try {
    return await attempt(ALERTS_API_URL);
  } catch {
    return await attempt(ALERTS_PROXY_URL);
  }
};
