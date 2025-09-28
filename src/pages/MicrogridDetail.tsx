import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  MapPin, 
  Zap, 
  Battery, 
  Activity, 
  Thermometer,
  Gauge,
  Wifi,
  WifiOff,
  Wrench
} from "lucide-react";
import { mockMicrogrids } from "@/lib/mockData";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { SystemChart } from "@/components/dashboard/SystemChart";

const MicrogridDetail = () => {
  const { id } = useParams();
  const microgrid = mockMicrogrids.find(mg => mg.id === id);

  if (!microgrid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h2 className="text-2xl font-bold">Microgrid not found</h2>
        <Link to="/microgrids">
          <Button>Back to Microgrids</Button>
        </Link>
      </div>
    );
  }

  const statusColors = {
    healthy: "default",
    warning: "secondary", 
    critical: "destructive"
  } as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/microgrids">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{microgrid.name}</h1>
            <div className="flex items-center gap-4 text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {microgrid.location}
              </div>
              <Badge variant={statusColors[microgrid.status]}>
                {microgrid.status}
              </Badge>
              <div className="flex items-center gap-1">
                {microgrid.isOnline ? (
                  <>
                    <Wifi className="h-4 w-4 text-success" />
                    <span className="text-sm">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 text-critical" />
                    <span className="text-sm">Offline</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <Button>
          <Wrench className="h-4 w-4 mr-2" />
          Schedule Maintenance
        </Button>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Power Generated"
          value={`${microgrid.powerGenerated} kW`}
          icon={<Zap className="h-5 w-5" />}
          trend="+2.3%"
          className="bg-gradient-energy text-white"
        />
        <MetricCard
          title="Power Delivered"
          value={`${microgrid.powerDelivered} kW`}
          icon={<Activity className="h-5 w-5" />}
          trend="+1.8%"
        />
        <MetricCard
          title="Battery Storage" 
          value={`${microgrid.powerStored} kWh`}
          icon={<Battery className="h-5 w-5" />}
          trend="-0.5%"
          className="bg-gradient-success text-white"
        />
        <MetricCard
          title="Efficiency"
          value={`${microgrid.efficiency}%`}
          icon={<Gauge className="h-5 w-5" />}
          trend="+0.2%"
        />
      </div>

      {/* Battery Details & System Info */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Battery SOC */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Battery className="h-5 w-5" />
                Battery State of Charge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{microgrid.batterySOC}%</span>
                  <Badge variant={microgrid.batterySOC > 70 ? "default" : microgrid.batterySOC > 30 ? "secondary" : "destructive"}>
                    {microgrid.batterySOC > 70 ? "Good" : microgrid.batterySOC > 30 ? "Low" : "Critical"}
                  </Badge>
                </div>
                <Progress 
                  value={microgrid.batterySOC} 
                  className="h-3"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0%</span>
                  <span>Current: {microgrid.batterySOC}%</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Charts */}
          <div className="grid md:grid-cols-2 gap-4">
            <SystemChart 
              title="SOC vs Time"
              type="line"
              className="h-[250px]"
            />
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  Battery Temperature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold">{microgrid.batteryTemp}°C</div>
                  <Progress 
                    value={(microgrid.batteryTemp / 50) * 100} 
                    className="h-2"
                  />
                  <div className="text-sm text-muted-foreground">
                    Normal range: 20-40°C
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Rated Voltage</span>
                <span className="text-sm">{microgrid.ratedVoltage}V</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Rated Current</span>
                <span className="text-sm">{microgrid.ratedCurrent}A</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Coordinates</span>
                <span className="text-sm">{microgrid.coordinates[1].toFixed(4)}, {microgrid.coordinates[0].toFixed(4)}</span>
              </div>
            </div>

            <hr />

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Last Maintenance</span>
                <span className="text-sm">{new Date(microgrid.lastMaintenance).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Next Maintenance</span>
                <span className="text-sm">{new Date(microgrid.nextMaintenance).toLocaleDateString()}</span>
              </div>
            </div>

            <hr />

            <div className="space-y-3">
              <h4 className="font-medium">Health Indicators</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Voltage Stability</span>
                  <Badge variant="default" className="text-xs">Stable</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Frequency</span>
                  <Badge variant="default" className="text-xs">50.2 Hz</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Battery Health</span>
                  <Badge variant={microgrid.status === 'healthy' ? "default" : "secondary"} className="text-xs">
                    {microgrid.status === 'healthy' ? 'Excellent' : 'Good'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <SystemChart 
          title="Generation vs Load"
          type="area"
          className="h-[300px]"
        />
        <SystemChart 
          title="Efficiency Trend"
          type="line"
          className="h-[300px]"
        />
      </div>
    </div>
  );
};

export default MicrogridDetail;