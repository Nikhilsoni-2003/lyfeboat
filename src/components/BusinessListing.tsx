import { Card } from "@/components/ui/card";
import { useAllApprovedBusinesses } from "@/hooks/useAllApprovedBusinesses";
import { useNavigate } from "@tanstack/react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Building2, Calendar, PhoneCall } from "lucide-react";
import BusinssLogo from "public/office-building.png";
import { useRef } from "react";

const businesses = Array.from({ length: 50 }).map((_, i) => ({
  id: i + 1,
  name: `Business ${i + 1}`,
  location: `Address ${i + 1}, City Center`,
  logo: `/${(i % 4) + 1}.jpg`,
  category: i % 2 === 0 ? "Restaurant" : "Hotel",
  foundationYear: 2010 + (i % 10),
}));

export function BusinessListings() {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const { data: businesses } = useAllApprovedBusinesses();

  const rowVirtualizer = useVirtualizer({
    count: businesses?.length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 140,
    overscan: 5,
  });

  const goToBusiness = (id: string) => {
    navigate({ to: "/$businessPage", params: { businessPage: id } });
  };

  return (
    <section>
      <h2 className="text-2xl text-center font-semibold text-foreground mb-6 font-heading">
        Featured Businesses
      </h2>

      <div
        ref={parentRef}
        className="h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent relative py-3"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const business = businesses?.[virtualRow.index];
            return (
              <div
                key={business?.id}
                ref={rowVirtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                onClick={() => goToBusiness(business?.id ?? "")}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border border-border bg-card py-0">
                  <div className="p-4 h-32">
                    <div className="flex gap-4 h-full">
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted border-2 border-border">
                          <img
                            src={business?.logo ?? BusinssLogo}
                            alt={`${business?.name} logo`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between py-2">
                        <div className="mb-1 md:mb-2">
                          <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300 truncate leading-tight">
                            {business?.name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground md:mb-2">
                          <PhoneCall className="w-4 h-4 flex-shrink-0 text-primary/60" />
                          <span className="truncate">
                            {business?.contact_no}
                          </span>
                        </div>

                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Building2 className="w-4 h-4 flex-shrink-0 text-primary/60" />
                            <span className="truncate font-medium">
                              {business?.opening_time} -{" "}
                              {business?.closing_time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground md:mr-4">
                            <Calendar className="w-4 h-4 flex-shrink-0 text-primary/60" />
                            <span className="font-medium whitespace-nowrap">
                              Est. 9021
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
