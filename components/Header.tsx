import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "./SearchBar";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useFetchNotifications } from "@/hooks/useNotification";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { notifications, refetch } = useFetchNotifications();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const count = notifications.filter(
      (notification) => !notification.isRead,
    ).length;
    setUnreadCount(count);
  }, [notifications]);

  useEffect(() => {
    refetch();
  }, [refetch, pathname]);

  const getBreadcrumb = () => {
    const path = pathname.split("/").filter((item) => item);
    const capitalizedPath = path.map(
      (item) => item.charAt(0).toUpperCase() + item.slice(1),
    );

    return (
      <ol className="list-none p-0 inline-flex">
        <li className="flex items-center">
          <span className="text-gray-600">Home</span>
          {path.length > 0 && <span className="mx-2 text-gray-500">/</span>}
        </li>
        {capitalizedPath.map((item, index) => (
          <li key={index} className="flex items-center">
            {index < capitalizedPath.length - 1 ? (
              <>
                <a
                  href={`/${path.slice(0, index + 1).join("/")}`}
                  className="text-gray-600"
                >
                  {item}
                </a>
                <span className="mx-2 text-gray-500">/</span>
              </>
            ) : (
              <span className="text-primary-600">{item}</span>
            )}
          </li>
        ))}
      </ol>
    );
  };

  const handleNotificationClick = () => {
    router.push("/notifications");
  };

  return (
    <header className="bg-white shadow-md">
      <div className="flex flex-wrap items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <nav className="text-sm hidden md:block">{getBreadcrumb()}</nav>
        </div>
        <div className="flex items-center mt-2 md:mt-0">
          <SearchBar />
          <button
            className="ml-4 text-gray-600 hover:text-gray-800 relative"
            onClick={handleNotificationClick}
          >
            <FontAwesomeIcon icon={faBell} className="text-xl" />{" "}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
          <div className="ml-4 flex items-center">
            <div className="h-8 w-8 relative">
              <Image
                src="/images/admin-avatar.png"
                alt="Admin"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <div className="ml-2 hidden md:block">
              <p className="text-sm font-semibold">John Doe</p>
              <p className="text-xs text-gray-600">Admin</p>
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden px-4 py-2">
        <nav className="text-sm">{getBreadcrumb()}</nav>
      </div>
    </header>
  );
};

export default Header;
