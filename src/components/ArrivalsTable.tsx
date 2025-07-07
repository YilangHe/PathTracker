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
                <Radio className="w-5 h-5 text-gray-400 flex-shrink-0 animate-pulse" />
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
};
