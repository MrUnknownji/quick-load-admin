"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import InputField from "@/components/form-components/InputField";
import SelectField from "@/components/form-components/SelectField";
import ImageComponent from "@/components/form-components/ImageComponent";
import { Edit, Check } from "lucide-react";
import { useFetchVehicleById, useUpdateVehicle } from "@/hooks/useFetchVehicle";
import { Vehicle } from "@/types/Vehicle";
import LoadingComponent from "@/components/form-components/LoadingComponent";

export default function VehicleInfo() {
  const { vehicleId } = useParams();
  const { vehicle, loading, error } = useFetchVehicleById(vehicleId as string);
  const { updateVehicle } = useUpdateVehicle();
  const [isEditing, setIsEditing] = useState(false);
  const [vehicleData, setVehicleData] = useState<Vehicle | null>(null);
  const [updatedFields, setUpdatedFields] = useState<Partial<Vehicle>>({});
  const [drivingLicenceImage, setDrivingLicenceImage] = useState<File | null>(
    null,
  );
  const [rcImage, setRcImage] = useState<File | null>(null);
  const [panCardImage, setPanCardImage] = useState<File | null>(null);
  const [aadharCardImage, setAadharCardImage] = useState<File | null>(null);
  const [updating, setUpdating] = useState(false);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      switch (e.target.name) {
        case "drivingLicence":
          setDrivingLicenceImage(e.target.files[0]);
          break;
        case "rc":
          setRcImage(e.target.files[0]);
          break;
        case "panCard":
          setPanCardImage(e.target.files[0]);
          break;
        case "aadharCard":
          setAadharCardImage(e.target.files[0]);
          break;
      }
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setUpdatedFields({});
    }
  };

  const createFormData = (): FormData => {
    const formData = new FormData();
    Object.entries(updatedFields).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    if (drivingLicenceImage)
      formData.append("drivingLicence", drivingLicenceImage);
    if (rcImage) formData.append("rc", rcImage);
    if (panCardImage) formData.append("panCard", panCardImage);
    if (aadharCardImage) formData.append("aadharCard", aadharCardImage);
    return formData;
  };

  const handleUpdate = async () => {
    if (!vehicleData) return;

    setUpdating(true);
    const formData = createFormData();

    try {
      const updatedVehicle = await updateVehicle(vehicleId as string, formData);
      if (updatedVehicle) {
        setVehicleData(updatedVehicle);
        setIsEditing(false);
        setDrivingLicenceImage(null);
        setRcImage(null);
        setPanCardImage(null);
        setAadharCardImage(null);
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
          <div>
            <ImageComponent
              title="Driving Licence"
              imageUrl={
                vehicleData.drivingLicence || "/api/placeholder/400/320"
              }
            />
            {isEditing && (
              <InputField
                label="Upload New Driving Licence"
                name="drivingLicence"
                type="file"
                onChange={handleImageChange}
              />
            )}
          </div>
          <div>
            <ImageComponent
              title="RC Document"
              imageUrl={vehicleData.rc || "/api/placeholder/400/320"}
            />
            {isEditing && (
              <InputField
                label="Upload New RC Document"
                name="rc"
                type="file"
                onChange={handleImageChange}
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <ImageComponent
              title="PAN Card"
              imageUrl={vehicleData.panCard || "/api/placeholder/400/320"}
            />
            {isEditing && (
              <InputField
                label="Upload New PAN Card"
                name="panCard"
                type="file"
                onChange={handleImageChange}
              />
            )}
          </div>
          <div>
            <ImageComponent
              title="Aadhar Card"
              imageUrl={vehicleData.aadharCard || "/api/placeholder/400/320"}
            />
            {isEditing && (
              <InputField
                label="Upload New Aadhar Card"
                name="aadharCard"
                type="file"
                onChange={handleImageChange}
              />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
