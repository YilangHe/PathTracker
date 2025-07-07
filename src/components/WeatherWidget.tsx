import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CloudRain, Wind, Droplets, MapPin } from "lucide-react";
import { useWeather } from "../hooks/useWeather";

interface WeatherWidgetProps {
  userLocation: { lat: number; lon: number } | null;
}

export const WeatherWidget = memo(({ userLocation }: WeatherWidgetProps) => {
  const { data, loading, error, getWeatherDescription, getWeatherIcon } =
    useWeather(userLocation?.lat || null, userLocation?.lon || null);

  if (!userLocation) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white border-indigo-700 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-indigo-300" />
            <span className="text-sm font-medium text-indigo-100">
              Current Weather
            </span>
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-indigo-300">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-300"></div>
              <span className="text-xs">Loading...</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-3 p-2 bg-red-800/50 border border-red-600 rounded text-xs">
            <div className="flex items-center gap-1 text-red-100">
              <CloudRain className="w-3 h-3" />
              <span>Unable to load weather data</span>
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
                  {data.temperature}°F
                </div>
                <div className="text-xs text-indigo-200">
                  {getWeatherDescription(data.weatherCode)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-indigo-200">
              <div className="flex items-center gap-1">
                <Wind className="w-3 h-3" />
                <span>{data.windSpeed} mph</span>
              </div>
              <div className="flex items-center gap-1">
                <Droplets className="w-3 h-3" />
                <span>{data.humidity}%</span>
              </div>
            </div>
          </div>
        )}

        {!error && !loading && !data && (
          <div className="mt-3 text-xs text-indigo-200">
            Weather data unavailable
          </div>
        )}
      </CardContent>
    </Card>
  );
});

WeatherWidget.displayName = "WeatherWidget";
