import {
  deleteUser,
  getUserInfo,
  editUserProfile,
  loginUser,
  refreshToken as refreshTokenApi,
  getAllUsers as getAllUsersApi,
} from "../api/userApi";
import { User } from "../types/User";

export const deleteUserAccount = async (userId: string): Promise<void> => {
  await deleteUser(userId);
};

export const getCurrentUser = async (userId: string): Promise<User> => {
  return await getUserInfo(userId);
};

export const updateUserProfile = async (
  userId: string,
  userData: FormData,
): Promise<User> => {
  return await editUserProfile(userId, userData);
};

export const loginUserAccount = async (
  firebaseToken: string,
): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
  return await loginUser(firebaseToken);
};

export const refreshUserToken = async (
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string }> => {
  return await refreshTokenApi(refreshToken);
};

export const getAllUsers = async (): Promise<User[]> => {
  return await getAllUsersApi();
};
