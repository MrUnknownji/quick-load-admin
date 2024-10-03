"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useFetchNotifications,
  useSendNotification,
} from "@/hooks/useNotification";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faSpinner,
  faExclamationTriangle,
  faTimes,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { Notification, NotificationRequest } from "@/types/Notification";
import LoadingComponent from "@/components/form-components/LoadingComponent";

const NotificationsPage: React.FC = () => {
  const { notifications, loading, error, fetchNotifications } =
    useFetchNotifications();
  const {
    sendNotification,
    loading: sendLoading,
    error: sendError,
  } = useSendNotification();
  const [newNotification, setNewNotification] = useState<NotificationRequest>({
    type: "",
    message: "",
    userId: "",
  });
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendNotification(newNotification);
    setNewNotification({ type: "", message: "", userId: "" });
    fetchNotifications();
    setIsFormVisible(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) return <LoadingComponent />;

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-red-500 flex items-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
          <span>Error loading notifications: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 relative">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <h2 className="text-xl font-semibold p-6 bg-gray-50 border-b">
          Notification List
        </h2>
        {notifications.length === 0 ? (
          <p className="p-6 text-center text-gray-500">
            No notifications found.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification: Notification) => (
              <li
                key={notification._id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FontAwesomeIcon
                      icon={faBell}
                      className="text-primary-600"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.type}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {notification.message}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        notification.isRead
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {notification.isRead ? "Read" : "Unread"}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <motion.div
        className="fixed bottom-4 right-4 z-10"
        initial={false}
        animate={isFormVisible ? "open" : "closed"}
      >
        <motion.button
          className="bg-primary-600 text-white w-14 h-14 rounded-full flex items-center justify-center text-xl"
          onClick={() => setIsFormVisible(!isFormVisible)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon={isFormVisible ? faTimes : faPaperPlane} />
        </motion.button>

        <AnimatePresence>
          {isFormVisible && (
            <motion.div
              className="absolute bottom-20 right-0 bg-white shadow-lg rounded-lg p-8 w-96"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
            >
              <h2 className="text-2xl font-semibold mb-6">
                Send New Notification
              </h2>
              <form onSubmit={handleSendNotification} className="space-y-6">
                <div>
                  <label
                    htmlFor="type"
                    className="block mb-2 text-sm font-medium"
                  >
                    Type
                  </label>
                  <input
                    type="text"
                    id="type"
                    value={newNotification.type}
                    onChange={(e) =>
                      setNewNotification({
                        ...newNotification,
                        type: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-md text-sm"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-medium"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={newNotification.message}
                    onChange={(e) =>
                      setNewNotification({
                        ...newNotification,
                        message: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-md text-sm"
                    rows={4}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="userId"
                    className="block mb-2 text-sm font-medium"
                  >
                    User ID
                  </label>
                  <input
                    type="text"
                    id="userId"
                    value={newNotification.userId}
                    onChange={(e) =>
                      setNewNotification({
                        ...newNotification,
                        userId: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-md text-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-6 py-3 rounded-md w-full text-sm font-medium"
                  disabled={sendLoading}
                >
                  {sendLoading ? (
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                  ) : (
                    <FontAwesomeIcon icon={faBell} className="mr-2" />
                  )}
                  Send Notification
                </button>
              </form>
              {sendError && (
                <p className="text-red-500 mt-4 text-sm">
                  Error sending notification: {sendError}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default NotificationsPage;
