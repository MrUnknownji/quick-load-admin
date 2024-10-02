import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faSignOutAlt,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import SearchBar from "./SearchBar";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          <button className="ml-4 text-gray-600 hover:text-gray-800">
            <FontAwesomeIcon icon={faBell} />
          </button>
          <div className="ml-4 flex items-center relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center focus:outline-none"
            >
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
              <FontAwesomeIcon
                icon={faChevronDown}
                className="ml-2 text-gray-600"
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 top-full border border-gray-200 animate-fadeInUp">
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left transition duration-150 ease-in-out"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
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
