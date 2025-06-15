import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Download } from "lucide-react";
import type { Property } from "@shared/schema";

export default function PropertyComparison() {
  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  // Sample properties for comparison (taking first 3)
  const comparisonProperties = properties?.slice(0, 3) || [];

  const getMarketPositionColor = (position: string) => {
    switch (position) {
      case "Above Average":
        return "bg-success-100 text-success-700";
      case "Market Average":
        return "bg-amber-100 text-amber-700";
      case "Below Average":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const sampleImages = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
  ];

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="h-64 flex items-center justify-center">
            <div className="text-slate-600">Loading properties...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-800">Property Comparison</h3>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {comparisonProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">No properties available for comparison</p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Property
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {comparisonProperties.map((property, index) => (
              <div key={property.id} className="border border-slate-200 rounded-lg overflow-hidden">
                <img 
                  src={property.imageUrl || sampleImages[index]} 
                  alt={`Property at ${property.address}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-slate-800 mb-2">{property.address}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Price</span>
                      <span className="font-medium text-slate-800">
                        ${property.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Beds/Baths</span>
                      <span className="font-medium text-slate-800">
                        {property.bedrooms}/{property.bathrooms}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Sq Ft</span>
                      <span className="font-medium text-slate-800">
                        {property.sqft.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Price/Sq Ft</span>
                      <span className="font-medium text-slate-800">
                        ${property.pricePerSqft}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Market Position</span>
                      <Badge 
                        variant="secondary" 
                        className={getMarketPositionColor(property.marketPosition)}
                      >
                        {property.marketPosition}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
