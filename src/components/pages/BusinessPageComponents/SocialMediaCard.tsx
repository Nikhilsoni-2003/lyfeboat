import { Card } from "@/components/ui/card";
import type { SocialMedia } from "@/services/api/gen";
import { ExternalLink } from "lucide-react";

type SocialMediaCardProps = {
  socialMedia: Array<SocialMedia>;
};

export const SocialMediaCard: React.FC<SocialMediaCardProps> = ({
  socialMedia,
}) => {
  if (!socialMedia || socialMedia.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-card border-border animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-4 bg-primary rounded-full">
          <ExternalLink className="w-5 h-5 text-white " />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">
            Connect With Us
          </h2>
          <p className="text-sm text-muted-foreground">
            Follow us on social media
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-4">
        {socialMedia.map((item, index) => (
          <a
            key={index}
            href={item.url ?? ""}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-secondary rounded-lg border border-border hover:border-primary/50 transition-colors group"
          >
            <ExternalLink className="w-5 h-5 text-active group-hover:text-primary transition-colors" />
            <div className="flex-1">
              <span className="font-medium text-card-foreground">
                {item.platform || "Social Media"}
              </span>
              <p className="text-sm text-muted-foreground truncate">
                {item.url || "N/A"}
              </p>
            </div>
          </a>
        ))}
      </div>
    </Card>
  );
};
