import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MapPin, 
  Zap, 
  Battery, 
  Activity, 
  Wifi, 
  WifiOff,
  ExternalLink
} from "lucide-react";
import { mockMicrogrids } from "@/lib/mockData";

const MicrogridsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "healthy" | "warning" | "critical">("all");

  const filteredMicrogrids = mockMicrogrids.filter(microgrid => {
    const matchesSearch = microgrid.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         microgrid.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || microgrid.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    healthy: "default",
    warning: "secondary", 
    critical: "destructive"
  } as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Microgrids</h1>
          <p className="text-muted-foreground">
            Manage and monitor all {mockMicrogrids.length} microgrids in your network
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search microgrids..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "healthy", "warning", "critical"] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Microgrids Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMicrogrids.map((microgrid) => (
          <Card key={microgrid.id} className="hover:shadow-hover transition-all duration-200 group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {microgrid.name}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {microgrid.location}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusColors[microgrid.status]}>
                    {microgrid.status}
                  </Badge>
                  {microgrid.isOnline ? (
                    <Wifi className="h-4 w-4 text-success" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-critical" />
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="font-medium">{microgrid.powerGenerated}kW</span>
                </div>
                <div className="flex items-center gap-2">
                  <Battery className="h-4 w-4 text-success" />
                  <span className="font-medium">{microgrid.batterySOC}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-warning" />
                  <span className="font-medium">{microgrid.efficiency}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${microgrid.isOnline ? 'bg-success' : 'bg-critical'}`} />
                  <span className="font-medium">{microgrid.isOnline ? 'Online' : 'Offline'}</span>
                </div>
              </div>

              {/* Additional Info */}
              <div className="pt-2 border-t text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Last Maintenance:</span>
                  <span>{new Date(microgrid.lastMaintenance).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Next Maintenance:</span>
                  <span>{new Date(microgrid.nextMaintenance).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Link to={`/microgrids/${microgrid.id}`} className="flex-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    View Details
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredMicrogrids.length === 0 && (
        <Card className="p-12 text-center">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">No microgrids found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MicrogridsPage;