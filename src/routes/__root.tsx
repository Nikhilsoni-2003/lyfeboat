// src/routes/__root.tsx
/// <reference types="vite/client" />
import { checkLoggedIn } from "@/apis/getLoggedIn";
import { Footer } from "@/components/Footer";
import { GlobalProfileFormModal } from "@/components/GlobalProfileModal";
import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import type { RouterContext } from "@/router";
import appCss from "@/styles/app.css?url";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  useLocation,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context }) => {
    const loggedInData = await checkLoggedIn();
    if (loggedInData) {
      context.useUserStore.setState({
        isLoggedIn: loggedInData.is_authenticated,
        isProfileCompleted: loggedInData.is_profile_completed,
        isAdmin: loggedInData.is_superuser,
      });
      context.useProfileModalStore.setState({
        initialValues: loggedInData.user_profile,
      });
    } else {
      context.useUserStore.setState({
        isLoggedIn: false,
        isProfileCompleted: false,
      });
      context.useProfileModalStore.setState({
        initialValues: undefined,
      });
    }

    // if (rootInitialized) return;
    // rootInitialized = true;
    if (typeof window !== "undefined") {
      const match = document.cookie.match(/visitorId=([^;]+)/);
      if (!match) {
        const fp = await FingerprintJS.load();
        const { visitorId } = await fp.get();
        document.cookie = `visitorId=${visitorId}; path=/; SameSite=Lax`;
      }
    }
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },

      {
        title: "Lyfeboat",
      },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <p>Not found!</p>
        <Link to="/">Go home</Link>
      </div>
    );
  },
});

const queryClient = new QueryClient();

function RootComponent() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <RootDocument>
      <QueryClientProvider client={queryClient}>
        <div
          className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 animate-in fade-in duration-1000 flex flex-col${
            currentPath !== "/login" && !currentPath.startsWith("/dashboard")
              ? " pb-20"
              : ""
          }`}
        >
          {currentPath !== "/login" &&
            !currentPath.startsWith("/dashboard") && <Header />}
          <Outlet />
          {currentPath !== "/login" &&
            !currentPath.startsWith("/dashboard") && <Footer />}
        </div>
        <GlobalProfileFormModal />
        <Toaster richColors />
      </QueryClientProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
