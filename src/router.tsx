// src/router.tsx
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { createProfileModalStore } from "./store/ProfileStore";
import { createUserStore } from "./store/UserStore";

export interface RouterContext {
  useUserStore: ReturnType<typeof createUserStore>;
  useProfileModalStore: ReturnType<typeof createProfileModalStore>;
}

export function createRouter() {
  const useUserStore = createUserStore();
  const useProfileModalStore = createProfileModalStore();

  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    context: {
      useUserStore,
      useProfileModalStore,
    },
    dehydrate() {
      return {
        stores: JSON.stringify({
          user: useUserStore.getState(),
          profile: useProfileModalStore.getState(),
        }),
      };
    },
    hydrate(data) {
      const parsed = JSON.parse(data.stores);
      useUserStore.setState(parsed.user);
      useProfileModalStore.setState(parsed.profile);
    },
  });

  return router;
}
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
