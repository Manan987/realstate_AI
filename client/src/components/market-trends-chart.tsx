import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import type { MarketData } from "@shared/schema";

declare global {
  interface Window {
    Chart: any;
  }
}

export default function MarketTrendsChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  const { data: marketData, isLoading } = useQuery<MarketData[]>({
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
      if (!chartRef.current || !marketData || !window.Chart) return;

      // Destroy existing chart
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      chartInstance.current = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: marketData.map(d => d.month),
          datasets: [{
            label: 'Average Price',
            data: marketData.map(d => d.avgPrice),
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            tension: 0.4,
            fill: true
          }, {
            label: 'Competitor Average',
            data: marketData.map(d => d.competitorAvgPrice),
            borderColor: '#059669',
            backgroundColor: 'rgba(5, 150, 105, 0.1)',
            tension: 0.4,
            borderDash: [5, 5]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top' as const,
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              ticks: {
                callback: function(value: any) {
                  return '$' + (value / 1000) + 'K';
                }
              }
            }
          }
        }
      });
    };

    if (marketData) {
      loadChart();
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [marketData]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-80 flex items-center justify-center">
            <div className="text-slate-600">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-800">Market Price Trends</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="bg-primary-100 text-primary-700">6M</Button>
            <Button variant="outline" size="sm">1Y</Button>
            <Button variant="outline" size="sm">2Y</Button>
          </div>
        </div>
        <div className="h-80">
          <canvas ref={chartRef}></canvas>
        </div>
      </CardContent>
    </Card>
  );
}
