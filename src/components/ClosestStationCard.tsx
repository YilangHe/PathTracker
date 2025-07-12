import { memo, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { MapPin, Navigation, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StationResult, StationCode } from "../types/path";
import { STATIONS } from "../constants/stations";
import { ArrivalsTable } from "./ArrivalsTable";
import { useTranslations } from 'next-intl';

interface ClosestStationCardProps {
  stationCode: StationCode;
  data: StationResult | null;
  loading: boolean;
  error: string | null;
  userLocation: { lat: number; lon: number } | null;
}

export const ClosestStationCard = memo(
  ({
    stationCode,
    data,
    loading,
    error,
    userLocation,
  }: ClosestStationCardProps) => {
    const [isExpanded, setIsExpanded] = useState(true); // Expanded by default
    const t = useTranslations();

    const toggleExpanded = () => {
      setIsExpanded(!isExpanded);
    };

    return (
      <Card className="bg-gradient-to-r from-blue-900 to-blue-800 text-white border-blue-700 shadow-lg">
        <CardHeader
          className="cursor-pointer hover:bg-blue-800/50 transition-colors"
          onClick={toggleExpanded}
        >
          <div className="space-y-2">
            {/* Top row - Title and expand/collapse */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-300" />
                <span className="text-lg font-semibold">{t('closestStation.title')}</span>
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center justify-center gap-1">
                  <span className="hidden sm:inline">{t('closestStation.nearby')}</span>
                  <span className="text-sm">🚉</span>
                </span>
              </div>

              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-blue-300" />
              </motion.div>
            </div>

            {/* Bottom row - Station name and status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {loading && (
                  <Navigation className="w-4 h-4 animate-spin text-blue-300" />
                )}
                <span className="text-xl font-bold capitalize">
                  {STATIONS[stationCode] ?? stationCode}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-blue-200">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="hidden sm:inline">{t('closestStation.autoUpdating')}</span>
                <span className="sm:hidden">{t('closestStation.live')}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <CardContent>
                {loading && (
                  <div className="flex items-center gap-2 text-blue-300">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300"></div>
                    <span>{t('closestStation.loading')}</span>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-800/50 border border-red-600 rounded text-sm">
                    <div className="flex items-center gap-2 text-red-100 mb-1">
                      <span>❌</span>
                      <span>{t('closestStation.error')}</span>
                    </div>
                    <div className="text-red-200">{error}</div>
                  </div>
                )}

                {!error && !loading && data && <ArrivalsTable data={data} />}

                {!error && !loading && !data && (
                  <div className="text-blue-200">
                    {t('closestStation.noArrivals')}
                  </div>
                )}

                {userLocation && (
                  <div className="mt-3 text-xs text-blue-300 opacity-75">
                    {t('closestStation.basedOnLocation', { lat: userLocation.lat.toFixed(4), lon: userLocation.lon.toFixed(4) })}
                  </div>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    );
  }
);

ClosestStationCard.displayName = "ClosestStationCard";
