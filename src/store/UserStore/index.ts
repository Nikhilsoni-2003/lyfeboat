import { create } from "zustand";
import type { UserStore } from "./types";

export const createUserStore = () =>
  create<UserStore>((set) => ({
    initialized: false,
    isLoggedIn: false,
    isAdmin: true,
    isProfileCompleted: true,
    setIsLoggedIn: (status) => set({ isLoggedIn: status }),
    setIsAdmin: (status) => set({ isAdmin: status }),
    setIsProfileCompleted: (status) => set({ isProfileCompleted: status }),
  }));
