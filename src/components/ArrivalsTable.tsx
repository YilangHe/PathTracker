import { ArrowRight, Radio, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { StationResult } from "../types/path";
import { STATIONS } from "../constants/stations";
import {
  getLineColor,
  arrivalClass,
  formatArrivalTime,
} from "../utils/pathHelpers";

interface ArrivalsTableProps {
  data: StationResult;
}

export const ArrivalsTable = ({ data }: ArrivalsTableProps) => {
  // State to track which sections are expanded (both expanded by default)
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    ToNJ: true,
    ToNY: true,
  });

  // Toggle section expansion
  const toggleSection = (direction: "ToNJ" | "ToNY") => {
    setExpandedSections((prev) => ({
      ...prev,
      [direction]: !prev[direction],
    }));
  };

  const isUrgent = (message: any) => {
    const seconds = parseInt(message.secondsToArrival, 10);
    return seconds < 120 && seconds > 0; // <2 min band, but not "Now"
  };

  // Helper function to get direction section style
  const getDirectionSectionStyle = (direction: "ToNY" | "ToNJ") => {
    return direction === "ToNY"
      ? "text-slate-300 border-slate-300/30"
      : "text-neutral-300 border-neutral-300/30";
  };

  // Helper function to format direction label
  const formatDirectionLabel = (direction: "ToNY" | "ToNJ") => {
    return direction === "ToNY" ? "To New York" : "To New Jersey";
  };

  // Helper function to reorder destinations based on station
  const getOrderedDestinations = () => {
    const stationCode = data.consideredStation;
    const specificNYStations = ["CHR", "09S", "23S", "33S"];

    // For specific NY stations, show ToNJ first, then ToNY
    if (specificNYStations.includes(stationCode)) {
      return data.destinations.sort((a, b) => {
        if (a.label === "ToNJ" && b.label === "ToNY") return -1;
        if (a.label === "ToNY" && b.label === "ToNJ") return 1;
        return 0;
      });
    }

    // For all other stations, show ToNY first, then ToNJ
    return data.destinations.sort((a, b) => {
      if (a.label === "ToNY" && b.label === "ToNJ") return -1;
      if (a.label === "ToNJ" && b.label === "ToNY") return 1;
      return 0;
    });
  };

  return (
    <div className="space-y-7">
      <AnimatePresence initial={false} mode="popLayout">
        {getOrderedDestinations().map((dest) => (
          <motion.div
            key={dest.label}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="space-y-2"
          >
            {/* Direction Header - Now clickable */}
            <div
              className={`flex items-center justify-between cursor-pointer hover:bg-gray-800/50 rounded-lg p-2 -m-2 transition-colors border-b ${getDirectionSectionStyle(
                dest.label
              )}`}
              onClick={() => toggleSection(dest.label)}
            >
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm uppercase tracking-wider">
                  {formatDirectionLabel(dest.label)}
                </h3>
                <div className="text-xs text-gray-500">
                  {dest.messages.length} train
                  {dest.messages.length !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Chevron icon for expand/collapse */}
              <motion.div
                animate={{ rotate: expandedSections[dest.label] ? 0 : -90 }}
                transition={{ duration: 0.2 }}
                className="text-gray-400"
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </div>

            {/* Trains in this direction - Now collapsible */}
            <AnimatePresence initial={false}>
              {expandedSections[dest.label] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="space-y-2 overflow-hidden"
                >
                  {dest.messages.map((message) => (
                    <motion.div
                      layout
                      key={`${dest.label}-${message.headSign}-${message.secondsToArrival}`}
                      initial={{ opacity: 0, rotateX: 90 }}
                      animate={{ opacity: 1, rotateX: 0 }}
                      exit={{ opacity: 0, rotateX: -90 }}
                      transition={{ duration: 0.45, ease: "easeInOut" }}
                      className={`bg-gray-800 rounded-xl p-4 flex items-center justify-between origin-top border-l-4 border-l-current ${
                        isUrgent(message) ? "animate-urgent-pulse" : ""
                      }`}
                      style={{
                        borderLeftColor: getLineColor(message.lineColor),
                      }}
                    >
                      {/* Left side - Logo, Arrow, and Destination */}
                      <div className="flex items-center gap-3">
                        {/* PATH Logo with line color */}
                        <div className="relative">
                          <svg
                            width="40"
                            height="30"
                            viewBox="0 0 104 75"
                            className="flex-shrink-0"
                          >
                            <g fill={getLineColor(message.lineColor)}>
                              <path d="M 75.297,0.792 c 0,0 -0.994,4.245 -1.209,5.174 c -1.151,0 -50.824,0 -50.824,0  c -13.046,0 -15.146,9.957 -15.167,10.056 c 0.007,-0.029 -6.489,26.344 -6.489,26.344 l -0.292,1.187 L 32.517,35.9 l 0.094,-0.456  c 0.039 -0.179,3.719 -17.75,4.817 -21.155 c 0.621 -1.926,2.194 -2.02,3.75 -1.952 l 0.441,0.014 c 0,0,29.191,0,30.953,0  c -0.307,1.308 -1.475,6.282 -1.475,6.282 l 33.195,-9.055 L 75.479,0 L 75.297,0.792" />
                              <path d="M101.033,12.585 l -30.545,8.741 l -0.099,0.427 c -0.039,0.171 -4.016,17.456 -4.72,20.882  c -0.394,1.916 -1.588,2.02 -3.369,1.964 l -0.82,-0.007 c -0.57,0.02 -20.154,0.007 -31.235,0 c 0.333 -1.322,1.581 -6.279,1.581 -6.279 L 0,46.195  l 22.956,28.716 c 0,0,5.386 -22.943,5.64 -24.029 c 1.149,0,51.258,0,51.258,0 c 13.645,0,15.412 -9.248,15.537 -10.054  c 0.012 -0.053,6.861 -28.595,6.861 -28.595 L 101.033,12.585" />
                            </g>
                          </svg>
                        </div>

                        {/* Arrow icon */}
                        <ArrowRight className="w-5 h-5 text-white" />

                        {/* Destination info */}
                        <div className="flex flex-col">
                          <div
                            className="text-lg font-medium capitalize"
                            style={{ color: getLineColor(message.lineColor) }}
                          >
                            {message.headSign}
                          </div>
                          <div className="text-gray-400 text-sm capitalize">
                            {STATIONS[
                              data.consideredStation as keyof typeof STATIONS
                            ] || data.consideredStation}
                          </div>
                        </div>
                      </div>

                      {/* Right side - Time */}
                      <div className="flex items-start gap-1">
                        <div className="flex flex-col items-center">
                          <div
                            className={`text-3xl font-bold ${arrivalClass(
                              message
                            )}`}
                          >
                            {formatArrivalTime(message.arrivalTimeMessage)
                              .replace(" min", "")
                              .replace("min", "")}
                          </div>
                          <div className={`text-sm ${arrivalClass(message)}`}>
                            {formatArrivalTime(
                              message.arrivalTimeMessage
                            ).includes("min")
                              ? "minutes"
                              : ""}
                          </div>
                        </div>
                        <Radio
                          className={`w-3 h-3 ${arrivalClass(
                            message
                          )} animate-pulse flex-shrink-0`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
