import { useState, useCallback, useEffect } from "react";
import {
  deleteUserAccount,
  getCurrentUser,
  updateUserProfile,
  loginUserAccount,
  refreshUserToken,
  getAllUsers,
} from "../services/userService";
import { User } from "../types/User";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const deleteAccount = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteUserAccount(userId);
      setUser(null);
    } catch (err) {
      console.error("Error deleting account:", err);
      setError("Failed to delete account");
    } finally {
      setLoading(false);
    }
  }, []);

  const getUser = useCallback(async (userId: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const userData = await getCurrentUser(userId);
      setUser(userData);
      return userData;
    } catch (err) {
      console.error("Error fetching user info:", err);
      setError("Failed to fetch user info");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (userId: string, userData: FormData) => {
      setLoading(true);
      setError(null);
      try {
        const updatedUser = await updateUserProfile(userId, userData);
        setUser(updatedUser);
        return updatedUser;
      } catch (err) {
        console.error("Error updating profile:", err);
        setError("Failed to update profile");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const login = useCallback(async (firebaseToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const {
        user: loggedInUser,
        accessToken,
        refreshToken,
      } = await loginUserAccount(firebaseToken);
      console.log("Logged in user:", loggedInUser);
      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      return { user: loggedInUser, accessToken, refreshToken };
    } catch (err) {
      console.error("Error logging in:", err);
      setError("Failed to login");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshToken = useCallback(async (refreshToken: string) => {
    setLoading(true);
    setError(null);
    try {
      return await refreshUserToken(refreshToken);
    } catch (err) {
      console.error("Error refreshing token:", err);
      setError("Failed to refresh token");
    } finally {
      setLoading(false);
    }
  }, []);

  const getUsers = useCallback(async (): Promise<User[]> => {
    setLoading(true);
    setError(null);
    try {
      const users = await getAllUsers();
      return users;
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    deleteAccount,
    getUser,
    updateProfile,
    login,
    refreshToken,
    getUsers,
  };
};
