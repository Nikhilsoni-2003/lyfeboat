export type UserStore = {
  initialized: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isProfileCompleted: boolean;
  setIsLoggedIn: (status: boolean) => void;
  setIsAdmin: (status: boolean) => void;
  setIsProfileCompleted: (status: boolean) => void;
};
