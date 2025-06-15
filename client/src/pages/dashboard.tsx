import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Bell, Plus, Home, DollarSign, Clock, TrendingUp, ArrowUp, ArrowDown, Calculator, FileDown, Users } from "lucide-react";
import MarketTrendsChart from "@/components/market-trends-chart";
import PropertyComparison from "@/components/property-comparison";
import TeamActivity from "@/components/team-activity";
import AnalyticsDashboard from "@/components/analytics-dashboard";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard-stats"],
  });

  const quickActions = [
    {
      title: "Price Analysis",
      description: "Compare competitor pricing",
      icon: Calculator,
      color: "primary",
    },
    {
      title: "Generate Report",
      description: "Export market insights",
      icon: FileDown,
      color: "success",
    },
    {
      title: "Team Workspace",
      description: "Collaborate with team",
      icon: Users,
      color: "amber",
    },
  ];

  const recentActivity = [
    { user: "Sarah", action: "updated pricing for 123 Oak St", color: "primary" },
    { user: "New", action: "market report generated", color: "success" },
    { user: "Mike", action: "added 3 new comparisons", color: "amber" },
  ];

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Market Dashboard</h2>
            <p className="text-slate-600">Real-time insights and competitor analysis</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Search properties..." 
                className="pl-10 w-80"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            </div>
            <button className="relative p-2 text-slate-400 hover:text-slate-600">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Active Listings</p>
                  <p className="text-3xl font-bold text-slate-800">
                    {statsLoading ? "..." : stats?.activeListings || "247"}
                  </p>
                  <p className="text-success-600 text-sm flex items-center mt-2">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    {stats?.activeListingsChange || "+12.5%"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Home className="text-primary-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Avg. Market Price</p>
                  <p className="text-3xl font-bold text-slate-800">
                    {stats?.avgPrice || "$485K"}
                  </p>
                  <p className="text-red-600 text-sm flex items-center mt-2">
                    <ArrowDown className="mr-1 h-3 w-3" />
                    {stats?.avgPriceChange || "-2.1%"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-success-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Days on Market</p>
                  <p className="text-3xl font-bold text-slate-800">
                    {stats?.daysOnMarket || "18"}
                  </p>
                  <p className="text-success-600 text-sm flex items-center mt-2">
                    <ArrowDown className="mr-1 h-3 w-3" />
                    {stats?.daysOnMarketChange || "-5 days"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Clock className="text-amber-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Team Performance</p>
                  <p className="text-3xl font-bold text-slate-800">
                    {stats?.teamPerformance || "94%"}
                  </p>
                  <p className="text-success-600 text-sm flex items-center mt-2">
                    <ArrowUp className="mr-1 h-3 w-3" />
                    {stats?.teamPerformanceChange || "+7.2%"}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-purple-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Market Trends Chart */}
          <div className="xl:col-span-2">
            <MarketTrendsChart />
          </div>

          {/* Quick Actions Panel */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Quick Actions</h3>
              <div className="space-y-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      className={`w-full text-left p-4 border border-slate-200 rounded-lg hover:border-${action.color}-300 hover:bg-${action.color}-50 transition-colors`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center`}>
                          <Icon className={`text-${action.color}-600`} size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{action.title}</p>
                          <p className="text-sm text-slate-600">{action.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <h4 className="font-medium text-slate-800 mb-3">Recent Activity</h4>
                <div className="space-y-3 text-sm">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 bg-${activity.color}-500 rounded-full`}></div>
                      <span className="text-slate-600">{activity.user} {activity.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Property Comparison */}
        <PropertyComparison />

        {/* Team Collaboration */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <TeamActivity />
          <AnalyticsDashboard />
        </div>
      </main>
    </>
  );
}
