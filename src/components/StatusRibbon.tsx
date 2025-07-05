import { Clock, AlertTriangle, Loader2 } from "lucide-react";
import { StalenessStatus } from "../types/path";

interface StatusRibbonProps {
  staleness: StalenessStatus;
  prettyTime: string | null;
  loading: boolean;
}

export const StatusRibbon = ({
  staleness,
  prettyTime,
  loading,
}: StatusRibbonProps) => {
  return (
    <div className="relative">
      <div
        className={`${staleness.color} text-white px-4 py-2 rounded-lg shadow-lg`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span className="font-medium text-sm">
              {staleness.text} • Last updated: {prettyTime || "Never"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {staleness.status === "very-stale" && (
              <AlertTriangle size={16} className="text-white" />
            )}
            {loading && <Loader2 className="animate-spin" size={16} />}
          </div>
        </div>
      </div>
    </div>
  );
};
