import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  Zap,
  Battery,
  Activity,
  Target
} from "lucide-react";
import { SystemChart } from "@/components/dashboard/SystemChart";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RealTimeMetricCard } from "@/components/dashboard/RealTimeMetricCard";

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("generation");

  const analyticsMetrics = [
    { 
      label: "Total Energy Generated", 
      value: "2,847 kWh", 
      trend: "+12.3%", 
      period: "vs last period",
      icon: <Zap className="h-5 w-5" />
    },
    { 
      label: "Peak Demand", 
      value: "1,892 kW", 
      trend: "+8.7%", 
      period: "vs last period",
      icon: <TrendingUp className="h-5 w-5" />
    },
    { 
      label: "Energy Stored", 
      value: "4,231 kWh", 
      trend: "-2.1%", 
      period: "vs last period",
      icon: <Battery className="h-5 w-5" />
    },
    { 
      label: "System Availability", 
      value: "98.7%", 
      trend: "+1.2%", 
      period: "vs last period",
      icon: <Activity className="h-5 w-5" />
    },
  ];

  const performanceInsights = [
    {
      title: "Peak Performance Hours",
      description: "Highest generation occurs between 10 AM - 2 PM",
      value: "1,245 kW avg",
      status: "good"
    },
    {
      title: "Load Factor Optimization", 
      description: "System efficiency can be improved by 3.2%",
      value: "87.4%",
      status: "warning"
    },
    {
      title: "Battery Utilization",
      description: "Optimal charging/discharging cycles maintained",
      value: "94.1%",
      status: "good"
    },
    {
      title: "Predictive Maintenance",
      description: "2 microgrids require attention within 30 days",
      value: "MG-002, MG-006",
      status: "attention"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive performance analysis and insights
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Analytics Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsMetrics.map((metric, index) => (
          <RealTimeMetricCard
            key={index}
            title={metric.label}
            value={metric.value.split(' ')[0]}
            unit={` ${metric.value.split(' ')[1] || ''}`}
            icon={metric.icon}
            trend={metric.trend}
            className={index === 0 ? "bg-gradient-energy text-white" : index === 2 ? "bg-gradient-success text-white" : ""}
            updateInterval={index === 0 ? 2000 : index === 1 ? 2500 : index === 2 ? 3000 : 3500}
            valueRange={index === 0 ? [0.95, 1.15] : index === 1 ? [0.9, 1.1] : index === 2 ? [0.98, 1.02] : [0.985, 1.005]}
          />
        ))}
      </div>

      {/* Performance Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Energy Generation Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <SystemChart type="area" title="" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Efficiency Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <SystemChart type="line" title="" />
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Performance Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {performanceInsights.map((insight, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg border bg-gradient-card hover:shadow-card transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">{insight.title}</h4>
                  <Badge 
                    variant={
                      insight.status === "good" ? "default" : 
                      insight.status === "warning" ? "secondary" : 
                      "destructive"
                    }
                    className="text-xs"
                  >
                    {insight.status === "good" ? "Optimal" : 
                     insight.status === "warning" ? "Optimize" : 
                     "Review"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {insight.description}
                </p>
                <div className="font-medium text-sm">
                  {insight.value}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Load Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            <SystemChart type="pie" title="" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Peak vs Off-Peak Usage</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            <SystemChart type="bar" title="" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Monthly Comparison</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            <SystemChart type="line" title="" />
          </CardContent>
        </Card>
      </div>

      {/* Forecasting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            7-Day Generation Forecast
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <SystemChart type="area" title="" />
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;