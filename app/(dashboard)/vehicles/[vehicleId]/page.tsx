"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import InputField from "@/components/form-components/InputField";
import SelectField from "@/components/form-components/SelectField";
import ImageComponent from "@/components/form-components/ImageComponent";
import { CheckCircle, XCircle, Edit, Check } from "lucide-react";
import { useFetchVehicleById, useUpdateVehicle } from "@/hooks/useFetchVehicle";
import { Vehicle } from "@/types/Vehicle";

export default function VehicleInfo() {
  const { vehicleId } = useParams();
  const { vehicle, loading, error } = useFetchVehicleById(vehicleId as string);
  const { updateVehicle } = useUpdateVehicle();
  const [isEditing, setIsEditing] = useState(false);
  const [vehicleData, setVehicleData] = useState<Vehicle | null>(null);

  useEffect(() => {
    if (vehicle) {
      setVehicleData(vehicle);
    }
  }, [vehicle]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehicleData((prevData) =>
      prevData ? { ...prevData, [name]: value } : null,
    );
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVehicleData((prevData) =>
      prevData ? { ...prevData, [name]: value } : null,
    );
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const createFormData = (data: Partial<Vehicle>): FormData => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    return formData;
  };

  const handleVerify = async () => {
    if (!vehicleData) return;

    try {
      const formData = createFormData({ ...vehicleData, isVerified: true });
      const updatedVehicle = await updateVehicle(vehicleId as string, formData);
      setVehicleData(updatedVehicle);
    } catch (err) {
      console.error("Failed to verify vehicle:", err);
    }
  };

  const handleUpdate = async () => {
    if (!vehicleData) return;

    const formData = new FormData();
    Object.entries(vehicleData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    try {
      const updatedVehicle = await updateVehicle(vehicleId as string, formData);
      if (updatedVehicle) {
        setVehicleData(updatedVehicle);
        setIsEditing(false);
      } else {
        throw new Error("Failed to update vehicle: No data returned");
      }
    } catch (err) {
      console.error("Failed to update vehicle information:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!vehicleData) return <div>No vehicle data found</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Vehicle Detail</h2>
        <div className="flex space-x-2">
          <XCircle
            className="h-8 w-8 text-red-500 cursor-pointer"
            aria-label="Reject"
          />
          <CheckCircle
            className="h-8 w-8 text-green-500 cursor-pointer"
            aria-label="Verify"
            onClick={handleVerify}
          />
          {isEditing ? (
            <Check
              className="h-8 w-8 text-blue-500 cursor-pointer"
              aria-label="Save"
              onClick={handleUpdate}
            />
          ) : (
            <Edit
              className="h-8 w-8 text-blue-500 cursor-pointer"
              aria-label="Edit"
              onClick={toggleEdit}
            />
          )}
        </div>
      </div>
      <form>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <InputField
            label="Vehicle Number"
            name="vehicleNumber"
            type="text"
            value={vehicleData.vehicleNumber}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
          <SelectField
            label="Vehicle Type"
            name="vehicleType"
            options={["Open Body", "Container", "Trailer", "Dumper"]}
            value={vehicleData.vehicleType}
            onChange={handleSelectChange}
            readOnly={!isEditing}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <InputField
            label="Driver Name"
            name="driverName"
            type="text"
            value={vehicleData.driverName}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
          <InputField
            label="Driver Phone"
            name="phoneNumber"
            type="tel"
            value={vehicleData.phoneNumber}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
        </div>

        <div className="mb-6">
          <ImageComponent
            title="Vehicle Image"
            imageUrl={vehicleData.vehicleImage || "/api/placeholder/400/320"}
          />
        </div>

        <div className="mb-6">
          <ImageComponent
            title="Vehicle Registration Document"
            imageUrl={vehicleData.rc || "/api/placeholder/400/320"}
          />
        </div>
      </form>
    </div>
  );
}
