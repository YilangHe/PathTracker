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
  const attempt = async (url: string, timeout = 5000, label = "") => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      console.log(`[Alerts API] Attempting ${label}: ${url.substring(0, 50)}... (timeout: ${timeout}ms)`);
      const startTime = Date.now();
      const res = await fetch(url, { 
        cache: "no-store",
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
      const fetchTime = Date.now() - startTime;
      console.log(`[Alerts API] ${label} responded in ${fetchTime}ms with status ${res.status}`);
      
      if (!res.ok) throw new Error(getErrorMessage(res.status));
      const data = await res.json();
      console.log(`[Alerts API] ${label} succeeded with ${data.data?.length || 0} alerts`);
      return data;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.log(`[Alerts API] ${label} timed out after ${timeout}ms`);
        throw new Error('Request timeout');
      }
      console.log(`[Alerts API] ${label} failed:`, error.message);
      throw error;
    }
  };

  // Try both endpoints in parallel, return whichever succeeds first
  try {
    console.log("[Alerts API] Starting parallel fetch race...");
    return await Promise.race([
      attempt(ALERTS_API_URL, 3000, "Direct API"),
      attempt(ALERTS_PROXY_URL, 5000, "CORS Proxy")
    ]);
  } catch (error) {
    console.log("[Alerts API] Both parallel attempts failed, trying sequential fallback...");
    // If both fail, try them sequentially with longer timeout as fallback
    try {
      return await attempt(ALERTS_API_URL, 10000, "Direct API (fallback)");
    } catch {
      return await attempt(ALERTS_PROXY_URL, 10000, "CORS Proxy (fallback)");
    }
  }
};
