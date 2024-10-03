export interface Notification {
  _id: string;
  type: string;
  message: string;
  userId: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationRequest {
  type: string;
  message: string;
  userId: string;
}

export interface NotificationResponse {
  message: string;
  notifications: Notification[];
}

export interface SendNotificationResponse {
  message: string;
  notification: Notification;
}
