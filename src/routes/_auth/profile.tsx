import { ProfileFeat } from "@/features/profile";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/_auth/profile")({
  validateSearch: z.object({
    update: z.boolean().optional(),
  }),
  component: ProfileFeat,
});
