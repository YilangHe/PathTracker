import { StationCode, CommuteRoute, RouteSegment, PathLine } from "@/types/path";
import { PATH_LINES, TRANSFER_STATIONS, STATIONS } from "@/constants/stations";

export interface RouteOption {
  route: CommuteRoute;
  score: number; // Lower is better
}

/**
 * Calculate the best route between two stations
 */
export function calculateRoute(
  fromStation: StationCode,
  toStation: StationCode
): CommuteRoute | null {
  if (fromStation === toStation) {
    return null;
  }

  // Find all possible routes
  const routes = findAllRoutes(fromStation, toStation);
  
  if (routes.length === 0) {
    return null;
  }

  // Score routes and return the best one
  const scoredRoutes = routes.map(route => ({
    route,
    score: scoreRoute(route)
  }));

  scoredRoutes.sort((a, b) => a.score - b.score);
  return scoredRoutes[0].route;
}

/**
 * Find all possible routes between two stations
 */
function findAllRoutes(
  fromStation: StationCode,
  toStation: StationCode
): CommuteRoute[] {
  const routes: CommuteRoute[] = [];

  // Check for direct routes (no transfers)
  for (const line of Object.values(PATH_LINES)) {
    const directRoute = findDirectRoute(line, fromStation, toStation);
    if (directRoute) {
      routes.push(directRoute);
    }
  }

  // Check for transfer routes
  const transferRoutes = findTransferRoutes(fromStation, toStation);
  routes.push(...transferRoutes);

  return routes;
}

/**
 * Find direct route on a single line
 */
function findDirectRoute(
  line: typeof PATH_LINES[keyof typeof PATH_LINES],
  fromStation: StationCode,
  toStation: StationCode
): CommuteRoute | null {
  const stations = line.stations as readonly StationCode[];
  const fromIndex = stations.indexOf(fromStation);
  const toIndex = stations.indexOf(toStation);

  if (fromIndex === -1 || toIndex === -1) {
    return null;
  }

  const start = Math.min(fromIndex, toIndex);
  const end = Math.max(fromIndex, toIndex);
  const stationsInRoute = stations.slice(start, end + 1) as StationCode[];

  if (fromIndex > toIndex) {
    stationsInRoute.reverse();
  }

  const segment: RouteSegment = {
    line: {
      id: line.id,
      name: line.name,
      color: line.color,
      stations: [...stations],
      frequency: line.frequency,
    },
    fromStation,
    toStation,
    stations: stationsInRoute,
    color: line.color,
  };

  return {
    segments: [segment],
    totalStations: stationsInRoute.length,
    requiresTransfer: false,
    estimatedDuration: calculateEstimatedDuration([segment]),
  };
}

/**
 * Find routes that require transfers
 */
function findTransferRoutes(
  fromStation: StationCode,
  toStation: StationCode
): CommuteRoute[] {
  const routes: CommuteRoute[] = [];

  // Find all possible transfer stations
  const transferStations = Object.keys(TRANSFER_STATIONS) as StationCode[];

  for (const transferStation of transferStations) {
    if (transferStation === fromStation || transferStation === toStation) {
      continue;
    }

    // Try to find a route: fromStation -> transferStation -> toStation
    const firstSegmentRoutes = findDirectRoutesToStation(fromStation, transferStation);
    const secondSegmentRoutes = findDirectRoutesToStation(transferStation, toStation);

    for (const firstRoute of firstSegmentRoutes) {
      for (const secondRoute of secondSegmentRoutes) {
        // Make sure we're not using the same line for both segments
        if (firstRoute.segments[0].line.id !== secondRoute.segments[0].line.id) {
          const combinedRoute: CommuteRoute = {
            segments: [
              firstRoute.segments[0],
              {
                ...secondRoute.segments[0],
                isTransfer: true,
              },
            ],
            totalStations: firstRoute.totalStations + secondRoute.totalStations - 1, // -1 because transfer station is counted twice
            requiresTransfer: true,
            estimatedDuration: calculateEstimatedDuration([
              firstRoute.segments[0],
              secondRoute.segments[0],
            ]) + 3, // Add 3 minutes for transfer time
          };

          routes.push(combinedRoute);
        }
      }
    }
  }

  return routes;
}

/**
 * Find all direct routes to a specific station
 */
function findDirectRoutesToStation(
  fromStation: StationCode,
  toStation: StationCode
): CommuteRoute[] {
  const routes: CommuteRoute[] = [];

  for (const line of Object.values(PATH_LINES)) {
    const directRoute = findDirectRoute(line, fromStation, toStation);
    if (directRoute) {
      routes.push(directRoute);
    }
  }

  return routes;
}

/**
 * Score a route (lower is better)
 */
function scoreRoute(route: CommuteRoute): number {
  let score = 0;

  // Prefer routes with fewer transfers
  score += route.requiresTransfer ? 100 : 0;

  // Prefer routes with fewer total stations
  score += route.totalStations * 2;

  // Prefer routes with higher frequency lines
  const avgFrequency = route.segments.reduce((sum, segment) => sum + segment.line.frequency, 0) / route.segments.length;
  score += avgFrequency * 2;

  return score;
}

/**
 * Calculate estimated duration based on route segments
 */
function calculateEstimatedDuration(segments: RouteSegment[]): number {
  let duration = 0;

  for (const segment of segments) {
    // Estimate 2 minutes per station + frequency/2 for waiting
    const travelTime = (segment.stations.length - 1) * 2;
    const waitTime = segment.line.frequency / 2;
    duration += travelTime + waitTime;
  }

  return Math.round(duration);
}

/**
 * Get commute direction based on time of day
 */
export function getCommuteDirection(hour: number): "morning" | "evening" {
  // 2am to 2pm = morning commute (home to work)
  // 2pm to 2am = evening commute (work to home)
  return hour >= 2 && hour < 14 ? "morning" : "evening";
}

/**
 * Get time range label for commute direction
 */
export function getTimeRangeLabel(direction: "morning" | "evening"): string {
  return direction === "morning" ? "2:00 AM - 2:00 PM" : "2:00 PM - 2:00 AM";
}

/**
 * Get stations for current commute direction
 */
export function getCommuteStations(
  homeStation: StationCode,
  workStation: StationCode,
  direction: "morning" | "evening"
): { from: StationCode; to: StationCode } {
  return direction === "morning"
    ? { from: homeStation, to: workStation }
    : { from: workStation, to: homeStation };
}

/**
 * Get all stations involved in a route (including transfers)
 */
export function getAllRouteStations(route: CommuteRoute): StationCode[] {
  const allStations: StationCode[] = [];
  
  for (let i = 0; i < route.segments.length; i++) {
    const segment = route.segments[i];
    if (i === 0) {
      // First segment: add all stations
      allStations.push(...segment.stations);
    } else {
      // Subsequent segments: skip first station (it's the transfer point, already added)
      allStations.push(...segment.stations.slice(1));
    }
  }
  
  return allStations;
}