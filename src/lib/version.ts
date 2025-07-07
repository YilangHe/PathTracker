// Version management for cache busting and update tracking
export const APP_VERSION =
  process.env.NEXT_PUBLIC_APP_VERSION || Date.now().toString();
export const BUILD_TIME =
  process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString();

// Cache configuration
export const CACHE_CONFIG = {
  // Service Worker cache names
  STATIC_CACHE: `path-tracker-static-v${APP_VERSION}`,
  RUNTIME_CACHE: `path-tracker-runtime-v${APP_VERSION}`,

  // Cache durations (in seconds)
  STATIC_ASSETS: 24 * 60 * 60, // 1 day
  DYNAMIC_CONTENT: 5 * 60, // 5 minutes
  API_RESPONSES: 1 * 60, // 1 minute

  // Update check intervals (in milliseconds)
  UPDATE_CHECK_INTERVAL: 30 * 60 * 1000, // 30 minutes
  VISIBILITY_CHECK_DELAY: 5000, // 5 seconds
} as const;

// Utility functions for version management
export const getAppVersion = () => APP_VERSION;
export const getBuildTime = () => BUILD_TIME;

export const isVersionNewer = (
  currentVersion: string,
  newVersion: string
): boolean => {
  // Compare versions (assuming timestamp-based versions)
  return parseInt(newVersion) > parseInt(currentVersion);
};

export const formatVersion = (version: string): string => {
  // Convert timestamp to readable format
  try {
    const timestamp = parseInt(version);
    return new Date(timestamp).toLocaleString();
  } catch {
    return version;
  }
};

// Development helpers
export const logVersionInfo = () => {
  if (process.env.NODE_ENV === "development") {
    console.group("🔄 App Version Info");
    console.log("Version:", getAppVersion());
    console.log("Build Time:", getBuildTime());
    console.log("Cache Names:", {
      static: CACHE_CONFIG.STATIC_CACHE,
      runtime: CACHE_CONFIG.RUNTIME_CACHE,
    });
    console.groupEnd();
  }
};
