"use client";
import { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Loader2, Train } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * PATH realtime feed UI
 *  — CORS‑proxy fallback
 *  — Per‑route colour bullets
 *  — Arrival heat‑map + deep‑red Delayed flag
 *  — Right‑aligned Arrival column
 *  — Friendly station list that mirrors live feed codes
 *  — Row‑level refresh with cube‑rotation animation (no full card flicker)
 *  — **NEW: "Last updated" ribbon in the header** (priority #1)
 */

const RAW_API_URL = "https://panynj.gov/bin/portauthority/ridepath.json";
const PROXY_API_URL = `https://corsproxy.io/?${RAW_API_URL}`;

const STATIONS = {
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

type StationCode = keyof typeof STATIONS;

interface Message {
  headSign: string;
  lastUpdated: string;
  arrivalTimeMessage: string;
  secondsToArrival: string;
  target: string;
  lineColor: string;
}

interface Destination {
  label: "ToNJ" | "ToNY";
  messages: Message[];
}

interface StationResult {
  consideredStation: string;
  destinations: Destination[];
}

interface RidePathResponse {
  results: StationResult[];
  lastUpdated: string;
}

const fetchRidePath = async (): Promise<RidePathResponse> => {
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

const getLineColor = (raw: string): string => {
  const [first] = raw.split(",").map((c) => c.trim());
  return first ? (first.startsWith("#") ? first : `#${first}`) : "#666";
};

const heat = (secs: number) =>
  isNaN(secs)
    ? ""
    : secs <= 300
    ? "text-green-400"
    : secs <= 600
    ? "text-yellow-400"
    : "text-red-400";

const arrivalClass = (m: Message) =>
  m.arrivalTimeMessage.toLowerCase().includes("delay")
    ? "text-red-500 font-semibold"
    : heat(parseInt(m.secondsToArrival, 10));

export default function PathTracker() {
  const [station, setStation] = useState<StationCode>("NWK");
  const [data, setData] = useState<StationResult | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const json = await fetchRidePath();
      const found = json.results.find((s) => s.consideredStation === station);
      setData((prev) =>
        JSON.stringify(prev) === JSON.stringify(found) ? prev : found ?? null
      );
      setLastUpdated(json.lastUpdated);
      setError(null);
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "Fetch failed");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [station]);

  // initial + 10‑s polling
  useEffect(() => {
    setLoading(true);
    load();
    const id = setInterval(load, 10_000);
    return () => clearInterval(id);
  }, [load]);

  const prettyTime = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : null;

  return (
    <div className="mx-auto max-w-2xl p-4 space-y-4">
      <h1 className="text-3xl font-bold text-center">RidePATH Arrivals</h1>

      {/* Station selector */}
      <Select
        value={station}
        onValueChange={(v) => setStation(v as StationCode)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select station" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(STATIONS).map(([code, name]) => (
            <SelectItem key={code} value={code} className="capitalize">
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Card className="bg-gray-900 text-white">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold capitalize">
                {STATIONS[station] ?? station}
              </span>
              {loading && <Loader2 className="animate-spin" />}
            </div>
            {prettyTime && (
              <span className="text-xs text-gray-400">
                Last updated: {prettyTime}
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

          {!error && data && (
            <div className="space-y-4">
              {data.destinations.map((dest) => (
                <div key={dest.label} className="bg-gray-800 rounded-xl p-3">
                  <div className="flex items-center mb-2 gap-2">
                    <Train size={18} />
                    <h2 className="font-medium">
                      {dest.label === "ToNJ" ? "To New Jersey" : "To New York"}
                    </h2>
                  </div>
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-gray-400">
                        <th className="py-1">Destination</th>
                        <th className="py-1 text-right pr-5">Arrival</th>
                      </tr>
                    </thead>
                    <AnimatePresence initial={false} mode="popLayout">
                      <tbody>
                        {dest.messages.map((m) => (
                          <motion.tr
                            layout
                            key={`${m.headSign}-${m.secondsToArrival}`}
                            initial={{ opacity: 0, rotateX: 90 }}
                            animate={{ opacity: 1, rotateX: 0 }}
                            exit={{ opacity: 0, rotateX: -90 }}
                            transition={{ duration: 0.45, ease: "easeInOut" }}
                            className="border-t border-gray-700 h-8 origin-top"
                          >
                            <td className="py-1 capitalize">
                              <span
                                className="inline-block w-3 h-3 rounded-full mr-2 align-middle"
                                style={{
                                  background: getLineColor(m.lineColor),
                                }}
                              />
                              {m.headSign}
                            </td>
                            <td
                              className={`py-1 text-right pr-5 ${arrivalClass(
                                m
                              )}`}
                            >
                              {m.arrivalTimeMessage}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </AnimatePresence>
                  </table>
                </div>
              ))}
            </div>
          )}

          {!error && !data && (
            <p className="text-gray-400">
              No arrivals scheduled for this station at the moment.
            </p>
          )}
        </CardContent>
      </Card>

      <footer className="text-center text-xs text-gray-500 pt-4">
        Data © Port Authority of NY & NJ · updates every 10 s
      </footer>
    </div>
  );
}
