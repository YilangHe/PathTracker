"use client";

import { useState, useEffect } from "react";
import { useAlerts } from "@/hooks/useAlerts";
import { Alert } from "@/types/path";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, 
  Clock, 
  Info, 
  AlertCircle,
  Train,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react";
import { useTranslations } from 'next-intl';
import { AlertsData } from "./alerts-server";

interface AlertsPageClientProps {
  initialData?: AlertsData;
}

export function AlertsPageClient({ initialData }: AlertsPageClientProps) {
  const t = useTranslations();
  const { data: liveAlerts, loading, error, hasCachedData, lastSuccessfulUpdate } = useAlerts();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Use initial data from server on first render, then switch to live data
  const [hasHydrated, setHasHydrated] = useState(false);
  const alerts = hasHydrated ? liveAlerts : (initialData?.alerts || []);
  const displayError = hasHydrated ? error : initialData?.error;
  const displayLastUpdate = hasHydrated ? lastSuccessfulUpdate : initialData?.lastUpdated;
  
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const formatAlertTime = (timestamp: string) => {
    // Handle both ISO string and Unix timestamp formats
    let date: Date;
    if (timestamp.includes('-') || timestamp.includes('T')) {
      // ISO string format
      date = new Date(timestamp);
    } else {
      // Unix timestamp (assume milliseconds if large number)
      const ts = parseInt(timestamp);
      date = new Date(ts > 9999999999 ? ts : ts * 1000);
    }
    
    // Validate date
    if (isNaN(date.getTime())) {
      return t('alerts.justNow');
    }
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('alerts.justNow');
    if (diffMins < 60) return t('alerts.minutesAgo', { count: diffMins });
    if (diffHours < 24) return t('alerts.hoursAgo', { count: diffHours });
    if (diffDays < 7) return t('alerts.daysAgo', { count: diffDays });
    return date.toLocaleDateString();
  };

  const extractAlertInfo = (alert: Alert) => {
    const subject = alert.incidentMessage.subject;
    const message = alert.incidentMessage.preMessage;
    
    // Determine alert severity based on keywords
    let severity: "critical" | "warning" | "info" = "info";
    let category = "general";
    
    const lowerSubject = subject.toLowerCase();
    const lowerMessage = message.toLowerCase();
    
    if (lowerSubject.includes("suspended") || lowerSubject.includes("no service")) {
      severity = "critical";
      category = "suspension";
    } else if (lowerSubject.includes("delay") || lowerSubject.includes("late")) {
      severity = "warning";
      category = "delay";
    } else if (lowerSubject.includes("weekend") || lowerSubject.includes("schedule")) {
      severity = "info";
      category = "schedule";
    } else if (lowerSubject.includes("maintenance") || lowerSubject.includes("work")) {
      severity = "warning";
      category = "maintenance";
    }

    // Extract affected stations/routes from message
    const stations = [];
    const stationPattern = /(?:at|from|to|between)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g;
    let match;
    while ((match = stationPattern.exec(message)) !== null) {
      stations.push(match[1]);
    }

    return { subject, message, severity, category, stations };
  };

  const categories = [
    { id: "all", label: t('alerts.categories.all'), icon: AlertCircle },
    { id: "suspension", label: t('alerts.categories.suspension'), icon: XCircle },
    { id: "delay", label: t('alerts.categories.delay'), icon: Clock },
    { id: "maintenance", label: t('alerts.categories.maintenance'), icon: Train },
    { id: "schedule", label: t('alerts.categories.schedule'), icon: Calendar },
    { id: "general", label: t('alerts.categories.general'), icon: Info },
  ];

  const filteredAlerts = alerts.filter(alert => {
    const info = extractAlertInfo(alert);
    const matchesCategory = selectedCategory === "all" || info.category === selectedCategory;
    const matchesSearch = searchTerm === "" || 
      info.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      info.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const alertCounts = {
    all: alerts.length,
    suspension: alerts.filter(a => extractAlertInfo(a).category === "suspension").length,
    delay: alerts.filter(a => extractAlertInfo(a).category === "delay").length,
    maintenance: alerts.filter(a => extractAlertInfo(a).category === "maintenance").length,
    schedule: alerts.filter(a => extractAlertInfo(a).category === "schedule").length,
    general: alerts.filter(a => extractAlertInfo(a).category === "general").length,
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-900 text-red-100 border-red-500";
      case "warning": return "bg-amber-900 text-amber-100 border-amber-500";
      case "info": return "bg-blue-900 text-blue-100 border-blue-500";
      default: return "bg-gray-900 text-gray-100 border-gray-500";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical": return <XCircle className="w-5 h-5" />;
      case "warning": return <AlertTriangle className="w-5 h-5" />;
      case "info": return <Info className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* SEO-optimized Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <AlertTriangle className="w-10 h-10 text-amber-500" />
          {t('alerts.title')}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t('alerts.pageDescription')}
        </p>
        
        {/* Status Bar */}
        <div className="mt-4 p-4 rounded-lg bg-muted/50 border">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-sm">{t('alerts.updatingAlerts')}</span>
                </>
              ) : alerts.length === 0 ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">{t('alerts.allServicesNormal')}</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium">
                    {t('alerts.activeAlerts', { count: alerts.length })}
                  </span>
                </>
              )}
            </div>
            {displayLastUpdate && (
              <div className="text-xs text-muted-foreground">
                {t('alerts.lastUpdated')} {formatAlertTime(displayLastUpdate)}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search and Filter Bar */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <input
              type="search"
              placeholder={t('alerts.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={t('alerts.searchPlaceholder')}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => {
            const Icon = category.icon;
            const count = alertCounts[category.id as keyof typeof alertCounts];
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  px-4 py-2 rounded-lg border transition-all flex items-center gap-2
                  ${selectedCategory === category.id 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-background/50 hover:bg-muted border-border'}
                `}
                aria-pressed={selectedCategory === category.id}
                aria-label={`Filter by ${category.label}`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{category.label}</span>
                {count > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {count}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Error State */}
      {displayError && !hasCachedData && alerts.length === 0 && (
        <Card className="border-red-500 bg-red-900/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="font-semibold text-red-500">{t('alerts.unableToLoadAlerts')}</h3>
                <p className="text-sm text-muted-foreground mt-1">{displayError}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cached Data Warning */}
      {displayError && (hasCachedData || alerts.length > 0) && (
        <Card className="border-orange-500 bg-orange-900/20 mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-orange-500">
                  {t('alerts.showingCachedAlerts')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts List */}
      <main role="main" aria-label="PATH alerts list">
        {filteredAlerts.length === 0 && !loading && (
          <Card className="border-green-500 bg-green-900/20">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">{t('alerts.noActiveAlerts')}</h2>
              <p className="text-muted-foreground">
                {searchTerm || selectedCategory !== "all" 
                  ? t('alerts.noMatchingAlerts')
                  : t('alerts.allServicesNormal')}
              </p>
            </CardContent>
          </Card>
        )}

        <AnimatePresence mode="popLayout">
          <div className="space-y-4">
            {filteredAlerts.map((alert, index) => {
              const info = extractAlertInfo(alert);
              return (
                <motion.div
                  key={`${alert.ModifiedDate}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className={`border-2 ${getSeverityColor(info.severity)}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          {getSeverityIcon(info.severity)}
                          <div className="flex-1">
                            <h2 className="text-lg font-semibold leading-tight">
                              {info.subject}
                            </h2>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">
                                {info.category.charAt(0).toUpperCase() + info.category.slice(1)}
                              </Badge>
                              {info.stations.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span className="text-xs">
                                    {info.stations.slice(0, 3).join(", ")}
                                    {info.stations.length > 3 && ` +${info.stations.length - 3} more`}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs opacity-70">
                            {formatAlertTime(alert.ModifiedDate)}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {info.message.trim()}
                      </p>
                      {alert.CreatedDate !== alert.ModifiedDate && (
                        <div className="mt-3 pt-3 border-t border-current/10">
                          <div className="flex items-center gap-2 text-xs opacity-70">
                            <Clock className="w-3 h-3" />
                            <span>{t('alerts.firstReported')} {formatAlertTime(alert.CreatedDate)}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      </main>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
}