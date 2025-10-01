import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Battery, 
  Zap, 
  TrendingUp, 
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { mockMicrogrids, calculateSystemMetrics, mockAlerts } from "@/lib/mockData";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RealTimeMetricCard } from "@/components/dashboard/RealTimeMetricCard";
import { NetworkMap } from "@/components/dashboard/NetworkMap";
import { SystemChart } from "@/components/dashboard/SystemChart";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";

const GlobalDashboard = () => {
  const systemMetrics = calculateSystemMetrics();
  
  const statusColors = {
    healthy: "success",
    warning: "warning", 
    critical: "destructive"
  } as const;

  const healthStatusColor = {
    normal: "success",
    warning: "warning",
    critical: "destructive"
  } as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Microgrid Network Overview</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of {mockMicrogrids.length} microgrids across Odisha
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          <Badge 
            variant={healthStatusColor[systemMetrics.systemHealth] as any}
            className="px-3 py-1"
          >
            System: {systemMetrics.systemHealth.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RealTimeMetricCard
          title="Total Generation"
          value={`${systemMetrics.totalGeneration.toLocaleString()}`}
          unit=" kW"
          icon={<Zap className="h-5 w-5 text-primary" />}
          trend={"+5.2%"}
          className="bg-gradient-energy text-white"
          valueRange={[0.9, 1.2]}
        />
        <RealTimeMetricCard
          title="Total Demand"
          value={`${systemMetrics.totalDemand.toLocaleString()}`}
          unit=" kW"
          icon={<TrendingUp className="h-5 w-5 text-primary" />}
          trend={"+2.1%"}
          valueRange={[0.85, 1.15]}
        />
        <RealTimeMetricCard
          title="Battery Storage"
          value={`${systemMetrics.totalBatteryStorage.toLocaleString()}`}
          unit=" kWh"
          icon={<Battery className="h-5 w-5 text-primary" />}
          trend={"-1.3%"}
          className="bg-gradient-success text-white"
          valueRange={[0.95, 1.05]}
        />
        <RealTimeMetricCard
          title="Average SOC"
          value={`${systemMetrics.averageSOC}`}
          unit="%"
          icon={<Activity className="h-5 w-5 text-primary" />}
          trend="+0.8%"
          valueRange={[0.92, 1.08]}
        />
      </div>

      {/* Network Map and Alerts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[500px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Network Map - Odisha District
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <NetworkMap microgrids={mockMicrogrids} />
            </CardContent>
          </Card>
        </div>
        
        <AlertsPanel alerts={mockAlerts} />
      </div>

      {/* System Status Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Microgrid Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(
              mockMicrogrids.reduce((acc, mg) => {
                acc[mg.status] = (acc[mg.status] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {status === 'healthy' && <CheckCircle className="h-4 w-4 text-success" />}
                  {status === 'warning' && <AlertTriangle className="h-4 w-4 text-warning" />}
                  {status === 'critical' && <XCircle className="h-4 w-4 text-critical" />}
                  <span className="capitalize font-medium">{status}</span>
                </div>
                <Badge variant={statusColors[status as keyof typeof statusColors] as any}>
                  {count}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Connectivity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="font-medium">Online</span>
              </div>
              <Badge variant="outline">{systemMetrics.onlineCount}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-critical" />
                <span className="font-medium">Offline</span>
              </div>
              <Badge variant="destructive">
                {systemMetrics.totalCount - systemMetrics.onlineCount}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Generation Efficiency</span>
              <Badge className="bg-gradient-energy">92.4%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Load Factor</span>
              <Badge variant="outline">87.1%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <SystemChart
          title="Generation vs Demand"
          type="area"
          className="h-[300px]"
        />
        <SystemChart
          title="Power Distribution by Microgrid"
          type="bar"
          className="h-[300px]"
        />
      </div>
    </div>
  );
};

export default GlobalDashboard;