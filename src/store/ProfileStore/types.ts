import type { UserProfile } from "@/services/api/gen";

export interface ProfileModalState {
  isOpen: boolean;
  mode: "create" | "edit";
  initialValues: UserProfile | undefined;
  openModal: (mode: "create" | "edit", initialValues?: UserProfile) => void;
  closeModal: () => void;
}
