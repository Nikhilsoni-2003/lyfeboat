import { Card } from "@/components/ui/card";
import type { BusinessProfile } from "@/services/api/gen";
import { Globe, Mail, Phone } from "lucide-react";

type ContactInfoCardProps = { profile: BusinessProfile };

export const ContactInfoCard: React.FC<ContactInfoCardProps> = ({
  profile,
}) => {
  return (
    <Card className="p-6 bg-card border-border animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-green-600 rounded-full">
          <Phone className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">
            Contact Information
          </h2>
          <p className="text-sm text-muted-foreground">Get in touch with us</p>
        </div>
      </div>
      <div className="grid sm:grid-cols-1 xl:grid-cols-2 gap-4">
        {profile.contact_no && (
          <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
            <Phone className="w-5 h-5 text-green-800 " />
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <a
                href={`tel:${profile.contact_no}`}
                className="text-active hover:no-underline hover:text-primary font-medium"
              >
                {profile.contact_no}
              </a>
            </div>
          </div>
        )}

        {profile.whatsapp_no && (
          <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
            <Phone className="w-5 h-5 text-green-800" />
            <div>
              <p className="text-sm text-muted-foreground">WhatsApp</p>
              <a
                href={`https://wa.me/${profile.whatsapp_no.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-active hover:no-underline hover:text-primary font-medium"
              >
                {profile.whatsapp_no}
              </a>
            </div>
          </div>
        )}

        {profile.email && (
          <div className="flex tems-center  gap-3 p-3 bg-background rounded-lg border border-border">
            <Mail className="w-5 h-12 text-blue-800 " />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <a
                href={`mailto:${profile.email}`}
                className="text-active hover:no-underline hover:text-primary font-medium md:text-ellipsis lg:text-ellipsis"
              >
                {profile.email}
              </a>
            </div>
          </div>
        )}

        {profile.website && (
          <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
            <Globe className="w-5 h-5 text-blue-800" />
            <div>
              <p className="text-sm text-muted-foreground">Website</p>
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-grey-600 hover:no-underline hover:text-primary font-medium"
              >
                {profile.website}
              </a>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
