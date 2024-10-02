import { apiClient, authApiClient } from "./apiClient";

export const deleteUser = async (userId: string) => {
  const response = await authApiClient.delete(`/user/${userId}`);
  return response.data;
};

export const getUserInfo = async (userId: string) => {
  const response = await authApiClient.get(`/user/${userId}`);
  return response.data.user;
};

export const editUserProfile = async (userId: string, userData: FormData) => {
  const response = await authApiClient.put(`/user/${userId}`, userData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.user;
};

export const loginUser = async (firebaseToken: string) => {
  const response = await apiClient.post("/user/firebase-login", {
    access_token: firebaseToken,
  });
  return response.data;
};

export const refreshToken = async (refreshToken: string) => {
  const response = await apiClient.post("/user/refresh-token", {
    refreshToken,
  });
  return response.data;
};
