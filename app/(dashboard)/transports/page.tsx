"use client";
import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, X, SortAsc, SortDesc } from "lucide-react";
import {
  useFetchDrivers,
  useFetchMerchantDrivers,
  useFetchMerchants,
} from "@/hooks/useFetchRoute";
import { Driver, Merchant } from "@/types/Route";
import LoadingComponent from "@/components/form-components/LoadingComponent";

interface TransportCardProps {
  title: string;
  count: number;
}

interface TransportTableProps {
  transports: (Driver | Merchant)[];
  error: string | null;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const TransportsPage: React.FC = () => {
  const {
    drivers,
    loading: driversLoading,
    error: driversError,
  } = useFetchDrivers();
  const {
    merchantDrivers,
    loading: merchantDriversLoading,
    error: merchantDriversError,
  } = useFetchMerchantDrivers();
  const {
    merchants,
    loading: merchantsLoading,
    error: merchantsError,
  } = useFetchMerchants();

  const [selectedTab, setSelectedTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortByName, setSortByName] = useState<"asc" | "desc">("asc");

  const allTransports = useMemo(() => {
    return [
      ...(drivers || []),
      ...(merchantDrivers || []),
      ...(merchants || []),
    ];
  }, [drivers, merchantDrivers, merchants]);

  const filteredTransports = useMemo(() => {
    if (selectedTab === "All") return allTransports;
    if (selectedTab === "Driver") return drivers || [];
    if (selectedTab === "Merchant") return merchants || [];
    if (selectedTab === "Merchant-Driver") return merchantDrivers || [];
    return [];
  }, [allTransports, drivers, merchants, merchantDrivers, selectedTab]);

  const sortedAndPaginatedTransports = useMemo(() => {
    const sorted = [...filteredTransports].sort((a, b) => {
      const nameA = a.userId.name.toLowerCase();
      const nameB = b.userId.name.toLowerCase();
      if (sortByName === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
    const startIndex = (currentPage - 1) * 10;
    return sorted.slice(startIndex, startIndex + 10);
  }, [filteredTransports, currentPage, sortByName]);

  const totalPages = Math.ceil(filteredTransports.length / 10);

  const getError = () => {
    switch (selectedTab) {
      case "All":
        return driversError || merchantDriversError || merchantsError;
      case "Driver":
        return driversError;
      case "Merchant":
        return merchantsError;
      case "Merchant-Driver":
        return merchantDriversError;
      default:
        return null;
    }
  };

  const isLoading = () => {
    switch (selectedTab) {
      case "All":
        return driversLoading || merchantDriversLoading || merchantsLoading;
      case "Driver":
        return driversLoading;
      case "Merchant":
        return merchantsLoading;
      case "Merchant-Driver":
        return merchantDriversLoading;
      default:
        return false;
    }
  };

  return (
    <div className="p-4 min-h-screen animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        <TransportCard title="All" count={allTransports.length} />
        <TransportCard title="Driver" count={drivers?.length || 0} />
        <TransportCard title="Merchant" count={merchants?.length || 0} />
        <TransportCard
          title="Merchant-Driver"
          count={merchantDrivers?.length || 0}
        />
      </div>
      <div className="bg-white rounded-lg shadow p-4 animate-slideUp">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <div className="flex flex-wrap gap-2">
            {["All", "Driver", "Merchant", "Merchant-Driver"].map((tab) => (
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
                {selectedTab === tab && tab !== "All" && (
                  <div className="ml-2 bg-white rounded-full p-1">
                    <X
                      size={12}
                      className="text-[var(--color-primary)] cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTab("All");
                      }}
                    />
                  </div>
                )}
              </button>
            ))}
          </div>
          <button
            onClick={() =>
              setSortByName((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="flex items-center px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            {sortByName === "asc" ? (
              <SortAsc size={16} />
            ) : (
              <SortDesc size={16} />
            )}
            <span className="ml-1 text-sm">Sort by Name</span>
          </button>
        </div>
        {isLoading() ? (
          <LoadingComponent />
        ) : (
          <TransportTable
            transports={sortedAndPaginatedTransports}
            error={getError()}
          />
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

const TransportCard: React.FC<TransportCardProps> = ({ title, count }) => (
  <div className="bg-white p-4 rounded-lg shadow text-center border border-gray-200 transition-all duration-200 ease-in-out transform hover:scale-105">
    <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-1 animate-fadeInUp">
      {count}
    </h2>
    <p className="text-sm text-gray-600">{title}</p>
  </div>
);

const TransportTable: React.FC<TransportTableProps> = ({
  transports,
  error,
}) => (
  <div className="overflow-x-auto">
    {error ? (
      <div className="text-red-500 p-4">Error: {error}</div>
    ) : transports.length === 0 ? (
      <div className="text-gray-500 p-4">No data available</div>
    ) : (
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Email</th>
            <th className="text-left p-2">From</th>
            <th className="text-left p-2">To</th>
            <th className="text-left p-2">Vehicle</th>
          </tr>
        </thead>
        <tbody>
          {transports.map((transport, index) => (
            <tr
              key={index}
              className="border-b hover:bg-gray-50 animate-fadeIn"
            >
              <td className="p-2">{transport.userId.name}</td>
              <td className="p-2">{transport.userId.email}</td>
              <td className="p-2">{transport.from}</td>
              <td className="p-2">{transport.to}</td>
              <td className="p-2">
                {"selfVehicle" in transport
                  ? transport.selfVehicle
                  : transport.vehicle}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
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

export default TransportsPage;
