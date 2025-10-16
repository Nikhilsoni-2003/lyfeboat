import { Card } from "@/components/ui/card";
import type { BusinessMediaItems } from "@/services/api/gen";
import { Image } from "lucide-react";

type MediaGalleryCardProps = {
  mediaUrls: Array<BusinessMediaItems>;
};

const placeholderImage =
  "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop";

export const MediaGalleryCard: React.FC<MediaGalleryCardProps> = ({
  mediaUrls,
}) => {
  if (!mediaUrls || mediaUrls.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-card border-border animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-primary rounded-full">
          <Image className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">
            Gallery
          </h2>
          <p className="text-sm text-muted-foreground">
            Explore our work and workspace
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mediaUrls.map((item, index) => (
          <div
            key={item.id || index}
            className="relative group overflow-hidden rounded-lg"
          >
            <img
              src={item.media || placeholderImage}
              alt={`Gallery ${index + 1}`}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = placeholderImage;
              }}
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ))}
      </div>
    </Card>
  );
};
