import type { BusinessSearchDetailsSchema } from "@/services/api/gen";
import { Calendar, PhoneCall } from "lucide-react";
import BusinssLogo from "public/office-building.png";
import type React from "react";
import { Card } from "../ui/card";

interface BusinessCardsPropsI {
  business: BusinessSearchDetailsSchema;
}

const BusinessCards: React.FC<BusinessCardsPropsI> = ({ business }) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border border-border bg-card py-0">
      <div className="flex gap-4 h-full">
        <div className="flex-shrink-0 flex items-center justify-center px-2">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-muted border-2 border-border">
            <img
              src={business?.profile?.logo_url ?? BusinssLogo}
              alt={`${business?.profile?.name} logo`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between py-2">
          <div className="mb-2">
            <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300 truncate leading-tight">
              {business?.profile?.name}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <PhoneCall className="w-3 h-3 flex-shrink-0 text-primary/60" />
            <span className="truncate">{business?.profile?.contact_no}</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-muted-foreground mr-4">
              <Calendar className="w-3 h-3 flex-shrink-0 text-primary/60" />
              <span className="font-medium whitespace-nowrap">
                {business?.profile?.establishment}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BusinessCards;
