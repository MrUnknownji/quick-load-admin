"use client";
import InputField from "@/components/form-components/InputField";
import SelectField from "@/components/form-components/SelectField";
import ImageComponent from "@/components/form-components/ImageComponent";
import { CheckCircle, XCircle, Edit, Check } from "lucide-react";
import { useState } from "react";

export default function ProductInfo() {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Detail</h2>
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
            label="Product Name"
            type="text"
            value="1 Number"
            onChange={() => {}}
            readOnly={!isEditing}
          />
          <SelectField
            label="Product Type"
            options={["Bajri", "Grit", "Bricks", "Cement"]}
            value="Bajri"
            onChange={() => {}}
            readOnly={!isEditing}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <InputField
            label="Product Owner Name"
            type="text"
            value="Jane Cooper"
            onChange={() => {}}
            readOnly={!isEditing}
          />
          <InputField
            label="Product Price"
            type="number"
            value="99.99"
            onChange={() => {}}
            readOnly={!isEditing}
          />
        </div>

        <div className="mb-6">
          <InputField
            label="Product Stock"
            type="number"
            value="100"
            onChange={() => {}}
            readOnly={!isEditing}
          />
        </div>

        <div className="mb-6">
          <ImageComponent
            title="Product Image"
            imageUrl="/api/placeholder/400/320"
          />
        </div>
      </form>
    </div>
  );
}
