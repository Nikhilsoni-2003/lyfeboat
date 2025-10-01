import { v1LoginLogoutCreateMutation } from "@/services/api/gen/@tanstack/react-query.gen";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

export function useLogout() {
  const router = useRouter();
  return useMutation({
    ...v1LoginLogoutCreateMutation(),
    onSuccess: () => {
      router.invalidate();
      toast.success("Logged out successfully");
    },
  });
}
