import { useLogout } from "@/apis/logout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Link,
  useLocation,
  useNavigate,
  useRouteContext,
} from "@tanstack/react-router";
import { Bell, LogOut, Menu, Settings, User, UserRound } from "lucide-react";
import { useState } from "react";

interface TabItem {
  id: string;
  label: string;
  href: string;
}

const navigationItems: TabItem[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "leads", label: "Leads", href: "/leads" },
  { id: "services", label: "Services", href: "/services" },
  { id: "more", label: "More", href: "/more" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const context = useRouteContext({ from: "__root__" });
  const { useUserStore, useProfileModalStore } = context;
  const { isLoggedIn } = useUserStore();
  const navigate = useNavigate();
  const { mutate: logout, isPending } = useLogout(useUserStore);

  const doNavigate = (path: string) => {
    navigate({ to: path });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-2 md:px-10">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="logo" height={50} width={50} />
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <ul className="flex gap-2">
              {navigationItems.map((item) => {
                const isActive = currentPath === item.href;
                return (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className={`flex flex-col items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 group ${
                        isActive
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-100 active:bg-gray-150 border border-transparent"
                      }`}
                    >
                      <span
                        className={`text-sm font-medium transition-colors duration-200 ${
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

          <div className="hidden md:flex items-center space-x-2">
            {isLoggedIn ? (
              <>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                    3
                  </Badge>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            useProfileModalStore.getState().initialValues
                              ?.user_profile?.profile_url || ""
                          }
                          alt="User"
                        />
                        <AvatarFallback>
                          {useProfileModalStore
                            .getState()
                            .initialValues?.first_name?.charAt(0)
                            ?.toUpperCase() || <UserRound />}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem onClick={() => doNavigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => doNavigate("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        logout({});
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link className="cursor-pointer" to={"/login"}>
                <Button className="cursor-pointer" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 w-80">
                <MobileSidebar onClose={() => setIsOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileSidebar({ onClose }: { onClose: () => void }) {
  const context = useRouteContext({ from: "__root__" });
  const { useUserStore, useProfileModalStore } = context;
  const { isLoggedIn } = useUserStore();

  const navigate = useNavigate();
  const { mutate: logout } = useLogout(useUserStore);

  const handleMobileMenu = (path: string) => {
    navigate({ to: path });
    onClose();
  };

  return (
    <div className="flex h-full w-full flex-col bg-background">
      <div className="border-b px-6 py-4">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="logo" height={50} width={50} />
          </Link>
        </div>
      </div>

      <div className="flex-1 px-4 py-4">
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start"
              asChild
              onClick={onClose}
            >
              <a href={item.href}>{item.label}</a>
            </Button>
          ))}
        </nav>
      </div>

      <div className="border-t p-4">
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start p-2 h-auto"
              >
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage src="/diverse-user-avatars.png" alt="User" />
                  <AvatarFallback>
                    {useProfileModalStore
                      .getState()
                      .initialValues?.first_name?.charAt(0)
                      ?.toUpperCase() || <UserRound />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium">
                    {useProfileModalStore.getState().initialValues?.first_name}{" "}
                    {useProfileModalStore.getState().initialValues?.last_name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {useProfileModalStore.getState().initialValues?.email}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem onClick={() => handleMobileMenu("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleMobileMenu("/profile")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to={"/login"}>
            <Button className="w-full">Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
