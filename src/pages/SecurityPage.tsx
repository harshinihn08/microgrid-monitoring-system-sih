import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  UserCheck,
  Activity,
  Globe,
  Database,
  Wifi,
  Settings
} from "lucide-react";

const SecurityPage = () => {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    encryptionEnabled: true,
    auditLogging: true,
    intrusionDetection: true,
    automaticBackup: false,
    secureProtocols: true
  });

  const securityMetrics = [
    {
      title: "Security Score",
      value: "94/100",
      status: "excellent",
      icon: <Shield className="h-5 w-5" />
    },
    {
      title: "Active Threats",
      value: "0",
      status: "secure",
      icon: <AlertTriangle className="h-5 w-5" />
    },
    {
      title: "Failed Logins (24h)",
      value: "3",
      status: "normal",
      icon: <Lock className="h-5 w-5" />
    },
    {
      title: "System Vulnerabilities", 
      value: "1 Low",
      status: "attention",
      icon: <Eye className="h-5 w-5" />
    }
  ];

  const securityLogs = [
    {
      timestamp: "2025-10-01 14:32:10",
      event: "User login successful",
      user: "admin@microgrid.com",
      ip: "192.168.1.100",
      status: "success"
    },
    {
      timestamp: "2025-10-01 14:15:45", 
      event: "Security scan completed",
      user: "System",
      ip: "Local",
      status: "info"
    },
    {
      timestamp: "2025-10-01 13:58:23",
      event: "Failed login attempt",
      user: "unknown@example.com", 
      ip: "203.145.67.89",
      status: "warning"
    },
    {
      timestamp: "2025-10-01 13:45:12",
      event: "Encryption key rotated",
      user: "System",
      ip: "Local", 
      status: "success"
    },
    {
      timestamp: "2025-10-01 13:30:05",
      event: "Firewall rule updated",
      user: "admin@microgrid.com",
      ip: "192.168.1.100",
      status: "info"
    }
  ];

  const accessPolicies = [
    {
      name: "Network Access Control",
      description: "Restrict access to authorized networks only",
      enabled: true,
      icon: <Wifi className="h-4 w-4" />
    },
    {
      name: "Database Encryption",
      description: "Encrypt all sensitive data at rest and in transit",
      enabled: true,
      icon: <Database className="h-4 w-4" />
    },
    {
      name: "Multi-Factor Authentication",
      description: "Require additional verification for all logins",
      enabled: true,
      icon: <Key className="h-4 w-4" />
    },
    {
      name: "Session Management",
      description: "Automatic session timeout and secure handling",
      enabled: true,
      icon: <UserCheck className="h-4 w-4" />
    },
    {
      name: "API Rate Limiting",
      description: "Prevent abuse with request rate limitations",
      enabled: false,
      icon: <Globe className="h-4 w-4" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'secure':
      case 'success':
        return 'bg-success';
      case 'normal':
      case 'info':
        return 'bg-primary';
      case 'attention':
      case 'warning':
        return 'bg-warning';
      case 'critical':
        return 'bg-critical';
      default:
        return 'bg-muted';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-3 w-3 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-3 w-3 text-warning" />;
      case 'info':
        return <Activity className="h-3 w-3 text-primary" />;
      default:
        return <CheckCircle className="h-3 w-3" />;
    }
  };

  const handleSettingChange = (setting: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security & Access Control</h1>
          <p className="text-muted-foreground">
            Monitor and manage security policies, access controls, and threat detection
          </p>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          Security Settings
        </Button>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {securityMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-card transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div className={`p-3 rounded-full ${getStatusColor(metric.status)} text-white`}>
                  {metric.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Policies */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Access Policies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {accessPolicies.map((policy, index) => (
              <div key={index} className="flex items-start justify-between p-3 rounded-lg border bg-gradient-card">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-primary/10 text-primary">
                    {policy.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="font-medium text-sm">{policy.name}</div>
                    <div className="text-xs text-muted-foreground">{policy.description}</div>
                  </div>
                </div>
                <Switch 
                  checked={policy.enabled}
                  onCheckedChange={() => {}}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Security Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(securitySettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {key === 'twoFactorAuth' && 'Additional security layer for authentication'}
                    {key === 'encryptionEnabled' && 'Encrypt all data communications'}
                    {key === 'auditLogging' && 'Log all security-related events'}
                    {key === 'intrusionDetection' && 'Monitor for suspicious activities'}
                    {key === 'automaticBackup' && 'Regular security backups'}
                    {key === 'secureProtocols' && 'Use only secure communication protocols'}
                  </div>
                </div>
                <Switch 
                  checked={value}
                  onCheckedChange={() => handleSettingChange(key)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Security Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Security Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityLogs.map((log, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getStatusBadge(log.status)}
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{log.event}</div>
                    <div className="text-xs text-muted-foreground">
                      {log.user} • {log.ip}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {log.timestamp}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Security Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 rounded-lg border-l-4 border-l-warning bg-warning/10">
              <div className="font-medium text-sm mb-1">Enable Automatic Backups</div>
              <div className="text-xs text-muted-foreground">
                Regular security backups help ensure data recovery in case of incidents.
              </div>
            </div>
            <div className="p-3 rounded-lg border-l-4 border-l-primary bg-primary/10">
              <div className="font-medium text-sm mb-1">Update Security Certificates</div>
              <div className="text-xs text-muted-foreground">
                SSL certificates expire in 45 days. Schedule renewal to maintain secure connections.
              </div>
            </div>
            <div className="p-3 rounded-lg border-l-4 border-l-success bg-success/10">
              <div className="font-medium text-sm mb-1">Security Scan Complete</div>
              <div className="text-xs text-muted-foreground">
                Last security scan completed successfully with no critical vulnerabilities found.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityPage;