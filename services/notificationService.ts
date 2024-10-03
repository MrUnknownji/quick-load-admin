import { fetchNotifications, sendNotification } from "@/api/notificationApi";
import { Notification, NotificationRequest } from "@/types/Notification";

export const getNotifications = async (): Promise<Notification[]> => {
  return await fetchNotifications();
};

export const createNotification = async (
  notificationData: NotificationRequest,
): Promise<Notification> => {
  return await sendNotification(notificationData);
};
