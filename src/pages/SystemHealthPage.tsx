import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Clock
} from "lucide-react";
import { mockMicrogrids, calculateSystemMetrics } from "@/lib/mockData";
import { SystemChart } from "@/components/dashboard/SystemChart";

const SystemHealthPage = () => {
  const systemMetrics = calculateSystemMetrics();
  
  const systemComponents = [
    {
      name: "Communication Network",
      status: "healthy",
      uptime: 99.8,
      lastCheck: "2 minutes ago",
      icon: <Wifi className="h-5 w-5" />
    },
    {
      name: "Data Processing",
      status: "healthy", 
      uptime: 99.5,
      lastCheck: "1 minute ago",
      icon: <Cpu className="h-5 w-5" />
    },
    {
      name: "Storage Systems",
      status: "warning",
      uptime: 97.2,
      lastCheck: "5 minutes ago", 
      icon: <HardDrive className="h-5 w-5" />
    },
    {
      name: "Security Layer",
      status: "healthy",
      uptime: 99.9,
      lastCheck: "30 seconds ago",
      icon: <Shield className="h-5 w-5" />
    }
  ];

  const performanceMetrics = [
    { label: "CPU Usage", value: 45, max: 100, unit: "%" },
    { label: "Memory Usage", value: 62, max: 100, unit: "%" },
    { label: "Disk Usage", value: 78, max: 100, unit: "%" },
    { label: "Network Load", value: 34, max: 100, unit: "%" }
  ];

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
          <p className="text-muted-foreground">
            Monitor overall system performance and component health
          </p>
        </div>
        <Badge 
          variant={getStatusColor(systemMetrics.systemHealth) as any}
          className="px-4 py-2 text-sm"
        >
          Overall Status: {systemMetrics.systemHealth.toUpperCase()}
        </Badge>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-energy text-white">
          <CardContent className="p-6 text-center">
            <Server className="h-8 w-8 mx-auto mb-3" />
            <div className="text-2xl font-bold">{systemMetrics.onlineCount}/{systemMetrics.totalCount}</div>
            <div className="text-sm opacity-90">Microgrids Online</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Activity className="h-8 w-8 mx-auto mb-3 text-success" />
            <div className="text-2xl font-bold">98.7%</div>
            <div className="text-sm text-muted-foreground">System Uptime</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Gauge className="h-8 w-8 mx-auto mb-3 text-primary" />
            <div className="text-2xl font-bold">847ms</div>
            <div className="text-sm text-muted-foreground">Avg Response Time</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Battery className="h-8 w-8 mx-auto mb-3 text-warning" />
            <div className="text-2xl font-bold">{systemMetrics.averageSOC}%</div>
            <div className="text-sm text-muted-foreground">Average SOC</div>
          </CardContent>
        </Card>
      </div>

      {/* System Components Health */}
      <Card>
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
                className="p-4 rounded-lg border bg-gradient-card hover:shadow-card transition-all"
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
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uptime</span>
                    <span className="font-medium">{component.uptime}%</span>
                  </div>
                  <Progress value={component.uptime} className="h-2" />
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Last checked: {component.lastCheck}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Resource Utilization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{metric.label}</span>
                  <span>{metric.value}{metric.unit}</span>
                </div>
                <Progress 
                  value={metric.value} 
                  className={`h-2 ${
                    metric.value > 80 ? '[&>div]:bg-critical' : 
                    metric.value > 60 ? '[&>div]:bg-warning' : 
                    '[&>div]:bg-success'
                  }`}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              Temperature Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockMicrogrids.slice(0, 4).map((microgrid) => (
              <div key={microgrid.id} className="flex items-center justify-between">
                <span className="text-sm font-medium">{microgrid.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{microgrid.batteryTemp}°C</span>
                  <div className={`w-2 h-2 rounded-full ${
                    microgrid.batteryTemp > 40 ? 'bg-critical' :
                    microgrid.batteryTemp > 35 ? 'bg-warning' :
                    'bg-success'
                  }`} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Health Trends */}
      <div className="grid lg:grid-cols-2 gap-6">
        <SystemChart 
          title="System Performance Trends"
          type="line"
          className="h-[300px]"
        />
        <SystemChart 
          title="Component Health Over Time"
          type="area"
          className="h-[300px]"
        />
      </div>

      {/* Microgrid Health Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Individual Microgrid Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockMicrogrids.map((microgrid) => (
              <div 
                key={microgrid.id}
                className="p-3 rounded-lg border bg-gradient-card hover:shadow-card transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{microgrid.name}</span>
                  {getStatusIcon(microgrid.status)}
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>SOC: {microgrid.batterySOC}%</div>
                  <div>Efficiency: {microgrid.efficiency}%</div>
                  <div>Temperature: {microgrid.batteryTemp}°C</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemHealthPage;