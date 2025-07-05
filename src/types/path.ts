export interface Message {
  headSign: string;
  lastUpdated: string;
  arrivalTimeMessage: string;
  secondsToArrival: string;
  target: string;
  lineColor: string;
}

export interface Destination {
  label: "ToNJ" | "ToNY";
  messages: Message[];
}

export interface StationResult {
  consideredStation: string;
  destinations: Destination[];
}

export interface RidePathResponse {
  results: StationResult[];
  lastUpdated: string;
}

export interface StalenessStatus {
  status: "fresh" | "recent" | "stale" | "very-stale" | "error" | "unknown";
  color: string;
  text: string;
}

import { STATIONS } from "../constants/stations";

export type StationCode = keyof typeof STATIONS;
