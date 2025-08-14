import { fetchAlerts } from "@/services/pathApi";
import { Alert } from "@/types/path";

export interface AlertsData {
  alerts: Alert[];
  lastUpdated: string;
  error: string | null;
}

export async function getAlertsData(): Promise<AlertsData> {
  try {
    const response = await fetchAlerts();
    
    if (response.status === "Success" && response.data) {
      return {
        alerts: response.data,
        lastUpdated: new Date().toISOString(),
        error: null,
      };
    }
    
    return {
      alerts: [],
      lastUpdated: new Date().toISOString(),
      error: "No alerts data available",
    };
  } catch (error) {
    console.error("Failed to fetch alerts on server:", error);
    
    // Return empty data with error for initial load
    return {
      alerts: [],
      lastUpdated: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Failed to fetch alerts",
    };
  }
}

// Cache alerts data in memory for 5 minutes to reduce API calls
let cachedData: AlertsData | null = null;
let cacheTime: number = 0;
const CACHE_DURATION = 300000; // 5 minutes

export async function getCachedAlertsData(): Promise<AlertsData> {
  const now = Date.now();
  
  // Return cached data if it's still fresh
  if (cachedData && (now - cacheTime) < CACHE_DURATION) {
    return cachedData;
  }
  
  // Fetch new data
  const newData = await getAlertsData();
  
  // Update cache only if fetch was successful
  if (!newData.error || newData.alerts.length > 0) {
    cachedData = newData;
    cacheTime = now;
  } else if (cachedData) {
    // If fetch failed but we have cached data, return cached data with updated error
    return {
      ...cachedData,
      error: newData.error,
    };
  }
  
  return newData;
}