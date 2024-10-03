"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import InputField from "@/components/form-components/InputField";
import SelectField from "@/components/form-components/SelectField";
import ImageComponent from "@/components/form-components/ImageComponent";
import { Edit, Check } from "lucide-react";
import { useFetchVehicleById, useUpdateVehicle } from "@/hooks/useFetchVehicle";
import { Vehicle } from "@/types/Vehicle";
import LoadingComponent from "@/components/form-components/LoadingComponent";

type UpdatedFields = Partial<
  Omit<Vehicle, "drivingLicence" | "rc" | "panCard" | "aadharCard">
> & {
  drivingLicence?: File;
  rc?: File;
  panCard?: File;
  aadharCard?: File;
};

export default function VehicleInfo() {
  const { vehicleId } = useParams();
  const { vehicle, loading, error } = useFetchVehicleById(vehicleId as string);
  const { updateVehicle } = useUpdateVehicle();
  const [isEditing, setIsEditing] = useState(false);
  const [vehicleData, setVehicleData] = useState<Vehicle | null>(null);
  const [updatedFields, setUpdatedFields] = useState<UpdatedFields>({});
  const [updating, setUpdating] = useState(false);
  const [imageErrors, setImageErrors] = useState({
    drivingLicence: "",
    rc: "",
    panCard: "",
    aadharCard: "",
  });

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
    setUpdatedFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVehicleData((prevData) =>
      prevData ? { ...prevData, [name]: value } : null,
    );
    setUpdatedFields((prev) => ({ ...prev, [name]: value }));
  };

  const validateFile = useCallback((file: File, fieldName: string) => {
    const validTypes = ["image/jpeg", "image/png", "image/svg+xml"];
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (!validTypes.includes(file.type)) {
      setImageErrors((prev) => ({
        ...prev,
        [fieldName]:
          "Invalid file type. Please upload a JPEG, PNG, or SVG image.",
      }));
      return false;
    }

    if (file.size > maxSize) {
      setImageErrors((prev) => ({
        ...prev,
        [fieldName]: "File size exceeds 5 MB limit.",
      }));
      return false;
    }

    setImageErrors((prev) => ({ ...prev, [fieldName]: "" }));
    return true;
  }, []);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const fieldName = e.target.name as keyof typeof imageErrors;

        if (validateFile(file, fieldName)) {
          setUpdatedFields((prev) => ({ ...prev, [fieldName]: file }));
        } else {
          e.target.value = "";
        }
      }
    },
    [validateFile],
  );

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setUpdatedFields({});
      setImageErrors({
        drivingLicence: "",
        rc: "",
        panCard: "",
        aadharCard: "",
      });
    }
  };

  const createFormData = (): FormData => {
    const formData = new FormData();
    Object.entries(updatedFields).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return formData;
  };

  const handleUpdate = async () => {
    if (!vehicleData) return;
    if (Object.values(imageErrors).some((error) => error !== "")) {
      console.error("Please fix all errors before submitting");
      return;
    }

    setUpdating(true);
    const formData = createFormData();

    try {
      const updatedVehicle = await updateVehicle(vehicleId as string, formData);
      if (updatedVehicle) {
        setVehicleData(updatedVehicle);
        setIsEditing(false);
        setUpdatedFields({});
      } else {
        console.error("Failed to update vehicle: No data returned");
      }
    } catch (err) {
      console.error("Failed to update vehicle information:", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingComponent />;
  if (error) return <div>Error: {error}</div>;
  if (!vehicleData) return <div>No vehicle data found</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Vehicle Detail</h2>
        <div>
          {isEditing ? (
            <Check
              className={`h-8 w-8 ${
                updating ? "text-gray-400" : "text-blue-500 cursor-pointer"
              }`}
              aria-label="Save"
              onClick={updating ? undefined : handleUpdate}
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
      {updating && <LoadingComponent />}
      <form className={updating ? "opacity-50 pointer-events-none" : ""}>
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
          <SelectField
            label="Verified Status"
            name="isVerified"
            options={["true", "false"]}
            value={vehicleData.isVerified?.toString() ?? "false"}
            onChange={handleSelectChange}
            readOnly={!isEditing}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <ImageComponent
            title="Driving Licence"
            imageUrl={vehicleData.drivingLicence || "/api/placeholder/400/320"}
            onFileChange={isEditing ? handleImageChange : undefined}
            error={imageErrors.drivingLicence}
            name="drivingLicence"
          />
          <ImageComponent
            title="RC Document"
            imageUrl={vehicleData.rc || "/api/placeholder/400/320"}
            onFileChange={isEditing ? handleImageChange : undefined}
            error={imageErrors.rc}
            name="rc"
          />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <ImageComponent
            title="PAN Card"
            imageUrl={vehicleData.panCard || "/api/placeholder/400/320"}
            onFileChange={isEditing ? handleImageChange : undefined}
            error={imageErrors.panCard}
            name="panCard"
          />
          <ImageComponent
            title="Aadhar Card"
            imageUrl={vehicleData.aadharCard || "/api/placeholder/400/320"}
            onFileChange={isEditing ? handleImageChange : undefined}
            error={imageErrors.aadharCard}
            name="aadharCard"
          />
        </div>
      </form>
    </div>
  );
}
