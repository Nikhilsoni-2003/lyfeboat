import type { RouterContext } from "@/router";
import { v1LoginLogoutCreateMutation } from "@/services/api/gen/@tanstack/react-query.gen";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

export function useLogout(useUserStore: RouterContext["useUserStore"]) {
  const router = useRouter();
  return useMutation({
    ...v1LoginLogoutCreateMutation(),
    onSuccess: () => {
      useUserStore.setState({
        initialized: false,
        isLoggedIn: false,
        isProfileCompleted: false,
        isAdmin: false,
      });
      router.invalidate();
      toast.success("Logged out successfully");
    },
  });
}
