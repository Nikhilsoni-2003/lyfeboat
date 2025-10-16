import { Card, CardContent } from "@/components/ui/card";
import type { Category } from "./CategoryGrid";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const IconComponent = category.icon;

  return (
    <>
      <Card className="hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-gray-200 hover:border-blue-200 group bg-white/80 backdrop-blur-sm">
        <CardContent className="p-5 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div
              className={`p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 ${category.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}
            >
              <IconComponent className="w-7 h-7" />
            </div>
          </div>
        </CardContent>
      </Card>
      <p className="text-base mt-3 text-center font-semibold text-gray-700 leading-tight group-hover:text-gray-900 transition-colors duration-200">
        {category.name}
      </p>
    </>
  );
}
