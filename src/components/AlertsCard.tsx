import { Alert } from "../types/path";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface AlertsCardProps {
  alerts: Alert[];
  loading: boolean;
  error: string | null;
}

export const AlertsCard = ({ alerts, loading, error }: AlertsCardProps) => {
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

  if (loading) {
    return (
      <Card className="bg-blue-900 text-white">
        <CardHeader>
          <h2 className="text-xl font-semibold">PATH Alerts</h2>
        </CardHeader>
        <CardContent>
          <p className="text-blue-200">Loading alerts...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-900 text-white">
        <CardHeader>
          <h2 className="text-xl font-semibold">PATH Alerts</h2>
        </CardHeader>
        <CardContent>
          <p className="text-red-200">Error loading alerts: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-amber-900 text-white">
      <CardHeader>
        <h2 className="text-xl font-semibold">PATH Alerts</h2>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p className="text-amber-200">No active alerts at this time.</p>
        ) : (
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
                    Updated: {formatAlertTime(alert.ModifiedDate)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
