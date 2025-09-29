import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface AnimatedGaugeProps {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showValue?: boolean;
  label?: string;
  unit?: string;
  animate?: boolean;
}

export const AnimatedGauge = ({
  value,
  maxValue = 100,
  size = 120,
  strokeWidth = 8,
  color = "hsl(var(--primary))",
  backgroundColor = "hsl(var(--muted))",
  showValue = true,
  label,
  unit = "%",
  animate = true
}: AnimatedGaugeProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setAnimatedValue(value);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedValue(value);
    }
  }, [value, animate]);

  const percentage = Math.min((animatedValue / maxValue) * 100, 100);
  
  const data = [
    { name: 'completed', value: percentage },
    { name: 'remaining', value: 100 - percentage }
  ];

  const COLORS = [color, backgroundColor];

  return (
    <div className="relative inline-flex items-center justify-center">
      <ResponsiveContainer width={size} height={size}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={90}
            endAngle={-270}
            innerRadius={size * 0.35}
            outerRadius={size * 0.45}
            dataKey="value"
            stroke="none"
            animationDuration={animate ? 1000 : 0}
            animationBegin={0}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index]} 
                opacity={index === 0 ? 1 : 0.2}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-lg font-bold text-foreground">
            {Math.round(animatedValue)}{unit}
          </div>
          {label && (
            <div className="text-xs text-muted-foreground mt-1">
              {label}
            </div>
          )}
        </div>
      )}
    </div>
  );
};