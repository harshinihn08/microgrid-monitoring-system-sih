import { useState } from "react";
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
  Clock
} from "lucide-react";
import { mockAlerts } from "@/lib/mockData";

const AlertsPage = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [alerts, setAlerts] = useState(mockAlerts);

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            label: "Critical", 
            count: alerts.filter(a => a.type === 'critical').length,
            color: "destructive"
          },
          { 
            label: "Warning", 
            count: alerts.filter(a => a.type === 'warning').length,
            color: "secondary"
          },
          { 
            label: "Info", 
            count: alerts.filter(a => a.type === 'info').length,
            color: "default"
          },
          { 
            label: "Unread", 
            count: unreadCount,
            color: "outline"
          }
        ].map((item) => (
          <Card key={item.label} className="cursor-pointer hover:shadow-card transition-all">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{item.count}</div>
              <div className="text-sm text-muted-foreground">{item.label} Alerts</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
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
            className={`cursor-pointer hover:shadow-card transition-all ${
              !alert.isRead ? 'border-l-4 border-l-primary bg-primary/5' : ''
            }`}
            onClick={() => markAsRead(alert.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getAlertIcon(alert.type)}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getAlertVariant(alert.type) as any} className="text-xs">
                          {alert.type.toUpperCase()}
                        </Badge>
                        <span className="font-medium text-sm">{alert.microgridName}</span>
                        {!alert.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                      <p className="text-sm mt-1 text-foreground">
                        {alert.message}
                      </p>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="p-1">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
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