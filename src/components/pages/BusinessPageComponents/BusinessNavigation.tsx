import { useEffect, useState, useRef } from "react";
import { 
  User, Tag, Phone, MapPin, 
  Image as ImageIcon, ExternalLink, Info, MoreHorizontal 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavigationItem = {
  id: string;
  label: string;
  icon: any;
};

export const navigationItems: NavigationItem[] = [
  { id: "contact", label: "Contact", icon: User },
  { id: "keywords", label: "Keywords", icon: Tag },
  { id: "contact-info", label: "Contact Info", icon: Phone },
  { id: "location", label: "Location", icon: MapPin },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "social", label: "Social Media", icon: ExternalLink },
  { id: "additional", label: "Additional Info", icon: Info },
];

type BusinessNavigationProps = {
  activeTab: string;
  onTabChange: (tabId: string) => void;
};

export const BusinessNavigation = ({ activeTab, onTabChange }: BusinessNavigationProps) => {
  const [visibleCount, setVisibleCount] = useState(navigationItems.length);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!navRef.current) return;

    const container = navRef.current;

    const calculateVisibleItems = () => {
      const containerWidth = container.offsetWidth;
      const isMobile = window.innerWidth < 640;

      if (isMobile) {
          setVisibleCount(navigationItems.length);
          return;
      }

      // Approximate widths
      const itemWidth = isMobile ? 60 : 140;
      const moreButtonWidth = isMobile ? 60 : 100;

      const availableWidth = containerWidth - moreButtonWidth;
      const maxVisibleItems = Math.floor(availableWidth / itemWidth);

      setVisibleCount(
        maxVisibleItems >= navigationItems.length
          ? navigationItems.length
          : Math.max(1, maxVisibleItems)
      );
    };

    // Run initially
    calculateVisibleItems();

    // ResizeObserver for smooth responsiveness
    const resizeObserver = new ResizeObserver(calculateVisibleItems);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  const visibleItems = navigationItems.slice(0, visibleCount);
  const dropdownItems = navigationItems.slice(visibleCount);
  const hasDropdown = dropdownItems.length > 0;

  return (
    <nav className="sticky top-0 z-10 bg-card border-b border-border shadow-sm">
      <div ref={navRef} className="overflow-x-auto scrollbar-hide">
        <div className="flex items-center min-w-max">
          {/* Visible items */}
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                  isActive
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-card-foreground hover:border-border"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Dropdown (More) */}
          {hasDropdown && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                    dropdownItems.some((item) => item.id === activeTab)
                      ? "text-primary border-primary"
                      : "text-muted-foreground border-transparent hover:text-card-foreground hover:border-border"
                  }`}
                >
                  <MoreHorizontal className="w-4 h-4" />
                  <span className="hidden sm:inline">More</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover">
                {dropdownItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <DropdownMenuItem
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      className={`flex items-center gap-2 cursor-pointer ${
                        isActive ? "bg-accent text-accent-foreground" : ""
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
};
