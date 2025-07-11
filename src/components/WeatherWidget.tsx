"use client";

import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CloudRain, Wind, Droplets, MapPin, X } from "lucide-react";
import { useWeather } from "../hooks/useWeather";
import { useUserPreferences } from "../contexts/UserPreferencesContext";
import { useTranslations } from 'next-intl';

interface WeatherWidgetProps {
  userLocation: { lat: number; lon: number } | null;
}

export const WeatherWidget = memo(({ userLocation }: WeatherWidgetProps) => {
  const { data, loading, error, getWeatherDescription, getWeatherIcon } =
    useWeather(userLocation?.lat || null, userLocation?.lon || null);
  const { toggleWeatherWidget } = useUserPreferences();
  const t = useTranslations();

  if (!userLocation) {
    return null;
  }

  return (
    <Card className="relative bg-gradient-to-r from-indigo-900 to-purple-900 text-white border-indigo-700 shadow-lg">
      {/* Close button */}
      <button
        onClick={toggleWeatherWidget}
        className="absolute top-2 right-2 z-10 p-1 rounded-full bg-black/20 hover:bg-black/40 transition-colors opacity-60 hover:opacity-100"
        aria-label="Hide weather widget"
        title="Hide weather widget"
      >
        <X className="w-3 h-3 text-white" />
      </button>

      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-indigo-300" />
            <span className="text-sm font-medium text-indigo-100">
              {t('weather.title')}
            </span>
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-indigo-300">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-300"></div>
              <span className="text-xs">{t('weather.loading')}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-3 p-2 bg-red-800/50 border border-red-600 rounded text-xs">
            <div className="flex items-center gap-1 text-red-100">
              <CloudRain className="w-3 h-3" />
              <span>{t('weather.error')}</span>
            </div>
          </div>
        )}

        {!error && !loading && data && (
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">
                {getWeatherIcon(data.weatherCode, data.isDay)}
              </div>
              <div>
                <div className="text-lg font-semibold">
                  {t('weather.temperature', { temp: data.temperature })}
                </div>
                <div className="text-xs text-indigo-200">
                  {getWeatherDescription(data.weatherCode)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-indigo-200">
              <div className="flex items-center gap-1">
                <Wind className="w-3 h-3" />
                <span>{t('weather.wind', { windSpeed: data.windSpeed })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Droplets className="w-3 h-3" />
                <span>{t('weather.humidity', { humidity: data.humidity })}</span>
              </div>
            </div>
          </div>
        )}

        {!error && !loading && !data && (
          <div className="mt-3 text-xs text-indigo-200">
            {t('weather.unavailable')}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

WeatherWidget.displayName = "WeatherWidget";
