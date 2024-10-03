"use client";
import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useFetchNotifications,
  useSendNotification,
  useUpdateNotification,
} from "@/hooks/useNotification";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faSpinner,
  faExclamationTriangle,
  faTimes,
  faPaperPlane,
  faEnvelope,
  faEnvelopeOpen,
  faSort,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { Notification, NotificationRequest } from "@/types/Notification";
import LoadingComponent from "@/components/form-components/LoadingComponent";

const NotificationsPage: React.FC = () => {
  const { notifications, loading, error, setNotifications, refetch } =
    useFetchNotifications();
  const {
    sendNotification,
    loading: sendLoading,
    error: sendError,
  } = useSendNotification();
  const { updateNotification } = useUpdateNotification();
  const [newNotification, setNewNotification] = useState<NotificationRequest>({
    type: "",
    message: "",
    userId: "",
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [updatingNotifications, setUpdatingNotifications] = useState<string[]>(
    [],
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<"all" | "read" | "unread">(
    "all",
  );

  useEffect(() => {
    if (!loading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [loading, isInitialLoad]);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await sendNotification(newNotification);
    if (result) {
      setNotifications((prev) => [...prev, result]);
      setNewNotification({ type: "", message: "", userId: "" });
      setIsFormVisible(false);
      refetch();
    }
  };

  const handleToggleRead = useCallback(
    async (notification: Notification) => {
      setUpdatingNotifications((prev) => [...prev, notification._id]);
      try {
        const updatedNotification = await updateNotification(notification._id, {
          isRead: !notification.isRead,
        });
        setTimeout(() => {
          setNotifications(
            (prev) =>
              prev.map((n) =>
                n._id === updatedNotification?._id ? updatedNotification : n,
              ) as Notification[],
          );
          refetch();
          setUpdatingNotifications((prev) =>
            prev.filter((id) => id !== notification._id),
          );
        }, 300);
      } catch (error) {
        console.error("Error updating notification:", error);
        setUpdatingNotifications((prev) =>
          prev.filter((id) => id !== notification._id),
        );
      }
    },
    [updateNotification, setNotifications, refetch],
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const sortNotifications = (notifications: Notification[]) => {
    return [...notifications].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  };

  const filterNotifications = (notifications: Notification[]) => {
    if (filterStatus === "all") return notifications;
    return notifications.filter((n) =>
      filterStatus === "read" ? n.isRead : !n.isRead,
    );
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const toggleFilterStatus = () => {
    setFilterStatus((prev) => {
      if (prev === "all") return "read";
      if (prev === "read") return "unread";
      return "all";
    });
  };

  if (loading && isInitialLoad) return <LoadingComponent />;

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

  const sortedAndFilteredNotifications = filterNotifications(
    sortNotifications(notifications),
  );

  return (
    <div className="container mx-auto px-4 relative">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-6 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold">Notification List</h2>
          <div className="space-x-2">
            <motion.button
              onClick={toggleSortOrder}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              whileTap={{ scale: 0.95 }}
            >
              <FontAwesomeIcon icon={faSort} className="mr-2" />
              {sortOrder === "asc" ? "Oldest First" : "Newest First"}
            </motion.button>
            <motion.button
              onClick={toggleFilterStatus}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              whileTap={{ scale: 0.95 }}
            >
              <FontAwesomeIcon icon={faFilter} className="mr-2" />
              {filterStatus === "all"
                ? "All"
                : filterStatus === "read"
                  ? "Read"
                  : "Unread"}
            </motion.button>
          </div>
        </div>
        <AnimatePresence>
          {sortedAndFilteredNotifications.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 text-center text-gray-500"
            >
              No notifications found.
            </motion.p>
          ) : (
            <motion.ul
              className="divide-y divide-gray-200"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
            >
              {sortedAndFilteredNotifications.map(
                (notification: Notification) => (
                  <motion.li
                    key={notification._id}
                    className={`p-6 hover:bg-gray-50 transition-colors`}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    animate={{
                      opacity: updatingNotifications.includes(notification._id)
                        ? 0.5
                        : 1,
                      transition: { duration: 0.3 },
                    }}
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
                      <div className="ml-4 flex-shrink-0 flex items-center">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            notification.isRead
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {notification.isRead ? "Read" : "Unread"}
                        </span>
                        <motion.button
                          onClick={() => handleToggleRead(notification)}
                          className="ml-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors duration-200"
                          disabled={updatingNotifications.includes(
                            notification._id,
                          )}
                          whileTap={{
                            scale: updatingNotifications.includes(
                              notification._id,
                            )
                              ? 1
                              : 0.95,
                          }}
                        >
                          <FontAwesomeIcon
                            icon={
                              notification.isRead ? faEnvelope : faEnvelopeOpen
                            }
                            className="mr-1"
                          />
                          {notification.isRead
                            ? "Mark as Unread"
                            : "Mark as Read"}
                        </motion.button>
                      </div>
                    </div>
                  </motion.li>
                ),
              )}
            </motion.ul>
          )}
        </AnimatePresence>
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
                  className="bg-primary-600 text-white px-6 py-3 rounded-md w-full text-sm font-medium transition-colors duration-200 hover:bg-primary-700"
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
