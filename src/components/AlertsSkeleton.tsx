import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function AlertsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-2 animate-pulse">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-5 h-5 bg-muted rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="flex gap-2">
                    <div className="h-4 bg-muted rounded w-20" />
                    <div className="h-4 bg-muted rounded w-24" />
                  </div>
                </div>
              </div>
              <div className="h-3 bg-muted rounded w-16" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-11/12" />
              <div className="h-3 bg-muted rounded w-4/5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}