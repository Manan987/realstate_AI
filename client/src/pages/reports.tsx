import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Calendar, BarChart3, TrendingUp, Users, Building } from "lucide-react";
import type { Property, MarketData } from "@shared/schema";

export default function Reports() {
  const { data: properties } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const { data: marketData } = useQuery<MarketData[]>({
    queryKey: ["/api/market-data"],
  });

  const reportTypes = [
    {
      title: "Market Analysis Report",
      description: "Comprehensive market trends and pricing analysis",
      icon: BarChart3,
      color: "primary",
      lastGenerated: "Oct 15, 2024",
      status: "ready"
    },
    {
      title: "Property Portfolio Report",
      description: "Overview of all properties in your portfolio",
      icon: Building,
      color: "success",
      lastGenerated: "Oct 12, 2024",
      status: "ready"
    },
    {
      title: "Competitor Analysis",
      description: "Detailed comparison with competitor properties",
      icon: TrendingUp,
      color: "amber",
      lastGenerated: "Oct 10, 2024",
      status: "ready"
    },
    {
      title: "Team Performance Report",
      description: "Team activity and collaboration metrics",
      icon: Users,
      color: "purple",
      lastGenerated: "Oct 8, 2024",
      status: "generating"
    }
  ];

  const recentReports = [
    {
      name: "Q3 Market Analysis.pdf",
      type: "Market Analysis",
      generated: "Oct 15, 2024",
      size: "2.4 MB"
    },
    {
      name: "Portfolio Summary Oct 2024.xlsx",
      type: "Portfolio Report",
      generated: "Oct 12, 2024",
      size: "1.8 MB"
    },
    {
      name: "Competitor Pricing Analysis.pdf",
      type: "Competitor Analysis",
      generated: "Oct 10, 2024",
      size: "3.1 MB"
    }
  ];

  const generateReport = (reportType: string) => {
    // This would typically trigger report generation
    console.log(`Generating ${reportType} report...`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-700";
      case "generating":
        return "bg-yellow-100 text-yellow-700";
      case "error":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case "primary":
        return "text-primary-600 bg-primary-100";
      case "success":
        return "text-success-600 bg-success-100";
      case "amber":
        return "text-amber-600 bg-amber-100";
      case "purple":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-slate-600 bg-slate-100";
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Reports</h2>
            <p className="text-slate-600">Generate and download comprehensive market reports</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="market">Market Analysis</SelectItem>
                <SelectItem value="portfolio">Portfolio Reports</SelectItem>
                <SelectItem value="competitor">Competitor Analysis</SelectItem>
                <SelectItem value="team">Team Reports</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        {/* Report Generation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {reportTypes.map((report, index) => {
            const Icon = report.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getIconColor(report.color)}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-slate-800">{report.title}</h3>
                        <Badge variant="secondary" className={getStatusColor(report.status)}>
                          {report.status === "ready" ? "Ready" : "Generating..."}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{report.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          Last generated: {report.lastGenerated}
                        </span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => generateReport(report.title)}
                          disabled={report.status === "generating"}
                        >
                          {report.status === "generating" ? "Generating..." : "Generate"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FileText className="text-primary-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">12</p>
                  <p className="text-slate-600 text-sm">Reports Generated</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                  <Download className="text-success-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">38</p>
                  <p className="text-slate-600 text-sm">Downloads</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Calendar className="text-amber-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">4</p>
                  <p className="text-slate-600 text-sm">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800">3</p>
                  <p className="text-slate-600 text-sm">Shared Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">Recent Reports</h3>
              <Button variant="outline" size="sm">View All</Button>
            </div>

            <div className="space-y-3">
              {recentReports.map((report, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="text-red-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{report.name}</p>
                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <span>{report.type}</span>
                      <span>•</span>
                      <span>{report.generated}</span>
                      <span>•</span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {recentReports.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <p className="text-slate-600 mb-4">No reports generated yet</p>
                <Button onClick={() => generateReport("Market Analysis")}>
                  Generate Your First Report
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
