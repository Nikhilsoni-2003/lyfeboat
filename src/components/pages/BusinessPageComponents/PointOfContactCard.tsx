import { User } from "lucide-react";
import { Card } from "@/components/ui/card";

type PointOfContactCardProps = {
  pocDetails?: {
    name?: string;
    email?: string;
    phone?: string;
  };
};

export const PointOfContactCard = ({ pocDetails }: PointOfContactCardProps) => {
  if (!pocDetails?.name && !pocDetails?.email && !pocDetails?.phone) {
    return null;
  }

  return (
    <Card className="p-6 bg-card border-border animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-green-600 rounded-full">
          <User className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">Point of Contact</h2>
          <p className="text-sm text-muted-foreground">Primary contact for business inquiries</p>
        </div>
      </div>
      <div className="grid md:grid-cols-1 gap-4">
        <div>
          <span className="text-sm font-medium text-muted-foreground">Name</span>
          <p className="text-active hover:no-underline hover:text-primary font-medium">{pocDetails?.name || "N/A"}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-muted-foreground">Email</span>
          {pocDetails?.email ? (
            <a
              href={`mailto:${pocDetails.email}`}
              className="text-active hover:no-underline hover:text-primary block font-medium"
            >
              {pocDetails.email}
            </a>
          ) : (
            <p className="text-card-foreground">N/A</p>
          )}
        </div>
        <div>
          <span className="text-sm font-medium text-muted-foreground">Phone</span>
          {pocDetails?.phone ? (
            <a
              href={`tel:${pocDetails.phone}`}
              className="text-active hover:no-underline hover:text-primary block font-medium"
            >
              {pocDetails.phone}
            </a>
          ) : (
            <p className="text-card-foreground">N/A</p>
          )}
        </div>
      </div>
    </Card>
  );
};
