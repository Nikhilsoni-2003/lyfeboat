import { Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type KeywordsCardProps = {
  keywords: Array<{
    id?: string | number;
    key?: string;
  }>;
};

export const KeywordsCard = ({ keywords }: KeywordsCardProps) => {
  if (!keywords || keywords.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-card border-border animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-blue-500 rounded-full">
          <Tag className="w-5 h-5 text-white " />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">Keywords & Specializations</h2>
          <p className="text-sm text-muted-foreground">Areas of expertise and focus</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mt-6">
        {keywords.map((item, index) => (
          <Badge
            key={item.id || index}
            variant="outline"
            className="px-4 py-2 hover:bg-secondary/80 transition-colors"
          >
            {item.key || "N/A"}
          </Badge>
        ))}
      </div>
    </Card>
  );
};
