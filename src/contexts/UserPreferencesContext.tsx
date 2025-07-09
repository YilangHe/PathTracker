"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface UserPreferences {
  showWeatherWidget: boolean;
}

type UserPreferencesContextType = {
  preferences: UserPreferences;
  updatePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => void;
  toggleWeatherWidget: () => void;
};

const UserPreferencesContext = createContext<
  UserPreferencesContextType | undefined
>(undefined);

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error(
      "useUserPreferences must be used within a UserPreferencesProvider"
    );
  }
  return context;
};

type UserPreferencesProviderProps = {
  children: React.ReactNode;
  storageKey?: string;
};

const DEFAULT_PREFERENCES: UserPreferences = {
  showWeatherWidget: true, // Default to showing weather widget
};

export const UserPreferencesProvider: React.FC<
  UserPreferencesProviderProps
> = ({ children, storageKey = "path-tracker-preferences" }) => {
  const [preferences, setPreferences] =
    useState<UserPreferences>(DEFAULT_PREFERENCES);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsedPreferences = JSON.parse(stored);
          setPreferences({ ...DEFAULT_PREFERENCES, ...parsedPreferences });
        }
      }
    } catch (error) {
      console.error("Error loading user preferences:", error);
    }
  }, [storageKey]);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify(preferences));
      }
    } catch (error) {
      console.error("Error saving user preferences:", error);
    }
  }, [preferences, storageKey]);

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleWeatherWidget = () => {
    setPreferences((prev) => ({
      ...prev,
      showWeatherWidget: !prev.showWeatherWidget,
    }));
  };

  return (
    <UserPreferencesContext.Provider
      value={{ preferences, updatePreference, toggleWeatherWidget }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};
