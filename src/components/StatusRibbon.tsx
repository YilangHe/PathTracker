import { Clock, AlertTriangle, Loader2 } from "lucide-react";
import { StalenessStatus } from "../types/path";
import { useTranslations } from 'next-intl';

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
  const t = useTranslations();
  
  // Get translated status text based on staleness status
  const getStatusText = () => {
    switch (staleness.status) {
      case 'fresh':
        return t('status.live');
      case 'recent':
        return t('status.recent');
      case 'stale':
        return t('status.stale');
      case 'very-stale':
        return t('status.veryStale');
      case 'error':
        return staleness.text === 'Using cached data' ? t('status.usingCachedData') : t('status.error');
      case 'unknown':
        return staleness.text === 'Using cached data' ? t('status.usingCachedData') : t('status.unknown');
      default:
        return staleness.text;
    }
  };
  
  return (
    <div className="relative">
      <div
        className={`${staleness.color} text-white px-4 py-2 rounded-lg shadow-lg`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span className="font-medium text-sm">
              {getStatusText()} • {t('status.lastUpdated')}: {prettyTime || t('status.never')}
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
