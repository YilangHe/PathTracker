export const STATIONS = {
  NWK: "Newark",
  HAR: "Harrison",
  JSQ: "Journal Square",
  GRV: "Grove Street",
  NEW: "Newport",
  EXP: "Exchange Place",
  HOB: "Hoboken",
  WTC: "World Trade Center",
  CHR: "Christopher St",
  "09S": "9th Street",
  "14S": "14th Street",
  "23S": "23rd Street",
  "33S": "33rd Street",
} as const;

// Station coordinates (latitude, longitude)
export const STATION_COORDINATES = {
  NWK: [40.7357, -74.1635], // Newark
  HAR: [40.7394, -74.1555], // Harrison
  JSQ: [40.7332, -74.0627], // Journal Square
  GRV: [40.7195, -74.0434], // Grove Street
  NEW: [40.7268, -74.0341], // Newport
  EXP: [40.7167, -74.033], // Exchange Place
  HOB: [40.7363, -74.0279], // Hoboken
  WTC: [40.7126, -74.0113], // World Trade Center
  CHR: [40.7338, -74.007], // Christopher St
  "09S": [40.7344, -74.0048], // 9th Street
  "14S": [40.7374, -74.0061], // 14th Street
  "23S": [40.7429, -74.0067], // 23rd Street
  "33S": [40.7489, -74.0063], // 33rd Street
} as const;

export const RAW_API_URL = "https://panynj.gov/bin/portauthority/ridepath.json";
export const PROXY_API_URL = `https://corsproxy.io/?${RAW_API_URL}`;

export const ALERTS_API_URL =
  "https://www.panynj.gov/bin/portauthority/everbridge/incidents?status=All&department=Path";
export const ALERTS_PROXY_URL = `https://corsproxy.io/?${encodeURIComponent(
  ALERTS_API_URL
)}`;

export const POLLING_INTERVAL = 10_000; // 10 seconds for station data
export const ALERTS_POLLING_INTERVAL = 30_000; // 30 seconds for alerts
