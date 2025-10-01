
import type { BusinessDetailsSchema } from "@/services/api/gen";
import { useEffect } from "react";
import {
  Calendar,
  Clock,
  CreditCard,
  ExternalLink,
  Globe,
  Image,
  Mail,
  MapPin,
  Phone,
  Tag,
  User,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type BusinessPageProps = {
  data: BusinessDetailsSchema;
};

const BusinessPage = ({ data }: BusinessPageProps) => {
  const businessData = data;

  useEffect(() => {
    console.log("Business Data:", businessData);
  }, [businessData]); 

  if (!businessData) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center text-gray-500">
          No business data available
        </div>
      </div>
    );
  }

  type ExtraField = {
    id?: string | number;
    key?: string;
    value?: string;
    children?: ExtraField[];
  };

  const ExtraFieldRenderer = ({
    field,
    depth = 0,
  }: {
    field: ExtraField;
    depth?: number;
  }) => {
    const { key, value, children = [] } = field;
    const marginLeft = depth * 20;

    return (
      <div className="mb-3" style={{ marginLeft: `${marginLeft}px` }}>
        <div className="bg-gray-50 p-3 rounded-lg border-1 border-grey-900">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <span className="font-medium text-gray-700">
                {key || "N/A"}:
              </span>
              <span className="ml-2 text-gray-600">{value || "N/A"}</span>
            </div>
          </div>
          {children && children.length > 0 && (
            <div className="mt-3 pl-4 border-l-2 border-gray-200">
              {children.map((child, index) => (
                <ExtraFieldRenderer
                  key={child.id || index}
                  field={child}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const placeholderImage =
      "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop";

  return (
    <div className="p-6 bg-white shadow-lg space-y-10 relative w-full max-w-4xl mx-auto">
      {/* Banner and Logo */}
      <div className="border-1 rounded-xl">
      <div className="relative">
        <div className="relative h-48 w-full rounded-t-lg overflow-hidden">
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
  {/* Gradient Overlay for text contrast */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
</div>
        <div className="absolute -bottom-12 left-6">
          <img
            src={businessData.profile.logo_url || placeholderImage}
            alt={businessData.profile.name || "Business Logo"}
            className="w-28 h-28 object-cover rounded-md shadow-lg border-4 border-white bg-white"
            onError={(e) => {
              e.currentTarget.src = placeholderImage;
            }}
          />
        </div>
      </div>

      {/* Business Info */}

      <div className="mt-10 space-y-4  items-center">
          <Card className="p-7 mt-18 bg-background shadow-md border-none animate-slide-in border-5">
          <div className="prose max-w-none">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {businessData.profile.name || "Business Name N/A"}
        </h1>
        {businessData.profile.tagline && (
          <p className="text-lg text-blue-600 mb-3 italic">
            "{businessData.profile.tagline}"
          </p>
        )}
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              {businessData.profile.description || "No description available"}
            </p>
            
            {/* Business Hours and Meta Info */}
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center gap-2 text-success">
                <Clock className="w-5 h-5" />
                <span className="font-medium">
                  {businessData.profile.opening_time || "N/A"} - {businessData.profile.closing_time || "N/A"}
                </span>
              </div>
              
              <Badge variant="secondary" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Est. {businessData.profile.establishment || "N/A"}
              </Badge>
              
              <Badge variant="outline" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                {businessData.profile.payment_mode || "N/A"}
              </Badge>
              
              <Badge variant="outline" className="flex items-center gap-2">
                {businessData.profile.plan || "N/A"}
              </Badge>
            </div>
          </div>
          {/* <hr /> */}
          {/* <nav></nav> */}
        </Card>
      </div>
      </div>

      <div className="border-b border-gray-200 pb-1"></div>


  <div className="space-y-6">
  {/* Contact Information */}
        <Card className="p-6 bg-surface-variant border-border shadow-md animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-700 rounded-lg">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Contact Information</h2>
              <p className="text-sm text-muted-foreground">Get in touch with us</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {businessData.profile.contact_no && (
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                <Phone className="w-5 h-5 text-active" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <a
                    href={`tel:${businessData.profile.contact_no}`}
                    className="text-active hover:text-primary-dark transition-fast font-medium"
                  >
                    {businessData.profile.contact_no}
                  </a>
                </div>
              </div>
            )}

            {businessData.profile.whatsapp_no && (
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                <Phone className="w-5 h-5 text-success" />
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <a
                    href={`https://wa.me/${businessData.profile.whatsapp_no.replace(/[^\d]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-active hover:text-primary-dark transition-fast font-medium"
                  >
                    {businessData.profile.whatsapp_no}
                  </a>
                </div>
              </div>
            )}

            {businessData.profile.email && (
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                <Mail className="w-5 h-5 text-active" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${businessData.profile.email}`}
                    className="text-active hover:text-primary-dark transition-fast font-medium"
                  >
                    {businessData.profile.email}
                  </a>
                </div>
              </div>
            )}

            {businessData.profile.website && (
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                <Globe className="w-5 h-5 text-active" />
                <div>
                  <p className="text-sm text-muted-foreground">Website</p>
                  <a
                    href={businessData.profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-active hover:text-primary-dark transition-fast font-medium"
                  >
                    {businessData.profile.website}
                  </a>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Address */}
        {businessData.address && (
          <Card className="p-6 bg-background border-border shadow-md animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-400 rounded-lg">
                <MapPin className="w-5 h-5 text-warning-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Location</h2>
                <p className="text-sm text-muted-foreground">Our business address</p>
              </div>
            </div>
            <div className="text-muted-foreground space-y-1">
              <p className="text-foreground font-medium">{businessData.address.address_line_1 || "N/A"}</p>
              <p>
                {businessData.address.city || "N/A"}, {businessData.address.state || "N/A"}
              </p>
              <p>
                {businessData.address.country || "N/A"} - {businessData.address.postal_code || "N/A"}
              </p>
            </div>
          </Card>
        )}
</div>

      {/* Point of Contact */}
        {(businessData.poc_details?.name ||
          businessData.poc_details?.email ||
          businessData.poc_details?.phone) && (
          <Card className="p-6 bg-surface-variant border-border shadow-md animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary rounded-lg">
                <User className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Point of Contact</h2>
                <p className="text-sm text-muted-foreground">Primary contact for business inquiries</p>
              </div>
            </div>
            <div className="grid l:grid-cols-3 gap-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">Name</span>
                <p className="text-foreground font-medium">{businessData.poc_details?.name || "N/A"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Email</span>
                {businessData.poc_details.email ? (
                  <a
                    href={`mailto:${businessData.poc_details.email}`}
                    className="text-active hover:text-primary-dark transition-fast block font-medium"
                  >
                    {businessData.poc_details.email}
                  </a>
                ) : (
                  <p className="text-foreground">N/A</p>
                )}
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">Phone</span>
                {businessData.poc_details.phone ? (
                  <a
                    href={`tel:${businessData.poc_details.phone}`}
                    className="text-active hover:text-primary-dark transition-fast block font-medium"
                  >
                    {businessData.poc_details.phone}
                  </a>
                ) : (
                  <p className="text-foreground">N/A</p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Keywords & Tags */}
        {businessData.keyword.length > 0 && (
          <Card className="p-6 bg-background border-border shadow-md animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-400 rounded-lg">
                <Tag className="w-5 h-5 text-white"/>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Keywords & Specializations</h2>
                <p className="text-sm">Areas of expertise and focus</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {businessData.keyword.map((item, index) => (
                <Badge
                  key={item.id || index}
                  variant="secondary"
                  className="px-4 py-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-smooth"
                >
                  {item.key || "N/A"}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {/* Media Gallery */}
        {businessData.media_url.length > 0 && (
          <Card className="p-6 bg-surface-variant border-border shadow-md animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Image className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Gallery</h2>
                <p className="text-sm text-muted-foreground">Explore our work and workspace</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {businessData.media_url.map((item, index) => (
                <div key={item.id || index} className="relative group overflow-hidden rounded-lg">
                  <img
                    src={item.media || placeholderImage}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-48 object-cover transition-smooth group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = placeholderImage;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-smooth"></div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Social Media */}
        {businessData.social_media.length > 0 && (
          <Card className="p-6 bg-background border-border shadow-md animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-400 rounded-lg">
                <ExternalLink className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Connect With Us</h2>
                <p className="text-sm text-muted-foreground">Follow us on social media</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-5">
              {businessData.social_media.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-surface-variant rounded-lg border border-border hover:shadow-md hover:border-primary/50 transition-smooth group"
                >
                  <ExternalLink className="w-5 h-5 text-primary group-hover:text-primary-dark transition-fast" />
                  <div className="flex-1">
                    <span className="font-medium text-foreground">
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
        )}

      {/* Additional Information */}
        {Array.isArray(businessData.extra_fields) &&
          businessData.extra_fields.length > 0 && (
            <Card className="p-6 bg-surface-variant border-border shadow-md animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary rounded-lg">
                  <Tag className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Additional Information</h2>
                  <p className="text-sm text-muted-foreground">Extended business details and specifications</p>
                </div>
              </div>
              <div className="space-y-4">
                {businessData.extra_fields.map((field: any, index: number) => (
                  <ExtraFieldRenderer key={field.id || index} field={field} />
                ))}
              </div>
            </Card>
          )}

      {/* Fallback when no data */}
      {!businessData.profile.name &&
        !businessData.address.city &&
        businessData.keyword.length === 0 &&
        businessData.media_url.length === 0 &&
        businessData.social_media.length === 0 &&
        Array.isArray(businessData.extra_fields) &&
        businessData.extra_fields.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Image className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-500">
              No business information available to display
            </p>
          </div>
        )}
    </div>
  );
};

export default BusinessPage;

