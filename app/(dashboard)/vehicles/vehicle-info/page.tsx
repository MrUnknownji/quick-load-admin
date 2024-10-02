"use client";
import InputField from "@/components/form-components/InputField";
import SelectField from "@/components/form-components/SelectField";
import ImageComponent from "@/components/form-components/ImageComponent";
import { CheckCircle, XCircle, Edit, Check } from "lucide-react";
import { useState } from "react";

export default function VehicleInfo() {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

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
          />
          {isEditing ? (
            <Check
              className="h-8 w-8 text-blue-500 cursor-pointer"
              aria-label="Save"
              onClick={toggleEdit}
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
            type="text"
            value="KA01AB1234"
            onChange={() => {}}
            readOnly={!isEditing}
          />
          <SelectField
            label="Vehicle Type"
            options={["Open Body", "Container", "Trailer", "Dumper"]}
            value="Open Body"
            onChange={() => {}}
            readOnly={!isEditing}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <InputField
            label="Driver Name"
            type="text"
            value="John Doe"
            onChange={() => {}}
            readOnly={!isEditing}
          />
          <InputField
            label="Driver Phone"
            type="tel"
            value="+91 9876543210"
            onChange={() => {}}
            readOnly={!isEditing}
          />
        </div>

        <div className="mb-6">
          <InputField
            label="Vehicle Capacity"
            type="text"
            value="10 tons"
            onChange={() => {}}
            readOnly={!isEditing}
          />
        </div>

        <div className="mb-6">
          <ImageComponent
            title="Vehicle Image"
            imageUrl="/api/placeholder/400/320"
          />
        </div>

        <div className="mb-6">
          <ImageComponent
            title="Vehicle Registration Document"
            imageUrl="/api/placeholder/400/320"
          />
        </div>
      </form>
    </div>
  );
}
