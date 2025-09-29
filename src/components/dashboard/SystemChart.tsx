import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { generateTimeSeriesData, mockMicrogrids } from "@/lib/mockData";
import { useRealTimeData } from "@/hooks/useRealTimeData";

interface SystemChartProps {
  title: string;
  type: 'area' | 'bar' | 'line' | 'pie';
  className?: string;
}

export const SystemChart = ({ title, type, className }: SystemChartProps) => {
  const { data: realTimeData, isAnimating } = useRealTimeData(3000);
  const [microgridData, setMicrogridData] = useState(mockMicrogrids.map(mg => ({
    name: mg.name.split(' ')[0],
    generation: mg.powerGenerated,
    storage: mg.powerStored,
    efficiency: mg.efficiency,
    demand: mg.powerDelivered
  })));

  // Update microgrid data with real-time variations
  useEffect(() => {
    const interval = setInterval(() => {
      setMicrogridData(prev => prev.map(mg => ({
        ...mg,
        generation: Math.max(0, mg.generation * (0.85 + Math.random() * 0.3)),
        demand: Math.max(0, mg.demand * (0.9 + Math.random() * 0.2)),
        efficiency: Math.max(0, Math.min(100, mg.efficiency * (0.95 + Math.random() * 0.1)))
      })));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const pieData = microgridData.map(mg => ({
    name: mg.name,
    value: Math.round(mg.generation)
  }));

  const colors = [
    'hsl(var(--primary))', 
    'hsl(var(--success))', 
    'hsl(var(--warning))', 
    'hsl(var(--critical))',
    'hsl(200 70% 55%)',
    'hsl(280 60% 50%)'
  ];

  const formatTooltipValue = (value: number, name: string) => {
    const units = {
      generation: 'kW',
      demand: 'kW', 
      efficiency: '%',
      soc: '%',
      temperature: '°C'
    };
    return [`${Math.round(value)}${units[name as keyof typeof units] || ''}`, name];
  };

  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={realTimeData} 
              className={`transition-all duration-300 ${isAnimating ? 'animate-pulse' : ''}`}
            >
              <defs>
                <linearGradient id="colorGeneration" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-card)'
                }}
                formatter={formatTooltipValue}
                labelFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <Area 
                type="monotone" 
                dataKey="generation" 
                stroke="hsl(var(--primary))" 
                fill="url(#colorGeneration)"
                strokeWidth={2}
                animationDuration={800}
              />
              <Area 
                type="monotone" 
                dataKey="demand" 
                stroke="hsl(var(--success))" 
                fill="url(#colorDemand)"
                strokeWidth={2}
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={microgridData}
              className={`transition-all duration-300 ${isAnimating ? 'animate-pulse' : ''}`}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-card)'
                }}
                formatter={formatTooltipValue}
              />
              <Bar 
                dataKey="generation" 
                fill="url(#barGradient)"
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={realTimeData}
              className={`transition-all duration-300 ${isAnimating ? 'animate-pulse' : ''}`}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-card)'
                }}
                formatter={formatTooltipValue}
                labelFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <Line 
                type="monotone" 
                dataKey="efficiency" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', fill: 'hsl(var(--background))' }}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart className={`transition-all duration-300 ${isAnimating ? 'animate-pulse' : ''}`}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="hsl(var(--primary))"
                dataKey="value"
                animationDuration={1000}
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-card)'
                }}
                formatter={(value) => [`${value} kW`, 'Generation']}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  if (!title) {
    return (
      <div className={className}>
        {renderChart()}
      </div>
    );
  }

  return (
    <Card className={`${className} bg-gradient-card border-border/50 shadow-card hover:shadow-hover transition-all duration-300`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <div className={`w-2 h-2 rounded-full bg-primary ${isAnimating ? 'animate-pulse' : ''}`} />
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        {renderChart()}
      </CardContent>
    </Card>
  );
};