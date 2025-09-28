import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Zap,
  BarChart3,
  AlertTriangle,
  Activity,
  Shield,
  Settings,
  MapPin,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Overview",
    items: [
      { title: "Global Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Microgrids", url: "/microgrids", icon: Zap },
    ],
  },
  {
    title: "Monitoring",
    items: [
      { title: "Analytics", url: "/analytics", icon: BarChart3 },
      { title: "Alerts", url: "/alerts", icon: AlertTriangle },
      { title: "System Health", url: "/system-health", icon: Activity },
    ],
  },
  {
    title: "Administration",
    items: [
      { title: "Security", url: "/security", icon: Shield },
      { title: "Settings", url: "/settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const sidebar = useSidebar();
  const collapsed = sidebar.state === "collapsed";
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const getNavClassName = (path: string) => {
    const baseClasses = "transition-all duration-200";
    if (isActive(path)) {
      return `${baseClasses} bg-sidebar-accent text-sidebar-primary font-medium shadow-sm`;
    }
    return `${baseClasses} hover:bg-sidebar-accent/50 text-sidebar-foreground`;
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-energy flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-bold text-sidebar-foreground">GridWatch</h2>
                <p className="text-xs text-sidebar-foreground/70">
                  Monitoring System
                </p>
              </div>
            )}
          </div>
        </div>

        {navigationItems.map((section, sectionIndex) => (
          <SidebarGroup key={sectionIndex}>
            <SidebarGroupLabel className="text-sidebar-foreground/80">
              {!collapsed && section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className={getNavClassName(item.url)}
                      >
                        <item.icon className="w-4 h-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}