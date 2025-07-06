import { Train } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StationResult } from "../types/path";
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
    <div className="space-y-4">
      {data.destinations.map((dest) => (
        <div key={dest.label} className="bg-gray-800 rounded-xl p-3">
          <div className="flex items-center mb-2 gap-2">
            <Train size={18} />
            <h2 className="font-medium">
              {dest.label === "ToNJ" ? "To New Jersey" : "To New York"}
            </h2>
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-400">
                <th className="py-1">Destination</th>
                <th className="py-1 text-right pr-5">Arrival</th>
              </tr>
            </thead>
            <AnimatePresence initial={false} mode="popLayout">
              <tbody>
                {dest.messages.map((message) => (
                  <motion.tr
                    layout
                    key={`${message.headSign}-${message.secondsToArrival}`}
                    initial={{ opacity: 0, rotateX: 90 }}
                    animate={{ opacity: 1, rotateX: 0 }}
                    exit={{ opacity: 0, rotateX: -90 }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    className="border-t border-gray-700 h-8 origin-top"
                  >
                    <td className="py-1 capitalize">
                      <span
                        className="inline-block w-3 h-3 rounded-full mr-2 align-middle"
                        style={{
                          background: getLineColor(message.lineColor),
                        }}
                      />
                      {message.headSign}
                    </td>
                    <td
                      className={`py-1 text-right pr-5 ${arrivalClass(
                        message
                      )}`}
                    >
                      {formatArrivalTime(message.arrivalTimeMessage)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </AnimatePresence>
          </table>
        </div>
      ))}
    </div>
  );
};
