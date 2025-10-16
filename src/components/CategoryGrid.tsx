import { Card } from "@/components/ui/card";
import {
  Building2,
  Cross,
  GraduationCap,
  HardHat,
  Heart,
  Home,
  MoreHorizontal,
  Scissors,
  Utensils,
  Wrench,
} from "lucide-react";

const categories = [
  { name: "Restaurants", icon: Utensils, color: "text-orange-500" },
  { name: "Hotels", icon: Building2, color: "text-blue-500" },
  { name: "Beauty Spa", icon: Scissors, color: "text-pink-500" },
  { name: "Home Decor", icon: Home, color: "text-green-500" },
  { name: "Wedding Planning", icon: Heart, color: "text-red-500" },
  { name: "Education", icon: GraduationCap, color: "text-purple-500" },
  { name: "Rent & Hire", icon: Wrench, color: "text-gray-500" },
  { name: "Hospitals", icon: Cross, color: "text-red-600" },
  { name: "Contractors", icon: HardHat, color: "text-yellow-600" },
  { name: "More Categories", icon: MoreHorizontal, color: "text-gray-600" },
];

export function ServiceCategories() {
  return (
    <section>
      <h2 className="text-2xl text-center font-semibold text-foreground mb-6 font-heading">
        Businesses Categories
      </h2>
      <div className="h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/50 py-3">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 pr-2">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card
                key={category.name}
                className="group relative overflow-hidden border border-border bg-card hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-ring/10 hover:-translate-y-1 cursor-pointer"
              >
                <div className="p-4 flex flex-col items-center text-center space-y-2">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <IconComponent
                        className={`w-5 h-5 ${category.color} group-hover:scale-110 transition-transform duration-300`}
                      />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-primary/5 scale-0 group-hover:scale-150 transition-transform duration-500 ease-out" />
                  </div>
                  <h3 className="text-xs font-medium text-card-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                    {category.name}
                  </h3>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-lg transition-colors duration-300" />
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
