"use client";
import React, { useState, useMemo } from "react";
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  SortAsc,
  SortDesc,
} from "lucide-react";
import Link from "next/link";
import { useFetchVehicles } from "@/hooks/useFetchVehicle";
import { Vehicle } from "@/types/Vehicle";
import LoadingComponent from "@/components/form-components/LoadingComponent";

interface VehicleCardProps {
  title: string;
  count: number;
}

interface VehicleTableProps {
  vehicles: Vehicle[];
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const VehiclesPage: React.FC = () => {
  const { vehicles, loading, error } = useFetchVehicles();
  const [selectedType, setSelectedType] = useState("All Vehicles");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortByVerified, setSortByVerified] = useState<"asc" | "desc">("asc");

  const filteredVehicles = useMemo(() => {
    let filtered = vehicles;
    if (selectedType !== "All Vehicles") {
      filtered = vehicles.filter(
        (vehicle) => vehicle.vehicleType === selectedType,
      );
    }
    return filtered.sort((a, b) => {
      if (sortByVerified === "asc") {
        return Number(b.isVerified) - Number(a.isVerified);
      } else {
        return Number(a.isVerified) - Number(b.isVerified);
      }
    });
  }, [vehicles, selectedType, sortByVerified]);

  const paginatedVehicles = useMemo(() => {
    const startIndex = (currentPage - 1) * 10;
    return filteredVehicles.slice(startIndex, startIndex + 10);
  }, [filteredVehicles, currentPage]);

  const totalPages = Math.ceil(filteredVehicles.length / 10);

  const vehicleTypes = [
    "All Vehicles",
    ...Array.from(new Set(vehicles.map((v) => v.vehicleType))),
  ];

  if (loading) return <LoadingComponent />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 min-h-screen animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <VehicleCard title="All Vehicles" count={vehicles.length} />
        <VehicleCard
          title="Verified"
          count={vehicles.filter((vehicle) => vehicle.isVerified).length}
        />
        <VehicleCard
          title="Unverified"
          count={vehicles.filter((vehicle) => !vehicle.isVerified).length}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6 animate-slideUp">
        <div className="flex flex-wrap gap-2 mb-4">
          {vehicleTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-md flex items-center transition-all duration-300 ease-in-out ${
                selectedType === type
                  ? "bg-[var(--color-primary)] text-white scale-105"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {type}
              {selectedType === type && type !== "All Vehicles" && (
                <div className="ml-2 bg-white rounded-full p-1">
                  <X
                    size={14}
                    className="text-[var(--color-primary)] cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedType("All Vehicles");
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

        <VehicleTable vehicles={paginatedVehicles} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

const VehicleCard: React.FC<VehicleCardProps> = ({ title, count }) => (
  <div className="bg-white p-6 rounded-lg shadow text-center border border-gray-200 transition-all duration-200 ease-in-out transform hover:scale-105">
    <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-2 animate-fadeInUp">
      {count}
    </h2>
    <p className="text-sm text-gray-600">{title}</p>
  </div>
);

const VehicleTable: React.FC<VehicleTableProps> = ({ vehicles }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b">
          <th className="text-left p-2">Vehicle Type</th>
          <th className="text-left p-2">Vehicle Number</th>
          <th className="text-left p-2">Driver Name</th>
          <th className="text-left p-2">Driver Phone</th>
          <th className="text-left p-2">Is Verified</th>
          <th className="text-left p-2">View</th>
        </tr>
      </thead>
      <tbody>
        {vehicles.map((vehicle) => (
          <tr
            key={vehicle.vehicleId}
            className="border-b hover:bg-gray-50 animate-fadeIn"
          >
            <td className="p-2">
              {vehicle.vehicleType}
              {vehicle.isVerified && (
                <span className="text-green-500 ml-1">●</span>
              )}
            </td>
            <td className="p-2">{vehicle.vehicleNumber}</td>
            <td className="p-2">{vehicle.driverName}</td>
            <td className="p-2">{vehicle.phoneNumber}</td>
            <td className="p-2">{vehicle.isVerified ? "Yes" : "No"}</td>
            <td className="p-2">
              <Link
                href={`/vehicles/${vehicle.vehicleId}`}
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

export default VehiclesPage;
