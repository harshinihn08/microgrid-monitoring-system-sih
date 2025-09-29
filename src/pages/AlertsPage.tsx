import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Search,
  Filter,
  MoreVertical,
  Clock,
  Activity
} from "lucide-react";
import { mockAlerts } from "@/lib/mockData";
import { SystemChart } from "@/components/dashboard/SystemChart";
import { RealTimeLineChart } from "@/components/dashboard/RealTimeLineChart";

const AlertsPage = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [alerts, setAlerts] = useState(mockAlerts);
  const [alertStats, setAlertStats] = useState({
    total: mockAlerts.length,
    critical: mockAlerts.filter(a => a.type === 'critical').length,
    warning: mockAlerts.filter(a => a.type === 'warning').length,
    info: mockAlerts.filter(a => a.type === 'info').length,
    resolved: Math.floor(mockAlerts.length * 0.3)
  });

  // Simulate real-time alert updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new alerts occasionally
      if (Math.random() < 0.1) {
        const mgId = `MG-00${Math.floor(Math.random() * 6) + 1}`;
        const newAlert = {
          id: `alert-${Date.now()}`,
          type: ['critical', 'warning', 'info'][Math.floor(Math.random() * 3)] as 'critical' | 'warning' | 'info',
          message: [
            'Battery temperature spike detected',
            'Network connectivity restored', 
            'Generation capacity decreased',
            'Scheduled maintenance reminder',
            'Load balancing optimization completed'
          ][Math.floor(Math.random() * 5)],
          microgridId: mgId,
          microgridName: mgId,
          timestamp: new Date(),
          isRead: false
        };
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 29)]); // Keep last 30 alerts
      }
      
      // Update stats
      setAlertStats(prev => ({
        ...prev,
        total: prev.total + (Math.random() < 0.05 ? 1 : 0),
        resolved: prev.resolved + (Math.random() < 0.08 ? 1 : 0)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = filter === "all" || 
                         (filter === "unread" && !alert.isRead) ||
                         (filter !== "all" && filter !== "unread" && alert.type === filter);
    const matchesSearch = alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.microgridName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-critical" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'info':
        return <Info className="h-4 w-4 text-primary" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'info':
        return 'default';
      default:
        return 'outline';
    }
  };

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Alerts & Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="px-2 py-1">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            Monitor system alerts and notifications across your microgrid network
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { 
            label: "Critical", 
            count: alerts.filter(a => a.type === 'critical').length,
            color: "destructive",
            icon: <AlertTriangle className="h-5 w-5" />
          },
          { 
            label: "Warning", 
            count: alerts.filter(a => a.type === 'warning').length,
            color: "secondary",
            icon: <AlertTriangle className="h-5 w-5" />
          },
          { 
            label: "Info", 
            count: alerts.filter(a => a.type === 'info').length,
            color: "default",
            icon: <Info className="h-5 w-5" />
          },
          { 
            label: "Unread", 
            count: unreadCount,
            color: "outline",
            icon: <Bell className="h-5 w-5" />
          },
          { 
            label: "Resolved", 
            count: alertStats.resolved,
            color: "success",
            icon: <CheckCircle className="h-5 w-5" />
          }
        ].map((item) => (
          <Card 
            key={item.label} 
            className="cursor-pointer hover:shadow-hover transition-all duration-300 bg-gradient-card border-border/50"
          >
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                {item.icon}
              </div>
              <div className="text-2xl font-bold mb-1">{item.count}</div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
              <div className="mt-2 w-2 h-2 rounded-full bg-primary mx-auto animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alert Analytics */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RealTimeLineChart 
          title="Alert Frequency Trends"
          dataKey="generation"
          color="hsl(var(--warning))"
          unit=" alerts"
          height={200}
        />
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Alert Resolution Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Avg Resolution Time</span>
                <span className="text-lg font-bold text-success">12.5 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Success Rate</span>
                <span className="text-lg font-bold text-primary">94.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Active Incidents</span>
                <span className="text-lg font-bold text-warning">{unreadCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Alerts</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <Card 
            key={alert.id} 
            className={`cursor-pointer hover:shadow-hover transition-all duration-300 bg-gradient-card border-border/50 ${
              !alert.isRead ? 'border-l-4 border-l-primary bg-primary/10 shadow-glow' : ''
            }`}
            onClick={() => markAsRead(alert.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 relative">
                  {getAlertIcon(alert.type)}
                  {!alert.isRead && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={getAlertVariant(alert.type) as any} 
                          className={`text-xs ${!alert.isRead ? 'animate-pulse' : ''}`}
                        >
                          {alert.type.toUpperCase()}
                        </Badge>
                        <span className="font-medium text-sm">{alert.microgridName}</span>
                        {!alert.isRead && (
                          <div className="flex items-center gap-1 text-xs text-primary font-medium">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            NEW
                          </div>
                        )}
                      </div>
                      <p className="text-sm mt-1 text-foreground">
                        {alert.message}
                      </p>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="p-1 hover:bg-accent/50">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Status: {alert.isRead ? 'Read' : 'Unread'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Alerts */}
      {filteredAlerts.length === 0 && (
        <Card className="p-12 text-center">
          <div className="space-y-3">
            <CheckCircle className="h-12 w-12 mx-auto text-success" />
            <div>
              <h3 className="text-lg font-medium">No alerts found</h3>
              <p className="text-muted-foreground">
                {searchTerm || filter !== "all" 
                  ? "Try adjusting your search criteria or filters" 
                  : "All systems are running smoothly"
                }
              </p>
            </div>
            {(searchTerm || filter !== "all") && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setFilter("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AlertsPage;