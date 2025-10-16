import { Link, useLocation } from "@tanstack/react-router";
import {
  Bell,
  Briefcase,
  Home,
  MoreHorizontal,
  TrendingUp,
} from "lucide-react";
import type React from "react";

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const tabs: TabItem[] = [
  { id: "home", label: "Home", icon: Home, href: "/" },
  { id: "leads", label: "Leads", icon: TrendingUp, href: "/leads" },
  { id: "services", label: "Services", icon: Briefcase, href: "/services" },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    href: "/notifications",
  },
  { id: "more", label: "More", icon: MoreHorizontal, href: "/more" },
];

export function Footer() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-40 ">
      <nav className="max-w-md mx-auto px-4">
        <ul className="flex items-center justify-between py-2">
          {tabs.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-100 active:bg-gray-150 border border-transparent"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 transition-colors duration-200 ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-500 group-hover:text-blue-600"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-500 group-hover:text-blue-600"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </footer>
  );
}
