import { Link, useLocation } from "wouter";
import { Home, Building, BarChart3, Users, FileText, Settings, ChartLine } from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home, current: location === "/" },
    { name: "Properties", href: "/properties", icon: Building, current: location === "/properties" },
    { name: "Market Analysis", href: "/analytics", icon: BarChart3, current: location === "/analytics" },
    { name: "Team Workspace", href: "/team", icon: Users, current: location === "/team" },
    { name: "Reports", href: "/reports", icon: FileText, current: location === "/reports" },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <ChartLine className="text-primary-foreground" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">RealtyAnalytics</h1>
            <p className="text-sm text-slate-500">Market Intelligence</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href}>
              <a className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                item.current 
                  ? "bg-primary-50 text-primary-700 border border-primary-200" 
                  : "text-slate-600 hover:bg-slate-100"
              }`}>
                <Icon size={20} />
                <span className={item.current ? "font-medium" : ""}>{item.name}</span>
              </a>
            </Link>
          );
        })}
      </nav>
      
      <div className="absolute bottom-0 w-64 p-4 border-t border-slate-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center">
            <span className="text-slate-600 font-medium">JD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-800">John Doe</p>
            <p className="text-xs text-slate-500">Senior Agent</p>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
