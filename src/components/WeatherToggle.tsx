"use client";

import React from "react";
import { Cloud, CloudOff } from "lucide-react";
import { useUserPreferences } from "@/contexts/UserPreferencesContext";

export const WeatherToggle: React.FC = () => {
  const { preferences, toggleWeatherWidget } = useUserPreferences();
  const isEnabled = preferences.showWeatherWidget;

  return (
    <button
      onClick={toggleWeatherWidget}
      className={`inline-flex items-center justify-center h-9 w-9 rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        isEnabled
          ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
          : "border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }`}
      aria-label={`Weather widget is ${
        isEnabled ? "enabled" : "disabled"
      }. Click to toggle.`}
      title={`${isEnabled ? "Hide" : "Show"} weather widget`}
    >
      {isEnabled ? (
        <Cloud className="h-4 w-4" />
      ) : (
        <CloudOff className="h-4 w-4" />
      )}
    </button>
  );
};
