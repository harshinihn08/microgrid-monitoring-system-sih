export interface Microgrid {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number];
  status: 'healthy' | 'warning' | 'critical';
  powerGenerated: number; // kW
  powerStored: number; // kWh
  powerDelivered: number; // kW
  batterySOC: number; // %
  batteryTemp: number; // °C
  efficiency: number; // %
  ratedVoltage: number; // V
  ratedCurrent: number; // A
  lastMaintenance: string;
  nextMaintenance: string;
  isOnline: boolean;
}

export interface SystemMetrics {
  totalGeneration: number;
  totalDemand: number;
  totalBatteryStorage: number;
  averageSOC: number;
  systemHealth: 'normal' | 'warning' | 'critical';
  onlineCount: number;
  totalCount: number;
}

export interface Alert {
  id: string;
  microgridId: string;
  microgridName: string;
  type: 'warning' | 'critical' | 'info';
  message: string;
  timestamp: string;
  isRead: boolean;
}

// Mock data for Odisha district microgrids
export const mockMicrogrids: Microgrid[] = [
  {
    id: 'mg-001',
    name: 'Bhubaneswar Central',
    location: 'Bhubaneswar, Khordha',
    coordinates: [85.8245, 20.2961],
    status: 'healthy',
    powerGenerated: 450,
    powerStored: 780,
    powerDelivered: 420,
    batterySOC: 85,
    batteryTemp: 32,
    efficiency: 93.3,
    ratedVoltage: 415,
    ratedCurrent: 650,
    lastMaintenance: '2025-08-15',
    nextMaintenance: '2025-11-15',
    isOnline: true,
  },
  {
    id: 'mg-002',
    name: 'Cuttack Industrial',
    location: 'Cuttack, Cuttack',
    coordinates: [85.8795, 20.4625],
    status: 'warning',
    powerGenerated: 320,
    powerStored: 560,
    powerDelivered: 385,
    batterySOC: 65,
    batteryTemp: 38,
    efficiency: 85.2,
    ratedVoltage: 415,
    ratedCurrent: 500,
    lastMaintenance: '2025-07-20',
    nextMaintenance: '2025-10-20',
    isOnline: true,
  },
  {
    id: 'mg-003',
    name: 'Puri Coastal',
    location: 'Puri, Puri',
    coordinates: [85.8312, 19.8135],
    status: 'healthy',
    powerGenerated: 380,
    powerStored: 690,
    powerDelivered: 365,
    batterySOC: 78,
    batteryTemp: 35,
    efficiency: 91.8,
    ratedVoltage: 415,
    ratedCurrent: 580,
    lastMaintenance: '2025-09-01',
    nextMaintenance: '2025-12-01',
    isOnline: true,
  },
  {
    id: 'mg-004',
    name: 'Berhampur South',
    location: 'Berhampur, Ganjam',
    coordinates: [84.7941, 19.3149],
    status: 'critical',
    powerGenerated: 180,
    powerStored: 240,
    powerDelivered: 195,
    batterySOC: 22,
    batteryTemp: 45,
    efficiency: 72.5,
    ratedVoltage: 415,
    ratedCurrent: 400,
    lastMaintenance: '2025-06-10',
    nextMaintenance: '2025-09-10',
    isOnline: false,
  },
  {
    id: 'mg-005',
    name: 'Sambalpur West',
    location: 'Sambalpur, Sambalpur',
    coordinates: [83.9712, 21.4669],
    status: 'healthy',
    powerGenerated: 520,
    powerStored: 890,
    powerDelivered: 485,
    batterySOC: 92,
    batteryTemp: 29,
    efficiency: 96.1,
    ratedVoltage: 415,
    ratedCurrent: 750,
    lastMaintenance: '2025-09-10',
    nextMaintenance: '2025-12-10',
    isOnline: true,
  },
  {
    id: 'mg-006',
    name: 'Balasore North',
    location: 'Balasore, Balasore',
    coordinates: [86.9343, 21.4934],
    status: 'warning',
    powerGenerated: 280,
    powerStored: 420,
    powerDelivered: 310,
    batterySOC: 48,
    batteryTemp: 41,
    efficiency: 81.7,
    ratedVoltage: 415,
    ratedCurrent: 450,
    lastMaintenance: '2025-07-25',
    nextMaintenance: '2025-10-25',
    isOnline: true,
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    microgridId: 'mg-004',
    microgridName: 'Berhampur South',
    type: 'critical',
    message: 'Battery SOC below 25% - Immediate attention required',
    timestamp: '2025-10-01T14:30:00Z',
    isRead: false,
  },
  {
    id: 'alert-002',
    microgridId: 'mg-002',
    microgridName: 'Cuttack Industrial',
    type: 'warning',
    message: 'High battery temperature detected (38°C)',
    timestamp: '2025-10-01T13:45:00Z',
    isRead: false,
  },
  {
    id: 'alert-003',
    microgridId: 'mg-006',
    microgridName: 'Balasore North',
    type: 'warning',
    message: 'Efficiency dropped below 85%',
    timestamp: '2025-10-01T12:15:00Z',
    isRead: true,
  },
];

export const calculateSystemMetrics = (): SystemMetrics => {
  const totalGeneration = mockMicrogrids.reduce((sum, mg) => sum + mg.powerGenerated, 0);
  const totalDemand = mockMicrogrids.reduce((sum, mg) => sum + mg.powerDelivered, 0);
  const totalBatteryStorage = mockMicrogrids.reduce((sum, mg) => sum + mg.powerStored, 0);
  const averageSOC = mockMicrogrids.reduce((sum, mg) => sum + mg.batterySOC, 0) / mockMicrogrids.length;
  
  const criticalCount = mockMicrogrids.filter(mg => mg.status === 'critical').length;
  const warningCount = mockMicrogrids.filter(mg => mg.status === 'warning').length;
  
  let systemHealth: 'normal' | 'warning' | 'critical' = 'normal';
  if (criticalCount > 0) systemHealth = 'critical';
  else if (warningCount > 0) systemHealth = 'warning';
  
  const onlineCount = mockMicrogrids.filter(mg => mg.isOnline).length;
  
  return {
    totalGeneration,
    totalDemand,
    totalBatteryStorage,
    averageSOC: Math.round(averageSOC * 10) / 10,
    systemHealth,
    onlineCount,
    totalCount: mockMicrogrids.length,
  };
};

// Time series data for charts
export const generateTimeSeriesData = (days: number = 7) => {
  const data = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      timestamp: date.toISOString(),
      generation: Math.floor(Math.random() * 500) + 1500,
      demand: Math.floor(Math.random() * 400) + 1400,
      storage: Math.floor(Math.random() * 200) + 3000,
      efficiency: Math.floor(Math.random() * 15) + 85,
    });
  }
  
  return data;
};