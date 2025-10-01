import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouteContext } from "@tanstack/react-router";
import { ProfileForm } from "./forms/ProfileForm";

export function GlobalProfileFormModal() {
  const context = useRouteContext({ from: "__root__" });
  const { useProfileModalStore } = context;
  const { isOpen, mode, initialValues, closeModal } = useProfileModalStore();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen: boolean) => !isOpen && closeModal()}
    >
      <DialogContent className="sm:max-w-md">
        <VisuallyHidden>
          <DialogTitle>
            {mode === "create" ? "Create Profile" : "Edit Profile"}
          </DialogTitle>
        </VisuallyHidden>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === "create" ? "Create Profile" : "Edit Profile"}
          </DialogTitle>
        </DialogHeader>
        <ProfileForm
          closeModal={closeModal}
          onOpenChange={(open) => !open && closeModal()}
          initialValues={initialValues || undefined}
        />
      </DialogContent>
    </Dialog>
  );
}
