"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  SortAsc,
  SortDesc,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { User } from "@/types/User";
import LoadingComponent from "@/components/form-components/LoadingComponent";

interface UserCardProps {
  title: string;
  count: number;
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
  const { getUsers, loading, error } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedTab, setSelectedTab] = useState("All User");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortByVerified, setSortByVerified] = useState<"asc" | "desc">("asc");
  const userTypes = ["All User", "Merchant", "Driver", "Merchant-Driver"];

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsers();
      const filteredUsers = fetchedUsers.filter(
        (user) => user.type !== "admin",
      );
      setUsers(filteredUsers);
    };
    fetchUsers();
  }, [getUsers]);

  const filteredUsers = useMemo(() => {
    if (selectedTab !== "All User") {
      return users.filter(
        (user) => user.type.toLowerCase() === selectedTab.toLowerCase(),
      );
    }
    return users;
  }, [users, selectedTab]);

  const paginatedUsers = useMemo(() => {
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (sortByVerified === "asc") {
        return Number(a.isVerified) - Number(b.isVerified);
      } else {
        return Number(b.isVerified) - Number(a.isVerified);
      }
    });
    const startIndex = (currentPage - 1) * 10;
    return sortedUsers.slice(startIndex, startIndex + 10);
  }, [filteredUsers, currentPage, sortByVerified]);

  const totalPages = Math.ceil(filteredUsers.length / 10);

  if (loading) return <LoadingComponent />;

  return (
    <div className="p-4 min-h-screen animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <UserCard title="All User" count={users.length} />
        <UserCard
          title="Verified"
          count={users.filter((user) => user.isVerified).length}
        />
        <UserCard
          title="Unverified"
          count={users.filter((user) => !user.isVerified).length}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-4 animate-slideUp">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
            <AlertCircle className="mr-2" size={20} />
            <span>Error: {error}</span>
          </div>
        )}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <div className="flex flex-wrap gap-2">
            {userTypes.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-3 py-1 rounded-md flex items-center transition-all duration-300 ease-in-out ${
                  selectedTab === tab
                    ? "bg-[var(--color-primary)] text-white scale-105"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab}
                {selectedTab === tab && tab !== "All User" && (
                  <div className="ml-2 bg-white rounded-full p-1">
                    <X
                      size={12}
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
          <button
            onClick={() =>
              setSortByVerified((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="flex items-center px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            {sortByVerified === "asc" ? (
              <SortAsc size={16} />
            ) : (
              <SortDesc size={16} />
            )}
            <span className="ml-1 text-sm">Sort by Verified</span>
          </button>
        </div>

        <UserTable users={paginatedUsers} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

const UserCard: React.FC<UserCardProps> = ({ title, count }) => (
  <div className="bg-white p-4 rounded-lg shadow text-center border border-gray-200 transition-all duration-200 ease-in-out transform hover:scale-105">
    <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-1 animate-fadeInUp">
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
          <th className="text-left p-2">Location</th>
          <th className="text-left p-2">Is Verified</th>
          <th className="text-left p-2">View</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr
            key={user._id}
            className="border-b hover:bg-gray-50 animate-fadeIn"
          >
            <td className="p-2">
              {user.firstName} {user.lastName}
              {user.isVerified && (
                <span className="text-green-500 ml-1">●</span>
              )}
            </td>
            <td className="p-2">{user.type}</td>
            <td className="p-2">{user.phone}</td>
            <td className="p-2">
              {user.address}, {user.city}
            </td>
            <td className="p-2">{user.location}</td>s
            <td className="p-2">{user.isVerified ? "Yes" : "No"}</td>
            <td className="p-2">
              <Link
                href={`/users/${user._id}`}
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
      Showing data {(currentPage - 1) * 10 + 1} to{" "}
      {Math.min(currentPage * 10, totalPages * 10)} of {totalPages * 10} entries
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
