import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Wifi, 
  Battery,
  Thermometer,
  Gauge,
  Server,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw
} from "lucide-react";
import { mockMicrogrids, calculateSystemMetrics } from "@/lib/mockData";
import { SystemChart } from "@/components/dashboard/SystemChart";
import { AnimatedGauge } from "@/components/dashboard/AnimatedGauge";
import { RealTimeLineChart } from "@/components/dashboard/RealTimeLineChart";
import { RealTimeMetricCard } from "@/components/dashboard/RealTimeMetricCard";
import { useRealTimeMicrogridData } from "@/hooks/useRealTimeData";

const SystemHealthPage = () => {
  const systemMetrics = calculateSystemMetrics();
  const microgridRealTimeData = useRealTimeMicrogridData();
  
  const [systemComponents, setSystemComponents] = useState([
    {
      name: "Communication Network",
      status: "healthy",
      uptime: 99.8,
      lastCheck: "Live",
      icon: <Wifi className="h-5 w-5" />
    },
    {
      name: "Data Processing",
      status: "healthy", 
      uptime: 99.5,
      lastCheck: "Live",
      icon: <Cpu className="h-5 w-5" />
    },
    {
      name: "Storage Systems",
      status: "warning",
      uptime: 97.2,
      lastCheck: "Live", 
      icon: <HardDrive className="h-5 w-5" />
    },
    {
      name: "Security Layer",
      status: "healthy",
      uptime: 99.9,
      lastCheck: "Live",
      icon: <Shield className="h-5 w-5" />
    }
  ]);

  const [performanceMetrics, setPerformanceMetrics] = useState([
    { label: "CPU Usage", value: 45, max: 100, unit: "%" },
    { label: "Memory Usage", value: 62, max: 100, unit: "%" },
    { label: "Disk Usage", value: 78, max: 100, unit: "%" },
    { label: "Network Load", value: 34, max: 100, unit: "%" }
  ]);

  // Update components and metrics with real-time variations
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemComponents(prev => prev.map(comp => ({
        ...comp,
        uptime: Math.max(95, Math.min(100, comp.uptime + (Math.random() - 0.5) * 0.5))
      })));

      setPerformanceMetrics(prev => prev.map(metric => ({
        ...metric,
        value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 8))
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-critical" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const overallHealthScore = Math.round(
    systemComponents.reduce((acc, comp) => acc + comp.uptime, 0) / systemComponents.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of system performance and component health
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge 
            variant={getStatusColor(systemMetrics.systemHealth) as any}
            className="px-4 py-2 text-sm"
          >
            Overall Status: {systemMetrics.systemHealth.toUpperCase()}
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Health Score */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Overall System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <AnimatedGauge 
                value={overallHealthScore} 
                size={120}
                color="hsl(var(--success))"
                label="Health Score"
              />
              <div>
                <div className="text-3xl font-bold text-success mb-1">
                  {overallHealthScore}%
                </div>
                <Badge variant="default" className="bg-success">
                  {overallHealthScore > 95 ? 'Excellent' : overallHealthScore > 85 ? 'Good' : 'Fair'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RealTimeMetricCard
          title="Microgrids Online"
          value={`${systemMetrics.onlineCount}/${systemMetrics.totalCount}`}
          icon={<Server className="h-5 w-5 text-primary" />}
          className="bg-gradient-energy text-white"
          valueRange={[1, 1]}
        />
        
        <RealTimeMetricCard
          title="System Uptime"
          value="98.7"
          unit="%"
          icon={<Activity className="h-5 w-5 text-primary" />}
          valueRange={[0.998, 1.002]}
        />
        
        <RealTimeMetricCard
          title="Avg Response Time"
          value="847"
          unit="ms"
          icon={<Gauge className="h-5 w-5 text-primary" />}
          valueRange={[0.8, 1.2]}
        />
        
        <RealTimeMetricCard
          title="Average SOC"
          value={`${systemMetrics.averageSOC}`}
          unit="%"
          icon={<Battery className="h-5 w-5 text-primary" />}
          valueRange={[0.95, 1.05]}
        />
      </div>

      {/* System Components Health */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Components Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {systemComponents.map((component, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg border bg-gradient-card hover:shadow-hover transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {component.icon}
                    <span className="font-medium">{component.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(component.status)}
                    <Badge variant={getStatusColor(component.status) as any} className="text-xs">
                      {component.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Uptime</span>
                      <span className="font-medium">{component.uptime.toFixed(1)}%</span>
                    </div>
                    <Progress value={component.uptime} className="h-2" />
                  </div>
                  <AnimatedGauge 
                    value={component.uptime} 
                    size={60}
                    color={component.uptime > 99 ? 'hsl(var(--success))' : component.uptime > 97 ? 'hsl(var(--warning))' : 'hsl(var(--critical))'}
                    showValue={false}
                  />
                </div>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span>Status: {component.lastCheck}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Resource Utilization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="space-y-3 p-4 rounded-lg bg-muted/30">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{metric.label}</span>
                  <span className="font-mono">{Math.round(metric.value)}{metric.unit}</span>
                </div>
                <Progress 
                  value={metric.value} 
                  className={`h-2 ${
                    metric.value > 80 ? '[&>div]:bg-critical' : 
                    metric.value > 60 ? '[&>div]:bg-warning' : 
                    '[&>div]:bg-success'
                  }`}
                />
                <div className="flex justify-center">
                  <AnimatedGauge 
                    value={metric.value} 
                    size={80}
                    color={metric.value > 80 ? 'hsl(var(--critical))' : metric.value > 60 ? 'hsl(var(--warning))' : 'hsl(var(--success))'}
                    showValue={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Performance Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RealTimeLineChart 
          title="System Efficiency Trends"
          dataKey="efficiency"
          color="hsl(var(--primary))"
          unit="%"
          height={250}
        />
        <RealTimeLineChart 
          title="Temperature Monitoring"
          dataKey="temperature"
          color="hsl(var(--warning))"
          unit="°C"
          height={250}
        />
      </div>

      {/* Health Trends */}
      <div className="grid lg:grid-cols-2 gap-6">
        <SystemChart 
          title="Generation vs Demand Trends"
          type="area"
          className="h-[300px]"
        />
        <SystemChart 
          title="Component Performance Analysis"
          type="line"
          className="h-[300px]"
        />
      </div>

      {/* Microgrid Health Summary */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Individual Microgrid Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockMicrogrids.map((microgrid) => {
              const realTimeData = microgridRealTimeData[microgrid.id];
              return (
                <div 
                  key={microgrid.id}
                  className="p-4 rounded-lg border bg-gradient-card hover:shadow-hover transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-sm">{microgrid.name}</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(microgrid.status)}
                      <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <AnimatedGauge 
                      value={realTimeData?.soc || microgrid.batterySOC} 
                      size={60}
                      color="hsl(var(--success))"
                      unit="%"
                      label="SOC"
                    />
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Efficiency</div>
                      <div className="font-bold text-primary">
                        {Math.round(realTimeData?.efficiency || microgrid.efficiency)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Generation:</span>
                      <span className="font-medium">{Math.round(realTimeData?.generation || microgrid.powerGenerated)} kW</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Temperature:</span>
                      <span className="font-medium flex items-center gap-1">
                        <Thermometer className="h-3 w-3" />
                        {Math.round(realTimeData?.temperature || microgrid.batteryTemp)}°C
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealthPage;