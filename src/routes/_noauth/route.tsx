import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_noauth")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    const userStore = context.useUserStore.getState();
    if (userStore.isLoggedIn) {
      throw redirect({ to: "/" });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
