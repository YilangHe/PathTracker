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

export const RAW_API_URL = "https://panynj.gov/bin/portauthority/ridepath.json";
export const PROXY_API_URL = `https://corsproxy.io/?${RAW_API_URL}`;

export const ALERTS_API_URL =
  "https://www.panynj.gov/bin/portauthority/everbridge/incidents?status=All&department=Path";
export const ALERTS_PROXY_URL = `https://corsproxy.io/?${encodeURIComponent(
  ALERTS_API_URL
)}`;

export const POLLING_INTERVAL = 10_000; // 10 seconds
