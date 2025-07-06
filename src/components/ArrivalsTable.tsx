import { ArrowRight, Radio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  return (
    <div className="space-y-3">
      <AnimatePresence initial={false} mode="popLayout">
        {data.destinations.map((dest) =>
          dest.messages.map((message) => (
            <motion.div
              layout
              key={`${message.headSign}-${message.secondsToArrival}`}
              initial={{ opacity: 0, rotateX: 90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              exit={{ opacity: 0, rotateX: -90 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="bg-gray-800 rounded-xl p-4 flex items-center justify-between origin-top"
            >
              {/* Left side - Logo, Arrow, and Destination */}
              <div className="flex items-center gap-3">
                {/* PATH Logo with line color */}
                <div className="relative">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 100 100"
                    className="flex-shrink-0"
                  >
                    {/* PATH logo shape */}
                    <path
                      d="M20 20 L50 20 L80 35 L80 65 L50 80 L20 65 Z"
                      fill={getLineColor(message.lineColor)}
                      stroke={getLineColor(message.lineColor)}
                      strokeWidth="2"
                    />
                    {/* Inner black rectangle */}
                    <rect
                      x="35"
                      y="35"
                      width="30"
                      height="30"
                      fill="#000"
                      rx="2"
                    />
                  </svg>
                  {/* Status dots */}
                  <div className="absolute -top-1 -right-1 flex gap-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: getLineColor(message.lineColor),
                      }}
                    />
                    <div className="w-2 h-2 rounded-full bg-gray-600" />
                  </div>
                </div>

                {/* Arrow icon */}
                <ArrowRight className="w-5 h-5 text-white" />

                {/* Destination info */}
                <div className="flex flex-col">
                  <div className="text-white text-lg font-medium capitalize">
                    {message.headSign}
                  </div>
                  <div className="text-gray-400 text-sm capitalize">
                    {STATIONS[
                      data.consideredStation as keyof typeof STATIONS
                    ] || data.consideredStation}
                  </div>
                </div>
              </div>

              {/* Right side - Time and Signal icon */}
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div
                    className={`text-2xl font-bold ${arrivalClass(message)}`}
                  >
                    {formatArrivalTime(message.arrivalTimeMessage)
                      .replace(" min", "")
                      .replace("min", "")}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {formatArrivalTime(message.arrivalTimeMessage).includes(
                      "min"
                    )
                      ? "minutes"
                      : ""}
                  </div>
                </div>
                <Radio className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
};
