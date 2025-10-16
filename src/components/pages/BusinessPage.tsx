import { AdditionalInfoCard } from "@/components/pages/BusinessPageComponents/AdditionalInfoCard";
import { AddressCard } from "@/components/pages/BusinessPageComponents/AddressCard";
import { BusinessNavigation } from "@/components/pages/BusinessPageComponents/BusinessNavigation";
import { ContactInfoCard } from "@/components/pages/BusinessPageComponents/ContactInfoCard";
import { KeywordsCard } from "@/components/pages/BusinessPageComponents/KeywordsCard";
import { MediaGalleryCard } from "@/components/pages/BusinessPageComponents/MediaGalleryCard";
import { PointOfContactCard } from "@/components/pages/BusinessPageComponents/PointOfContactCard";
import { SocialMediaCard } from "@/components/pages/BusinessPageComponents/SocialMediaCard";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { BusinessDetailsSchema } from "@/services/api/gen";
import { Calendar, Clock } from "lucide-react";
import { useEffect, useState } from "react";

type BusinessPageProps = {
  data: BusinessDetailsSchema;
};

const BusinessPage = ({ data }: BusinessPageProps) => {
  const businessData = data;
  const [activeTab, setActiveTab] = useState("contact");

  useEffect(() => {
    console.log("Business Data:", businessData);
  }, [businessData]);

  const renderActiveCard = () => {
    switch (activeTab) {
      case "contact":
        return <PointOfContactCard pocDetails={businessData.poc_details} />;
      case "keywords":
        return <KeywordsCard keywords={businessData.keyword} />;
      case "contact-info":
        return <ContactInfoCard profile={businessData.profile} />;
      case "location":
        return <AddressCard address={businessData.address} />;
      case "gallery":
        return <MediaGalleryCard mediaUrls={businessData.media_url} />;
      case "social":
        return <SocialMediaCard socialMedia={businessData.social_media} />;
      case "additional":
        return <AdditionalInfoCard extraFields={businessData.extra_fields} />;
      default:
        return <PointOfContactCard pocDetails={businessData.poc_details} />;
    }
  };

  if (!businessData) {
    return (
      <div className="w-full max-w-full mx-auto p-4 bg-white rounded-lg shadow-lg overflow-x-hidden">
        <div className="text-center text-gray-500">
          No business data available
        </div>
      </div>
    );
  }

  const placeholderImage =
    "https://imgs.search.brave.com/LeS4HHKZ1oz1T15VY5MwiUjWDjLiYKj0vgRABB3D2BY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA2Lzg2LzE5LzM0/LzM2MF9GXzY4NjE5/MzQwN19ESFp3amV5/ZEJPUjF0RURrTEF6/d00zdzVrWXN0Unp6/Qi5qcGc";

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white shadow-lg space-y-8 relative w-full max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-6xl mx-auto">
      {/* Banner and Logo */}
      <div className="border rounded-xl overflow-hidden">
        <div className="relative">
          {/* Banner */}
          <div className="relative h-32 sm:h-48 w-full overflow-hidden">
            <img
              src={
                businessData.profile.banner_url ||
                "https://preview.redd.it/my-experience-for-josh-technology-group-software-developer-v0-etdhr9rvt43f1.png?auto=webp&s=01d46441eff1943befa40cf5e9c2c8d9ae1b7ccb"
              }
              alt="Business Banner"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://preview.redd.it/my-experience-for-josh-technology-group-software-developer-v0-etdhr9rvt43f1.png?auto=webp&s=01d46441eff1943befa40cf5e9c2c8d9ae1b7ccb";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>

          {/* Logo */}
          <div className="absolute -bottom-10 left-4 sm:left-6">
            <img
              src={businessData.profile.logo_url || placeholderImage}
              alt={businessData.profile.name || "Business Logo"}
              className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-md shadow-lg border-4 border-white bg-white"
              onError={(e) => {
                e.currentTarget.src = placeholderImage;
              }}
            />
          </div>
        </div>

        {/* Business Info */}
        <div className="mt-14 sm:mt-16 space-y-4">
          <Card className="p-4 sm:p-6 lg:p-7 bg-background shadow-md border-none animate-slide-in">
            <div className="prose max-w-none">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                {businessData.profile.name || "Business Name N/A"}
              </h1>
              {businessData.profile.tagline && (
                <p className="text-base sm:text-lg text-blue-900 mb-3 italic">
                  "{businessData.profile.tagline}"
                </p>
              )}
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                {businessData.profile.description || "No description available"}
              </p>

              {/* Meta Info */}
              <div className="flex flex-col sm:flex-col sm:flex-wrap gap-3 sm:gap-6 mb-4">
                <div className="flex items-center gap-2 text-active">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base font-medium">
                    {businessData.profile.opening_time || "N/A"} -{" "}
                    {businessData.profile.closing_time || "N/A"}
                  </span>
                </div>

                <Badge
                  variant="outline"
                  className="flex items-center gap-2 text-xs sm:text-sm rounded-sm"
                >
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  Est. {businessData.profile.establishment || "N/A"}
                </Badge>

                {/* <Badge
                  variant="outline"
                  className="flex items-center gap-2 text-xs sm:text-sm rounded-sm"
                >
                  <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
                  {businessData.profile.payment_mode || "N/A"}
                </Badge> */}

                {/* <Badge
                  variant="outline"
                  className="flex items-center gap-2 text-xs sm:text-sm rounded-sm"
                >
                  <Store className="w-3 h-3 sm:w-4 sm:h-4" />
                  {businessData.profile.plan || "N/A"}
                </Badge> */}
              </div>
            </div>
          </Card>

          <BusinessNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>

      <div className="border-b border-gray-200 pb-1"></div>

      <div className="animate-fade-in">{renderActiveCard()}</div>
    </div>
  );
};

export default BusinessPage;

// .\caddy.exe run --config Caddyfile
