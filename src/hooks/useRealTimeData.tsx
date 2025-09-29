import { useState, useEffect, useCallback } from 'react';

export interface RealTimeDataPoint {
  timestamp: number;
  generation: number;
  demand: number;
  efficiency: number;
  soc: number;
  temperature: number;
}

export const useRealTimeData = (interval: number = 2000) => {
  const [data, setData] = useState<RealTimeDataPoint[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const generateDataPoint = useCallback((): RealTimeDataPoint => {
    const baseGeneration = 1200;
    const baseDemand = 1000;
    const baseEfficiency = 85;
    const baseSOC = 75;
    const baseTemp = 35;

    // Add realistic variations
    const timeVariation = Math.sin(Date.now() / 600000) * 0.3; // Slow daily cycle
    const randomVariation = (Math.random() - 0.5) * 0.2;

    return {
      timestamp: Date.now(),
      generation: Math.max(0, baseGeneration + (baseGeneration * (timeVariation + randomVariation))),
      demand: Math.max(0, baseDemand + (baseDemand * (timeVariation * 0.8 + randomVariation))),
      efficiency: Math.max(0, Math.min(100, baseEfficiency + (baseEfficiency * randomVariation * 0.1))),
      soc: Math.max(0, Math.min(100, baseSOC + (baseSOC * randomVariation * 0.15))),
      temperature: Math.max(0, baseTemp + (baseTemp * randomVariation * 0.2))
    };
  }, []);

  useEffect(() => {
    // Initialize with some historical data
    const initialData: RealTimeDataPoint[] = [];
    const now = Date.now();
    
    for (let i = 30; i >= 0; i--) {
      const timestamp = now - (i * interval);
      const dataPoint = {
        ...generateDataPoint(),
        timestamp
      };
      initialData.push(dataPoint);
    }
    
    setData(initialData);

    const intervalId = setInterval(() => {
      setIsAnimating(true);
      
      setData(prevData => {
        const newPoint = generateDataPoint();
        const newData = [...prevData.slice(-29), newPoint]; // Keep last 30 points
        return newData;
      });

      // Reset animation state after a brief moment
      setTimeout(() => setIsAnimating(false), 100);
    }, interval);

    return () => clearInterval(intervalId);
  }, [interval, generateDataPoint]);

  return { data, isAnimating };
};

export const useRealTimeMicrogridData = () => {
  const [microgridData, setMicrogridData] = useState<Record<string, RealTimeDataPoint>>({});

  useEffect(() => {
    const updateMicrogridData = () => {
      const microgrids = ['MG-001', 'MG-002', 'MG-003', 'MG-004', 'MG-005', 'MG-006'];
      
      const newData: Record<string, RealTimeDataPoint> = {};
      
      microgrids.forEach(id => {
        const base = {
          'MG-001': { gen: 850, demand: 720, eff: 92, soc: 85, temp: 32 },
          'MG-002': { gen: 1200, demand: 980, eff: 88, soc: 72, temp: 38 },
          'MG-003': { gen: 950, demand: 850, eff: 90, soc: 78, temp: 35 },
          'MG-004': { gen: 1100, demand: 920, eff: 86, soc: 68, temp: 40 },
          'MG-005': { gen: 780, demand: 650, eff: 94, soc: 82, temp: 30 },
          'MG-006': { gen: 1050, demand: 890, eff: 89, soc: 75, temp: 36 }
        }[id] || { gen: 1000, demand: 800, eff: 88, soc: 75, temp: 35 };

        const variation = (Math.random() - 0.5) * 0.15;
        const timeVariation = Math.sin(Date.now() / 900000) * 0.2;

        newData[id] = {
          timestamp: Date.now(),
          generation: Math.max(0, base.gen * (1 + timeVariation + variation)),
          demand: Math.max(0, base.demand * (1 + timeVariation * 0.8 + variation)),
          efficiency: Math.max(0, Math.min(100, base.eff * (1 + variation * 0.1))),
          soc: Math.max(0, Math.min(100, base.soc * (1 + variation * 0.1))),
          temperature: Math.max(0, base.temp * (1 + variation * 0.2))
        };
      });

      setMicrogridData(newData);
    };

    updateMicrogridData();
    const interval = setInterval(updateMicrogridData, 3000);

    return () => clearInterval(interval);
  }, []);

  return microgridData;
};