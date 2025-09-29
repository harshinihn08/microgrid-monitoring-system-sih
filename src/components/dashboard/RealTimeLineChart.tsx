import { useEffect, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRealTimeData } from "@/hooks/useRealTimeData";

interface RealTimeLineChartProps {
  title: string;
  dataKey: keyof ReturnType<typeof useRealTimeData>['data'][0];
  color?: string;
  unit?: string;
  height?: number;
  showGradient?: boolean;
}

export const RealTimeLineChart = ({ 
  title, 
  dataKey, 
  color = "hsl(var(--primary))",
  unit = "",
  height = 200,
  showGradient = true
}: RealTimeLineChartProps) => {
  const { data, isAnimating } = useRealTimeData(2000);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAnimating && chartRef.current) {
      chartRef.current.classList.add('animate-pulse');
      const timer = setTimeout(() => {
        chartRef.current?.classList.remove('animate-pulse');
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const formatTooltipValue = (value: number) => {
    return [`${Math.round(value)}${unit}`, title];
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-hover transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <span>{title}</span>
          <div className={`w-2 h-2 rounded-full bg-primary transition-all duration-300 ${isAnimating ? 'animate-ping' : ''}`} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <defs>
                {showGradient && (
                  <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
                  </linearGradient>
                )}
              </defs>
              <XAxis 
                dataKey="timestamp"
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-card)',
                  fontSize: '12px'
                }}
                formatter={formatTooltipValue}
                labelFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <Line 
                type="monotone" 
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: color }}
                animationDuration={600}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};