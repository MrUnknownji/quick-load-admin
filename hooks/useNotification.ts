import { useState, useEffect, useCallback } from "react";
import {
  getNotifications,
  createNotification,
} from "../services/notificationService";
import { Notification, NotificationRequest } from "../types/Notification";

export const useFetchNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return { notifications, loading, error, fetchNotifications };
};

export const useSendNotification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendNotification = async (notificationData: NotificationRequest) => {
    setLoading(true);
    try {
      const result = await createNotification(notificationData);
      setLoading(false);
      return result;
    } catch (err) {
      console.error("Error sending notification:", err);
      setError("Failed to send notification");
      setLoading(false);
    }
  };

  return { sendNotification, loading, error };
};
