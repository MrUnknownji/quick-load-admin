"use client";
import React, { useState, useMemo } from "react";
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
    if (selectedType !== "All Vehicles") {
      return vehicles.filter((vehicle) => vehicle.vehicleType === selectedType);
    }
    return vehicles;
  }, [vehicles, selectedType]);

  const paginatedVehicles = useMemo(() => {
    const sortedVehicles = [...filteredVehicles].sort((a, b) => {
      if (sortByVerified === "asc") {
        return Number(a.isVerified) - Number(b.isVerified);
      } else {
        return Number(b.isVerified) - Number(a.isVerified);
      }
    });
    const startIndex = (currentPage - 1) * 10;
    return sortedVehicles.slice(startIndex, startIndex + 10);
  }, [filteredVehicles, currentPage, sortByVerified]);

  const totalPages = Math.ceil(filteredVehicles.length / 10);

  const vehicleTypes = [
    "All Vehicles",
    ...Array.from(new Set(vehicles.map((v) => v.vehicleType))),
  ];

  if (loading) return <LoadingComponent />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 min-h-screen animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
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

      <div className="bg-white rounded-lg shadow p-4 animate-slideUp">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
            <AlertCircle className="mr-2" size={20} />
            <span>Error: {error}</span>
          </div>
        )}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <div className="flex flex-wrap gap-2">
            {vehicleTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-md flex items-center transition-all duration-300 ease-in-out ${
                  selectedType === type
                    ? "bg-[var(--color-primary)] text-white scale-105"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {type}
                {selectedType === type && type !== "All Vehicles" && (
                  <div className="ml-2 bg-white rounded-full p-1">
                    <X
                      size={12}
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
  <div className="bg-white p-4 rounded-lg shadow text-center border border-gray-200 transition-all duration-200 ease-in-out transform hover:scale-105">
    <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-1 animate-fadeInUp">
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
                href={`/vehicles/${vehicle._id}`}
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
