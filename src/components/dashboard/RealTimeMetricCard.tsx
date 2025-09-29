import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface RealTimeMetricCardProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  unit?: string;
  trend?: string;
  className?: string;
  updateInterval?: number;
  valueRange?: [number, number];
}

export const RealTimeMetricCard = ({ 
  title, 
  icon, 
  value, 
  unit = "",
  trend,
  className = "",
  updateInterval = 3000,
  valueRange = [0.85, 1.15]
}: RealTimeMetricCardProps) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentTrend, setCurrentTrend] = useState(trend);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true);
      
      // Extract numeric value from string
      const numericValue = parseFloat(value.replace(/[^\d.-]/g, ''));
      if (!isNaN(numericValue)) {
        // Add realistic variation
        const variation = Math.random() * (valueRange[1] - valueRange[0]) + valueRange[0];
        const newValue = Math.round(numericValue * variation);
        
        // Calculate trend
        const trendDirection = newValue > numericValue ? '+' : '';
        const trendPercent = Math.abs(((newValue - numericValue) / numericValue) * 100).toFixed(1);
        
        setCurrentValue(newValue.toLocaleString() + unit);
        setCurrentTrend(`${trendDirection}${trendPercent}%`);
      }

      setTimeout(() => setIsUpdating(false), 200);
    }, updateInterval);

    return () => clearInterval(interval);
  }, [value, unit, updateInterval, valueRange]);

  const getTrendColor = (trendValue?: string) => {
    if (!trendValue) return "text-muted-foreground";
    return trendValue.startsWith('+') ? "text-success" : "text-critical";
  };

  const getTrendIcon = (trendValue?: string) => {
    if (!trendValue) return null;
    return trendValue.startsWith('+') ? 
      <TrendingUp className="h-3 w-3" /> : 
      <TrendingDown className="h-3 w-3" />;
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-hover bg-gradient-card border-border/50 ${className} ${isUpdating ? 'ring-2 ring-primary/30' : ''}`}>
      <div className={`absolute inset-0 bg-gradient-energy opacity-0 transition-opacity duration-200 ${isUpdating ? 'opacity-10' : ''}`} />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg bg-primary/10 transition-all duration-300 ${isUpdating ? 'bg-primary/20 scale-110' : ''}`}>
          {icon}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className={`text-2xl font-bold transition-all duration-300 ${isUpdating ? 'scale-105 text-primary' : ''}`}>
            {currentValue}
          </div>
          {currentTrend && (
            <Badge 
              variant="outline" 
              className={`flex items-center gap-1 text-xs transition-all duration-300 ${getTrendColor(currentTrend)} ${isUpdating ? 'scale-105' : ''}`}
            >
              {getTrendIcon(currentTrend)}
              {currentTrend}
            </Badge>
          )}
        </div>
        
        {/* Live indicator */}
        <div className="flex items-center gap-2 mt-2">
          <div className={`w-2 h-2 rounded-full bg-success transition-all duration-300 ${isUpdating ? 'animate-pulse scale-125' : ''}`} />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </CardContent>
    </Card>
  );
};