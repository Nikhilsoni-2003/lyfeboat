import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

type AddressCardProps = {
  address: {
    address_line_1?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
  };
};

export const AddressCard = ({ address }: AddressCardProps) => {
  if (!address) {
    return null;
  }

  return (
    <Card className="p-6 bg-card border-border animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-yellow-300 rounded-full">
          <MapPin className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">Location</h2>
          <p className="text-sm text-muted-foreground">Our business address</p>
        </div>
      </div>
      <div className="text-muted-foreground space-y-1">
        <p className="text-card-foreground font-medium">{address.address_line_1 || "N/A"}</p>
        <p>
          {address.city || "N/A"}, {address.state || "N/A"}
        </p>
        <p>
          {address.country || "N/A"} - {address.postal_code || "N/A"}
        </p>
      </div>
    </Card>
  );
};
