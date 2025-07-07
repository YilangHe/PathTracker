import { useState, useEffect, useCallback } from "react";

interface WeatherData {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
  isDay: boolean;
}

interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
}

const WEATHER_REFRESH_INTERVAL = 300000; // 5 minutes

// Weather code to description mapping based on WMO codes
const getWeatherDescription = (code: number): string => {
  switch (code) {
    case 0:
      return "Clear sky";
    case 1:
      return "Mainly clear";
    case 2:
      return "Partly cloudy";
    case 3:
      return "Overcast";
    case 45:
      return "Fog";
    case 48:
      return "Depositing rime fog";
    case 51:
      return "Light drizzle";
    case 53:
      return "Moderate drizzle";
    case 55:
      return "Dense drizzle";
    case 56:
      return "Light freezing drizzle";
    case 57:
      return "Dense freezing drizzle";
    case 61:
      return "Slight rain";
    case 63:
      return "Moderate rain";
    case 65:
      return "Heavy rain";
    case 66:
      return "Light freezing rain";
    case 67:
      return "Heavy freezing rain";
    case 71:
      return "Slight snow";
    case 73:
      return "Moderate snow";
    case 75:
      return "Heavy snow";
    case 77:
      return "Snow grains";
    case 80:
      return "Slight rain showers";
    case 81:
      return "Moderate rain showers";
    case 82:
      return "Violent rain showers";
    case 85:
      return "Slight snow showers";
    case 86:
      return "Heavy snow showers";
    case 95:
      return "Thunderstorm";
    case 96:
      return "Thunderstorm with slight hail";
    case 99:
      return "Thunderstorm with heavy hail";
    default:
      return "Unknown";
  }
};

// Weather code to icon mapping
const getWeatherIcon = (code: number, isDay: boolean): string => {
  switch (code) {
    case 0:
      return isDay ? "☀️" : "🌙";
    case 1:
      return isDay ? "🌤️" : "🌙";
    case 2:
      return isDay ? "⛅" : "☁️";
    case 3:
      return "☁️";
    case 45:
    case 48:
      return "🌫️";
    case 51:
    case 53:
    case 55:
      return "🌦️";
    case 56:
    case 57:
      return "🌧️";
    case 61:
    case 63:
    case 65:
      return "🌧️";
    case 66:
    case 67:
      return "🌧️";
    case 71:
    case 73:
    case 75:
      return "🌨️";
    case 77:
      return "🌨️";
    case 80:
    case 81:
    case 82:
      return "🌧️";
    case 85:
    case 86:
      return "🌨️";
    case 95:
    case 96:
    case 99:
      return "⛈️";
    default:
      return "❓";
  }
};

export const useWeather = (
  latitude: number | null,
  longitude: number | null
) => {
  const [state, setState] = useState<WeatherState>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchWeatherData = useCallback(async () => {
    if (!latitude || !longitude) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day&temperature_unit=fahrenheit&wind_speed_unit=mph`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();

      const weatherData: WeatherData = {
        temperature: Math.round(data.current.temperature_2m),
        weatherCode: data.current.weather_code,
        windSpeed: Math.round(data.current.wind_speed_10m),
        humidity: data.current.relative_humidity_2m,
        isDay: data.current.is_day === 1,
      };

      setState({
        data: weatherData,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Weather fetch error:", error);
      setState({
        data: null,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch weather data",
      });
    }
  }, [latitude, longitude]);

  useEffect(() => {
    if (latitude && longitude) {
      fetchWeatherData();
      const interval = setInterval(fetchWeatherData, WEATHER_REFRESH_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [fetchWeatherData, latitude, longitude]);

  return {
    ...state,
    getWeatherDescription,
    getWeatherIcon,
  };
};
