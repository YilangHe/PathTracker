"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { StationCode, CommutePair, CommuteRoute } from "@/types/path";
import { calculateRoute, getCommuteDirection, getCommuteStations } from "@/utils/routeCalculator";

interface CommuteContextType {
  commutePair: CommutePair | null;
  currentRoute: CommuteRoute | null;
  currentDirection: "morning" | "evening";
  isCommuteConfigured: boolean;
  setCommutePair: (pair: CommutePair | null) => void;
  updateRoute: () => void;
  clearCommute: () => void;
}

const CommuteContext = createContext<CommuteContextType | undefined>(undefined);

const COMMUTE_STORAGE_KEY = "pathTracker_commute";

interface CommuteProviderProps {
  children: ReactNode;
}

export function CommuteProvider({ children }: CommuteProviderProps) {
  const [commutePair, setCommutePairState] = useState<CommutePair | null>(null);
  const [currentRoute, setCurrentRoute] = useState<CommuteRoute | null>(null);
  const [currentDirection, setCurrentDirection] = useState<"morning" | "evening">("morning");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved commute configuration on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(COMMUTE_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as CommutePair;
          setCommutePairState(parsed);
        }
        setIsLoaded(true);
      }
    } catch (error) {
      console.error("Error loading commute configuration:", error);
      setIsLoaded(true);
    }
  }, []);

  // Save commute configuration whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        if (typeof window !== "undefined") {
          if (commutePair) {
            localStorage.setItem(COMMUTE_STORAGE_KEY, JSON.stringify(commutePair));
          } else {
            localStorage.removeItem(COMMUTE_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error("Error saving commute configuration:", error);
      }
    }
  }, [commutePair, isLoaded]);

  // Update current direction based on time of day
  useEffect(() => {
    const updateDirection = () => {
      const now = new Date();
      const hour = now.getHours();
      const newDirection = getCommuteDirection(hour);
      setCurrentDirection(newDirection);
    };

    // Update immediately
    updateDirection();

    // Update every minute to handle hour changes
    const interval = setInterval(updateDirection, 60000);

    return () => clearInterval(interval);
  }, []);

  // Calculate route when commute pair or direction changes
  useEffect(() => {
    if (commutePair) {
      const { from, to } = getCommuteStations(
        commutePair.homeStation,
        commutePair.workStation,
        currentDirection
      );

      const route = calculateRoute(from, to);
      setCurrentRoute(route);
    } else {
      setCurrentRoute(null);
    }
  }, [commutePair, currentDirection]);

  const setCommutePair = (pair: CommutePair | null) => {
    setCommutePairState(pair);
  };

  const updateRoute = () => {
    if (commutePair) {
      const { from, to } = getCommuteStations(
        commutePair.homeStation,
        commutePair.workStation,
        currentDirection
      );

      const route = calculateRoute(from, to);
      setCurrentRoute(route);
    }
  };

  const clearCommute = () => {
    setCommutePairState(null);
    setCurrentRoute(null);
  };

  const isCommuteConfigured = commutePair !== null;

  const value: CommuteContextType = {
    commutePair,
    currentRoute,
    currentDirection,
    isCommuteConfigured,
    setCommutePair,
    updateRoute,
    clearCommute,
  };

  return (
    <CommuteContext.Provider value={value}>
      {children}
    </CommuteContext.Provider>
  );
}

export function useCommute() {
  const context = useContext(CommuteContext);
  if (context === undefined) {
    throw new Error("useCommute must be used within a CommuteProvider");
  }
  return context;
}