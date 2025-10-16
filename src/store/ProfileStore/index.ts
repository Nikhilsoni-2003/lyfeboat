import { create } from "zustand";
import type { ProfileModalState } from "./types";

export const createProfileModalStore = () =>
  create<ProfileModalState>((set) => ({
    isOpen: false,
    mode: "create",
    initialValues: undefined,
    openModal: (mode, initialValues) =>
      set({ isOpen: true, mode, initialValues }),
    closeModal: () => set({ isOpen: false }),
  }));
