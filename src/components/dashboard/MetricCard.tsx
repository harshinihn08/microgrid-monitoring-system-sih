import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  className?: string;
}

export const MetricCard = ({ title, value, icon, trend, className }: MetricCardProps) => {
  const isPositiveTrend = trend?.startsWith('+');
  
  return (
    <Card className={cn("relative overflow-hidden shadow-card hover:shadow-hover transition-all", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium opacity-90">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
          </div>
          <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
            {icon}
          </div>
        </div>
        
        {trend && (
          <div className="mt-4 flex items-center gap-1">
            {isPositiveTrend ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <Badge 
              variant="secondary"
              className={cn(
                "text-xs bg-white/20 backdrop-blur-sm border-0",
                isPositiveTrend ? "text-success-foreground" : "text-critical-foreground"
              )}
            >
              {trend}
            </Badge>
            <span className="text-xs opacity-80">from last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};