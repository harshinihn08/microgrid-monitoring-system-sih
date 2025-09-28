import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Zap, Battery, Activity } from "lucide-react";
import type { Microgrid } from "@/lib/mockData";

interface NetworkMapProps {
  microgrids: Microgrid[];
}

export const NetworkMap = ({ microgrids }: NetworkMapProps) => {
  const [selectedMicrogrid, setSelectedMicrogrid] = useState<string | null>(null);

  const statusColors = {
    healthy: "bg-success",
    warning: "bg-warning", 
    critical: "bg-critical"
  };

  const statusBorderColors = {
    healthy: "border-success",
    warning: "border-warning",
    critical: "border-critical"
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-primary/5 to-success/5 rounded-lg overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 800 600" className="w-full h-full">
          {/* Simplified Odisha outline */}
          <path
            d="M150 100 Q200 80 250 90 Q300 85 350 100 Q400 95 450 110 Q500 105 550 120 Q580 130 600 150 Q620 180 610 220 Q605 260 590 300 Q580 340 560 380 Q540 420 510 450 Q480 480 440 500 Q400 510 360 505 Q320 500 280 485 Q240 470 200 450 Q160 430 130 400 Q100 370 90 330 Q85 290 95 250 Q100 210 110 170 Q120 130 150 100 Z"
            fill="currentColor"
            className="text-muted/20"
          />
        </svg>
      </div>

      {/* Microgrid Markers */}
      {microgrids.map((microgrid) => {
        // Convert coordinates to map positions (simplified)
        const x = ((microgrid.coordinates[0] - 83.5) / 3.5) * 100; // Longitude
        const y = 100 - ((microgrid.coordinates[1] - 19) / 3) * 100; // Latitude (inverted for SVG)

        return (
          <div
            key={microgrid.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ left: `${Math.max(10, Math.min(90, x))}%`, top: `${Math.max(10, Math.min(90, y))}%` }}
            onClick={() => setSelectedMicrogrid(selectedMicrogrid === microgrid.id ? null : microgrid.id)}
          >
            {/* Marker */}
            <div className={`w-4 h-4 rounded-full ${statusColors[microgrid.status]} border-2 border-white shadow-lg group-hover:scale-125 transition-transform`}>
              <div className={`w-8 h-8 rounded-full ${statusColors[microgrid.status]} opacity-20 -translate-x-2 -translate-y-2 animate-ping`} />
            </div>

            {/* Hover Label */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <div className="bg-card border rounded-lg px-2 py-1 text-xs whitespace-nowrap shadow-lg">
                {microgrid.name}
              </div>
            </div>

            {/* Selected Info Panel */}
            {selectedMicrogrid === microgrid.id && (
              <Card className="absolute top-6 left-1/2 transform -translate-x-1/2 w-64 z-20 shadow-lg">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{microgrid.name}</h4>
                    <Badge variant={microgrid.status === 'healthy' ? 'default' : microgrid.status === 'warning' ? 'secondary' : 'destructive'}>
                      {microgrid.status}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    {microgrid.location}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-primary" />
                      <span>{microgrid.powerGenerated}kW</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Battery className="w-3 h-3 text-success" />
                      <span>{microgrid.batterySOC}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="w-3 h-3 text-warning" />
                      <span>{microgrid.efficiency}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${microgrid.isOnline ? 'bg-success' : 'bg-critical'}`} />
                      <span>{microgrid.isOnline ? 'Online' : 'Offline'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm rounded-lg p-3 text-xs">
        <div className="font-medium mb-2">Status Legend</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span>Healthy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span>Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-critical" />
            <span>Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
};