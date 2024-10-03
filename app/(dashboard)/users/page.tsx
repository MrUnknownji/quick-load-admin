"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  SortAsc,
  SortDesc,
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

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers);
    };
    fetchUsers();
  }, [getUsers]);

  const filteredUsers = useMemo(() => {
    let filtered = users;
    if (selectedTab !== "All User") {
      filtered = users.filter(
        (user) => user.type.toLowerCase() === selectedTab.toLowerCase(),
      );
    }
    return filtered.sort((a, b) => {
      if (sortByVerified === "asc") {
        return Number(b.isVerified) - Number(a.isVerified);
      } else {
        return Number(a.isVerified) - Number(b.isVerified);
      }
    });
  }, [users, selectedTab, sortByVerified]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * 10;
    return filteredUsers.slice(startIndex, startIndex + 10);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / 10);

  if (loading) return <LoadingComponent />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 min-h-screen animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
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

      <div className="bg-white rounded-lg shadow p-4 sm:p-6 animate-slideUp">
        <div className="flex flex-wrap gap-2 mb-4">
          {["All User", "Merchant", "Driver", "Merchant-Driver"].map((tab) => (
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

        <div className="flex justify-end mb-4">
          <button
            onClick={() =>
              setSortByVerified((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="flex items-center px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            {sortByVerified === "asc" ? (
              <SortAsc size={18} />
            ) : (
              <SortDesc size={18} />
            )}
            <span className="ml-2">Sort by Verified</span>
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
