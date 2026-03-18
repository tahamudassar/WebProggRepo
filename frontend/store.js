import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserData = create(
  persist(
    (set) => ({
      user: {
        username: "",
        email: "",
      },
      setUser: (userData) =>
        set({
          user: {
            username: userData.username,
            email: userData.email,
          },
        }),
      clearUser: () => {
        set({user:{
            username: "",
            email: ""
        }})
        localStorage.removeItem('user-storage');
    },
    }),
    {
      name: "user-storage", // Key for localStorage
      getStorage: () => localStorage,
    }
  )
);
