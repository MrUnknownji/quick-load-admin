"use client";
import React, { useState } from "react";
import { Eye, ChevronLeft, ChevronRight, X } from "lucide-react";
import { USERS } from "@/utils/dummyData";
import Link from "next/link";

interface User {
  name: string;
  role: string;
  phone: string;
  address: string;
  currentLocation: string;
  verified: boolean;
}

interface UserCardProps {
  title: string;
  count: string;
}

interface UserTableProps {
  users: User[];
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const UsersPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("All User");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="p-6 min-h-screen animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <UserCard title="All User" count="1000" />
        <UserCard title="Verified" count="807" />
        <UserCard title="Unverified" count="193" />
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6 animate-slideUp">
        <div className="flex flex-wrap gap-2 mb-4">
          {["All User", "Marchent", "Driver", "Merchant-Driver"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded-md flex items-center transition-all duration-300 ease-in-out ${
                selectedTab === tab
                  ? "bg-[var(--color-primary)] text-white scale-105"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab}
              {selectedTab === tab && tab !== "All User" && (
                <div className="ml-2 bg-white rounded-full p-1">
                  <X
                    size={14}
                    className="text-[var(--color-primary)] cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTab("All User");
                    }}
                  />
                </div>
              )}
            </button>
          ))}
        </div>

        <UserTable users={USERS} />
        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

const UserCard: React.FC<UserCardProps> = ({ title, count }) => (
  <div className="bg-white p-6 rounded-lg shadow text-center border border-gray-200 transition-all duration-200 ease-in-out transform hover:scale-105">
    <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-2 animate-fadeInUp">
      {count}
    </h2>
    <p className="text-sm text-gray-600">{title}</p>
  </div>
);

const UserTable: React.FC<UserTableProps> = ({ users }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b">
          <th className="text-left p-2">Users Name</th>
          <th className="text-left p-2">Role</th>
          <th className="text-left p-2">Phone Number</th>
          <th className="text-left p-2">Address/City</th>
          <th className="text-left p-2">Current Location</th>
          <th className="text-left p-2">View</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={index} className="border-b hover:bg-gray-50 animate-fadeIn">
            <td className="p-2">
              {user.name}
              {user.verified && <span className="text-green-500 ml-1">●</span>}
            </td>
            <td className="p-2">{user.role}</td>
            <td className="p-2">{user.phone}</td>
            <td className="p-2">{user.address}</td>
            <td className="p-2">{user.currentLocation}</td>
            <td className="p-2">
              <Link
                href="/users/user-info"
                className="text-gray-600 hover:text-gray-900 transition-transform duration-200 ease-in-out transform hover:scale-110"
              >
                <Eye size={18} />
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
    <p className="text-sm text-gray-600 mb-2 sm:mb-0">
      Showing data 1 to 10 of 256k entries
    </p>
    <div className="flex space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronLeft size={18} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded border ${
            currentPage === page
              ? "bg-[var(--color-primary)] text-white"
              : "hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  </div>
);

export default UsersPage;
