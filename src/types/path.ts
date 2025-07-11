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

// Alert types for the new alerts API
export interface AlertFormVariableItem {
  val: string[];
  variableName: string;
  isRequired: boolean;
  seq: number;
  variableId: number;
  prefixName: string;
}

export interface AlertIncidentMessage {
  subject: string;
  preMessage: string;
  formVariableItems: AlertFormVariableItem[];
  sysVarTodayDateFormat: string;
  sysVarCurrentTimeFormat: string;
}

export interface Alert {
  incidentMessage: AlertIncidentMessage;
  CreatedDate: string;
  ModifiedDate: string;
}

export interface AlertsResponse {
  status: string;
  data: Alert[];
}

// Multi-station management types
export interface StationConfig {
  id: string;
  stationCode: StationCode;
}

export interface StationListState {
  stations: StationConfig[];
}

// Commute feature types
export interface CommutePair {
  homeStation: StationCode;
  workStation: StationCode;
}

export interface CommuteRoute {
  segments: RouteSegment[];
  totalStations: number;
  requiresTransfer: boolean;
  estimatedDuration: number; // minutes
}

export interface RouteSegment {
  line: PathLine;
  fromStation: StationCode;
  toStation: StationCode;
  stations: StationCode[];
  color: string;
  isTransfer?: boolean;
}

export interface PathLine {
  id: string;
  name: string;
  color: string;
  stations: StationCode[];
  frequency: number; // typical minutes between trains
}

export interface CommuteDirection {
  label: "Morning Commute" | "Evening Commute";
  route: CommuteRoute;
  timeRange: string;
}
