import { apiClient, authApiClient } from "./apiClient";
import { Notification, NotificationRequest } from "@/types/Notification";

export const fetchNotifications = async (): Promise<Notification[]> => {
  const response = await authApiClient.get("/notifications/get");
  return response.data.notifications;
};

export const sendNotification = async (
  notificationData: NotificationRequest,
): Promise<Notification> => {
  const response = await apiClient.post(
    "/notifications/send",
    notificationData,
  );
  return response.data.notification;
};
