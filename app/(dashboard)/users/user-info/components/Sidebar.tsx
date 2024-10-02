import React from "react";
import Image from "next/image";

interface SidebarProps {
  profileImageUrl: string;
}

const Sidebar: React.FC<SidebarProps> = ({ profileImageUrl }) => {
  return (
    <div className="w-full md:w-64 bg-gray-800 md:fixed md:h-full flex flex-col justify-center items-center p-4 z-10 mt-20 md:mt-0">
      <div className="mb-6">
        <Image
          src={profileImageUrl}
          alt="Profile"
          width={120}
          height={120}
          className="rounded-full"
        />
      </div>
      <button className="w-full bg-primary-600 text-white py-2 px-4 rounded mb-2">
        Change profile photo
      </button>
      <button className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded">
        Remove Photo
      </button>
    </div>
  );
};

export default Sidebar;
