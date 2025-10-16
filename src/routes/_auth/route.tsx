import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    const userStore = context.useUserStore.getState();
    if (!userStore.isLoggedIn) {
      throw redirect({
        to: "/",
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href,
        },
      });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
