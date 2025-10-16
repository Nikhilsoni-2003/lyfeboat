import { LoginFeat } from "@/features/login";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_noauth/login")({
  component: LoginFeat,
});
