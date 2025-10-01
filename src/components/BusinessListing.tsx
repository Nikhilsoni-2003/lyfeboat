import { Card } from "@/components/ui/card";
import { Building2, Calendar, MapPin } from "lucide-react";

const businesses = [
  {
    id: 1,
    name: "Bella Vista Restaurant & Fine Dining Experience",
    location: "123 Main Street, Downtown Business District, New York",
    logo: "/1.jpg",
    category: "Italian Restaurant",
    foundationYear: 2018,
  },
  {
    id: 2,
    name: "Grand Palace Hotel & Luxury Suites",
    location: "456 Oak Avenue, City Center Premium Location",
    logo: "/2.jpg",
    category: "5-Star Hotel",
    foundationYear: 2015,
  },
  {
    id: 3,
    name: "Serenity Spa & Wellness Center",
    location: "789 Pine Road, Wellness District, Health Quarter",
    logo: "/3.jpg",
    category: "Beauty & Wellness",
    foundationYear: 2020,
  },
  {
    id: 4,
    name: "Modern Home Designs & Interior Solutions",
    location: "321 Elm Street, Design Quarter, Creative Hub",
    logo: "/4.jpg",
    category: "Interior Design",
    foundationYear: 2017,
  },
];

export function BusinessListings() {
  return (
    <section>
      <h2 className="text-2xl text-center font-semibold text-foreground mb-6 font-heading">
        Featured Businesses
      </h2>
      <div className="h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <div className="space-y-4">
          {businesses.map((business) => (
            <Card
              key={business.id}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer border border-border bg-card"
            >
              <div className="p-4 h-32">
                <div className="flex gap-4 h-full">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted border-2 border-border">
                      <img
                        src={business.logo}
                        alt={`${business.name} logo`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between py-2">
                    <div className="mb-2">
                      <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors duration-300 truncate leading-tight">
                        {business.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4 flex-shrink-0 text-primary/60" />
                      <span className="truncate">{business.location}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="w-4 h-4 flex-shrink-0 text-primary/60" />
                        <span className="truncate font-medium">
                          {business.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground mr-4">
                        <Calendar className="w-4 h-4 flex-shrink-0 text-primary/60" />
                        <span className="font-medium whitespace-nowrap">
                          Est. {business.foundationYear}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        {/* <div className="pointer-events-none absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-card/80 to-transparent" /> */}
      </div>
    </section>
  );
}
