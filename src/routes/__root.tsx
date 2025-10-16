// src/routes/__root.tsx
/// <reference types="vite/client" />
import { checkLoggedIn } from "@/apis/getLoggedIn";
import {
  ClientErrorBoundary,
  UniversalErrorBoundary,
} from "@/components/ErrorBoundary";
import { Footer } from "@/components/Footer";
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
import { lazy, Suspense, type ReactNode } from "react";

const GlobalProfileFormModal = lazy(() =>
  import("@/components/GlobalProfileModal").then((m) => ({
    default: m.GlobalProfileFormModal,
  }))
);

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context }) => {
    if (!context.useUserStore.getState().initialized) {
      const loggedInData = await checkLoggedIn();

      if (loggedInData) {
        console.log("loggedInData", loggedInData);

        context.useUserStore.setState({
          initialized: true,
          isLoggedIn: loggedInData?.is_authenticated ?? false,
          isProfileCompleted: loggedInData?.is_profile_completed ?? false,
          isAdmin: loggedInData?.is_superuser ?? false,
        });

        context.useProfileModalStore.setState({
          initialValues: loggedInData?.user_profile,
        });
      } else {
        context.useUserStore.setState({
          initialized: true,
        });
      }
    }

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
  errorComponent: ({ error }) => <UniversalErrorBoundary error={error} />,
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
  const hideLayout =
    currentPath === "/login" || currentPath.startsWith("/dashboard");

  return (
    <RootDocument>
      <QueryClientProvider client={queryClient}>
        <ClientErrorBoundary>
          <div
            className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 animate-in fade-in duration-1000 flex flex-col${
              hideLayout ? "" : " pb-20"
            }`}
          >
            {/* Always render, just hide */}
            <div className={hideLayout ? "hidden" : ""}>
              <Header />
            </div>

            <Outlet />

            <div className={hideLayout ? "hidden" : ""}>
              <Footer />
            </div>
          </div>
          <Suspense fallback={null}>
            <GlobalProfileFormModal />
          </Suspense>
          <Toaster richColors />
        </ClientErrorBoundary>
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
