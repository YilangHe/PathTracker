"use client";

import { useState, useEffect } from "react";
import { Alert } from "../types/path";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, AlertTriangle } from "lucide-react";
import { useTranslations } from 'next-intl';

interface AlertsCardProps {
  alerts: Alert[];
  loading: boolean;
  error: string | null;
  hasCachedData?: boolean;
}

export const AlertsCard = ({
  alerts,
  loading,
  error,
  hasCachedData = false,
}: AlertsCardProps) => {
  const t = useTranslations();
  const alertCount = alerts.length;
  const hasAlerts = alertCount > 0;

  // Auto-collapse when there are no alerts, expand when there are alerts
  const [isExpanded, setIsExpanded] = useState(hasAlerts);

  // Update expansion state when alerts change
  useEffect(() => {
    if (!loading) {
      setIsExpanded(hasAlerts);
    }
  }, [hasAlerts, loading]);

  const formatAlertTime = (timestamp: string) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString();
  };

  const extractAlertDescription = (alert: Alert) => {
    // Extract the main alert description from the preMessage
    const subject = alert.incidentMessage.subject;
    const message = alert.incidentMessage.preMessage;
    return { subject, message };
  };

  // Determine card styling based on error state and cached data
  let cardBgColor = "bg-green-900";
  let headerTextColor = "text-green-100";
  let statusText = hasAlerts
    ? t('alerts.alertCount', { count: alertCount })
    : t('alerts.alertCount', { count: 0 });

  if (hasAlerts) {
    cardBgColor = "bg-amber-900";
    headerTextColor = "text-amber-100";
  }

  if (error && hasCachedData) {
    cardBgColor = "bg-orange-900";
    headerTextColor = "text-orange-100";
    statusText = t('alerts.usingCached');
  } else if (error) {
    cardBgColor = "bg-red-900";
    headerTextColor = "text-red-100";
    statusText = t('alerts.error');
  }

  if (loading) {
    return (
      <Card className="bg-blue-900 text-white">
        <CardHeader
          className="cursor-pointer hover:bg-blue-800/50 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-blue-300" />
              <h2 className="text-xl font-semibold">{t('alerts.title')}</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-200">{t('alerts.loading')}</span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-blue-300" />
              </motion.div>
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
                <p className="text-blue-200">{t('alerts.loadingAlerts')}</p>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    );
  }

  return (
    <Card className={`${cardBgColor} text-white`}>
      <CardHeader
        className="cursor-pointer hover:bg-black/10 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle
              className={`w-5 h-5 ${headerTextColor} opacity-70`}
            />
            <h2 className={`text-xl font-semibold ${headerTextColor}`}>
              {t('alerts.title')}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${headerTextColor}`}>{statusText}</span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 opacity-70" />
            </motion.div>
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
              {error && hasCachedData && (
                <div className="mb-4 p-3 bg-orange-800/50 border border-orange-600 rounded">
                  <div className="flex items-center gap-2 text-orange-100 text-sm">
                    <span>⚠️</span>
                    <span>
                      {t('alerts.errorLatest')}
                    </span>
                  </div>
                  <div className="text-xs text-orange-200 mt-1">{error}</div>
                </div>
              )}

              {error && !hasCachedData && (
                <div className="p-3 bg-red-800/50 border border-red-600 rounded">
                  <div className="flex items-center gap-2 text-red-100 text-sm">
                    <span>❌</span>
                    <span>{t('alerts.errorLoading')}</span>
                  </div>
                  <div className="text-red-200 mt-1 text-sm">{error}</div>
                </div>
              )}

              {!error && !hasAlerts && (
                <p className="text-green-200">{t('alerts.noAlerts')}</p>
              )}

              {hasAlerts && (
                <div className="space-y-4">
                  {alerts.map((alert, index) => {
                    const { subject, message } = extractAlertDescription(alert);
                    return (
                      <div
                        key={index}
                        className="border-l-4 border-amber-400 pl-4 py-2 bg-amber-800/50 rounded-r"
                      >
                        <div className="font-medium text-amber-100 mb-1">
                          {subject}
                        </div>
                        <div className="text-sm text-amber-200 mb-2">
                          {message.trim()}
                        </div>
                        <div className="text-xs text-amber-300">
                          {t('alerts.updated')} {formatAlertTime(alert.ModifiedDate)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
