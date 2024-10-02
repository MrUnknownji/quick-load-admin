"use client";
import React, { useState } from "react";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Vehicle {
  type: string;
  number: string;
  driverName: string;
  driverPhone: string;
}

interface VehicleCardProps {
  title: string;
  count: string;
}

interface VehicleTableProps {
  vehicles: Vehicle[];
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const DUMMY_VEHICLES: Vehicle[] = [
  {
    type: "Open Body",
    number: "KA01AB1234",
    driverName: "John Doe",
    driverPhone: "+91 9876543210",
  },
  {
    type: "Container",
    number: "MH02CD5678",
    driverName: "Jane Smith",
    driverPhone: "+91 9876543211",
  },
  {
    type: "Trailer",
    number: "DL03EF9012",
    driverName: "Bob Johnson",
    driverPhone: "+91 9876543212",
  },
  {
    type: "Dumper",
    number: "TN04GH3456",
    driverName: "Alice Brown",
    driverPhone: "+91 9876543213",
  },
  // Add more dummy data as needed
];

const VehiclesPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState("All Vehicles");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="p-6 min-h-screen animate-fadeIn">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
        <VehicleCard title="All Vehicles" count="1000" />
        <VehicleCard title="Open Body" count="250" />
        <VehicleCard title="Container" count="300" />
        <VehicleCard title="Trailer" count="200" />
        <VehicleCard title="Dumper" count="250" />
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6 animate-slideUp">
        <div className="flex flex-wrap gap-2 mb-4">
          {["All Vehicles", "Open Body", "Container", "Trailer", "Dumper"].map(
            (type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-md transition-all duration-300 ease-in-out ${
                  selectedType === type
                    ? "bg-[var(--color-primary)] text-white scale-105"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {type}
              </button>
            ),
          )}
        </div>

        <VehicleTable vehicles={DUMMY_VEHICLES} />
        <Pagination
          currentPage={currentPage}
          totalPages={5}
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
          <th className="text-left p-2">View</th>
        </tr>
      </thead>
      <tbody>
        {vehicles.map((vehicle, index) => (
          <tr key={index} className="border-b hover:bg-gray-50 animate-fadeIn">
            <td className="p-2">{vehicle.type}</td>
            <td className="p-2">{vehicle.number}</td>
            <td className="p-2">{vehicle.driverName}</td>
            <td className="p-2">{vehicle.driverPhone}</td>
            <td className="p-2">
              <Link
                href="/vehicles/vehicle-info"
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
      Showing data 1 to 10 of 1000 entries
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
