// src/router.tsx
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { createProfileModalStore } from "./store/ProfileStore";
import { createUserStore } from "./store/UserStore";

export interface RouterContext {
  useUserStore: ReturnType<typeof createUserStore>;
  useProfileModalStore: ReturnType<typeof createProfileModalStore>;
}

/**
 * Returns a new router instance each time.
 * This is the recommended approach in TanStack Start.
 */
export function getRouter() {
  const useUserStore = createUserStore();
  const useProfileModalStore = createProfileModalStore();

  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    context: {
      useUserStore,
      useProfileModalStore,
    },
    /**
     * Optional: Serialize store state for SSR/rehydration
     */
    dehydrate() {
      return {
        stores: JSON.stringify({
          user: useUserStore.getState(),
          profile: useProfileModalStore.getState(),
        }),
      };
    },
    hydrate(data) {
      if (data?.stores) {
        const parsed = JSON.parse(data.stores);
        useUserStore.setState(parsed.user);
        useProfileModalStore.setState(parsed.profile);
      }
    },
  });

  return router;
}
