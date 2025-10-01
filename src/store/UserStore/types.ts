export type UserStore = {
  isLoggedIn: boolean;
  isAdmin: boolean;
  isProfileCompleted: boolean;
  setIsLoggedIn: (status: boolean) => void;
  setIsAdmin: (status: boolean) => void;
  setIsProfileCompleted: (status: boolean) => void;
};
