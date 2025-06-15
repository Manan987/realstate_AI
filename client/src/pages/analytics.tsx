import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUp, ArrowDown, Minus, Download } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Property, MarketData } from "@shared/schema";

declare global {
  interface Window {
    Chart: any;
  }
}

export default function Analytics() {
  const priceDistributionRef = useRef<HTMLCanvasElement>(null);
  const priceDistributionChart = useRef<any>(null);

  const { data: properties } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const { data: marketData } = useQuery<MarketData[]>({
    queryKey: ["/api/market-data"],
  });

  useEffect(() => {
    const loadChart = async () => {
      if (typeof window !== 'undefined' && !window.Chart) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = () => initChart();
        document.head.appendChild(script);
      } else {
        initChart();
      }
    };

    const initChart = () => {
      if (!priceDistributionRef.current || !properties || !window.Chart) return;

      // Destroy existing chart
      if (priceDistributionChart.current) {
        priceDistributionChart.current.destroy();
      }

      // Calculate price distribution
      const priceRanges = {
        '300K-400K': 0,
        '400K-500K': 0,
        '500K-600K': 0,
        '600K+': 0
      };

      properties.forEach(property => {
        if (property.price < 400000) priceRanges['300K-400K']++;
        else if (property.price < 500000) priceRanges['400K-500K']++;
        else if (property.price < 600000) priceRanges['500K-600K']++;
        else priceRanges['600K+']++;
      });

      const ctx = priceDistributionRef.current.getContext('2d');
      if (!ctx) return;

      priceDistributionChart.current = new window.Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(priceRanges),
          datasets: [{
            data: Object.values(priceRanges),
            backgroundColor: [
              '#ef4444',
              '#f59e0b',
              '#2563eb',
              '#059669'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom' as const
            }
          }
        }
      });
    };

    if (properties) {
      loadChart();
    }

    return () => {
      if (priceDistributionChart.current) {
        priceDistributionChart.current.destroy();
      }
    };
  }, [properties]);

  const analyticsData = {
    avgSaleTime: "23 days",
    priceAppreciation: "+8.4%",
    inventoryTurnover: "1.8x"
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Market Analysis</h2>
            <p className="text-slate-600">Deep insights into market trends and pricing</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                <SelectItem value="downtown">Downtown</SelectItem>
                <SelectItem value="westside">Westside</SelectItem>
                <SelectItem value="suburbs">Suburbs</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        {/* Analytics Dashboard */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">Analytics Dashboard</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Price Distribution Chart */}
              <div>
                <h4 className="font-medium text-slate-800 mb-4">Price Distribution</h4>
                <div className="h-64">
                  <canvas ref={priceDistributionRef}></canvas>
                </div>
              </div>

              {/* Market Performance */}
              <div>
                <h4 className="font-medium text-slate-800 mb-4">Market Performance</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">Average Sale Time</p>
                      <p className="text-2xl font-bold text-primary-600">{analyticsData.avgSaleTime}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">vs. Last Quarter</p>
                      <p className="text-sm text-success-600 flex items-center">
                        <ArrowDown className="mr-1 h-3 w-3" />
                        -12%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">Price Appreciation</p>
                      <p className="text-2xl font-bold text-success-600">{analyticsData.priceAppreciation}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">Year over Year</p>
                      <p className="text-sm text-success-600 flex items-center">
                        <ArrowUp className="mr-1 h-3 w-3" />
                        +2.1%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800">Inventory Turnover</p>
                      <p className="text-2xl font-bold text-amber-600">{analyticsData.inventoryTurnover}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">Monthly Rate</p>
                      <p className="text-sm text-amber-600 flex items-center">
                        <Minus className="mr-1 h-3 w-3" />
                        Stable
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Top Performing Areas</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Downtown</span>
                  <span className="font-medium text-slate-800">$520K avg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Westside</span>
                  <span className="font-medium text-slate-800">$485K avg</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Suburbs</span>
                  <span className="font-medium text-slate-800">$445K avg</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Market Trends</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Seller's Market</span>
                  <span className="px-2 py-1 bg-success-100 text-success-700 rounded text-xs">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Low Inventory</span>
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">Warning</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Rising Prices</span>
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">Trending</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Forecast</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Q4 Price Growth</span>
                  <span className="font-medium text-success-600">+3.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Market Activity</span>
                  <span className="font-medium text-slate-800">High</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Best Time to Sell</span>
                  <span className="font-medium text-slate-800">Now</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
