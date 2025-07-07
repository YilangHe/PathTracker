"use client";

import { useState, useEffect } from "react";
import { useDailyCacheRefresh } from "../hooks/useDailyCacheRefresh";

interface CacheDebugInfoProps {
  showDebugInfo?: boolean;
}

export function CacheDebugInfo({ showDebugInfo = false }: CacheDebugInfoProps) {
  const { forceCacheRefresh, getLastRefreshTime, getTimeUntilNextRefresh } =
    useDailyCacheRefresh();
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState<number | null>(null);

  useEffect(() => {
    const updateTimes = () => {
      setLastRefreshTime(getLastRefreshTime());
      setTimeUntilNext(getTimeUntilNextRefresh());
    };

    updateTimes();
    const interval = setInterval(updateTimes, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [getLastRefreshTime, getTimeUntilNextRefresh]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString();
  };

  if (!showDebugInfo) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg text-sm z-50">
      <div className="font-bold mb-2">Cache Debug Info</div>
      <div className="space-y-1">
        <div>
          Last refresh:{" "}
          {lastRefreshTime ? formatDate(lastRefreshTime) : "Never"}
        </div>
        <div>
          Next refresh in: {timeUntilNext ? formatTime(timeUntilNext) : "Soon"}
        </div>
        <button
          onClick={forceCacheRefresh}
          className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
        >
          Force Cache Refresh
        </button>
      </div>
    </div>
  );
}
