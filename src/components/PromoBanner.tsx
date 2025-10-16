import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Plane } from "lucide-react";

export function PromoBanner() {
  return (
    <Card className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white overflow-hidden">
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Special Offers</h3>
            <p className="text-blue-100">Discover amazing deals near you</p>
            <Button variant="secondary" size="sm" className="mt-3">
              Explore Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="hidden sm:block">
            <Plane className="w-16 h-16 text-blue-200" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
