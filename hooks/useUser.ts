import { useState, useCallback } from "react";
import {
  deleteUserAccount,
  getCurrentUser,
  updateUserProfile,
  loginUserAccount,
  refreshUserToken,
} from "../services/userService";
import { User } from "../types/User";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        console.error("Error updating profile:", err);
        setError("Failed to update profile");
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
      setUser(loggedInUser);
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

  return {
    user,
    loading,
    error,
    deleteAccount,
    getUser,
    updateProfile,
    login,
    refreshToken,
  };
};
