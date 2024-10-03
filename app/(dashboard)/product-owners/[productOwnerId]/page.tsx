"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import InputField from "@/components/form-components/InputField";
import SelectField from "@/components/form-components/SelectField";
import ImageComponent from "@/components/form-components/ImageComponent";
import { Edit, Check } from "lucide-react";
import {
  useFetchProductOwners,
  useUpdateProductOwner,
} from "@/hooks/useFetchProduct";
import { ProductOwner } from "@/types/Product";
import LoadingComponent from "@/components/form-components/LoadingComponent";

const PRODUCT_TYPES = ["Bajri", "Bricks", "Grit", "Cement"];

type UpdatedFields = Partial<Omit<ProductOwner, "shopImage">> & {
  shopImage?: File;
};

export default function ProductOwnerInfo() {
  const { productOwnerId } = useParams();
  const { productOwners, loading, error } = useFetchProductOwners();
  const { updateProductOwner } = useUpdateProductOwner();
  const [isEditing, setIsEditing] = useState(false);
  const [ownerData, setOwnerData] = useState<ProductOwner | null>(null);
  const [updatedFields, setUpdatedFields] = useState<UpdatedFields>({});
  const [updating, setUpdating] = useState(false);
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    if (productOwners.length > 0) {
      const owner = productOwners.find((owner) => owner._id === productOwnerId);
      if (owner) {
        setOwnerData(owner);
      }
    }
  }, [productOwners, productOwnerId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOwnerData((prevData) =>
      prevData ? { ...prevData, [name]: value } : null,
    );
    setUpdatedFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "productType") {
      setOwnerData((prevData) =>
        prevData
          ? {
              ...prevData,
              productType: prevData.productType.includes(value)
                ? prevData.productType
                : [...prevData.productType, value],
            }
          : null,
      );
      setUpdatedFields((prev) => ({
        ...prev,
        productType: ownerData?.productType.includes(value)
          ? ownerData.productType
          : [...(ownerData?.productType || []), value],
      }));
    } else {
      setOwnerData((prevData) =>
        prevData ? { ...prevData, [name]: value } : null,
      );
      setUpdatedFields((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateFile = useCallback((file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/svg+xml"];
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (!validTypes.includes(file.type)) {
      setImageError(
        "Invalid file type. Please upload a JPEG, PNG, or SVG image.",
      );
      return false;
    }

    if (file.size > maxSize) {
      setImageError("File size exceeds 5 MB limit.");
      return false;
    }

    setImageError("");
    return true;
  }, []);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (validateFile(file)) {
          setUpdatedFields((prev) => ({ ...prev, shopImage: file }));
        } else {
          e.target.value = ""; // Clear the file input
        }
      }
    },
    [validateFile],
  );

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setUpdatedFields({});
      setImageError("");
    }
  };

  const createFormData = (): FormData => {
    const formData = new FormData();
    Object.entries(updatedFields).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "productType" && Array.isArray(value)) {
          value.forEach((type, index) => {
            formData.append(`productType[${index}]`, type);
          });
        } else if (key === "shopImage" && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return formData;
  };

  const handleUpdate = async () => {
    if (!ownerData) return;
    if (imageError) {
      console.error("Please fix the image error before submitting");
      return;
    }

    setUpdating(true);
    const formData = createFormData();

    try {
      const updatedOwner = await updateProductOwner(
        productOwnerId as string,
        formData,
      );
      if (updatedOwner) {
        setOwnerData(updatedOwner);
        setIsEditing(false);
        setUpdatedFields({});
      } else {
        console.error("Failed to update product owner: No data returned");
      }
    } catch (err) {
      console.error("Failed to update product owner information:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveProductType = (typeToRemove: string) => {
    setOwnerData((prevData) =>
      prevData
        ? {
            ...prevData,
            productType: prevData.productType.filter(
              (type) => type !== typeToRemove,
            ),
          }
        : null,
    );
    setUpdatedFields((prev) => ({
      ...prev,
      productType: ownerData?.productType.filter(
        (type) => type !== typeToRemove,
      ),
    }));
  };

  if (loading) return <LoadingComponent />;
  if (error) return <div>Error: {error}</div>;
  if (!ownerData) return <div>No product owner data found</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Owner Detail</h2>
        <div className="cursor-pointer">
          {isEditing ? (
            <Check
              className={`h-8 w-8 ${
                updating ? "text-gray-400" : "text-blue-500"
              }`}
              aria-label="Save"
              onClick={updating ? undefined : handleUpdate}
            />
          ) : (
            <Edit
              className="h-8 w-8 text-blue-500"
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
            label="Product Owner Name"
            name="productOwnerName"
            type="text"
            value={ownerData.productOwnerName}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
          <InputField
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            value={ownerData.phoneNumber.toString()}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <InputField
            label="GST Number"
            name="gstNumber"
            type="text"
            value={ownerData.gstNumber}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
          <InputField
            label="Shop Rating"
            name="shopRating"
            type="number"
            value={ownerData.shopRating.toString()}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
        </div>

        <div className="mb-6">
          <InputField
            label="Shop Address"
            name="shopAddress"
            type="text"
            value={ownerData.shopAddress}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <InputField
            label="State"
            name="state"
            type="text"
            value={ownerData.state}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
          <InputField
            label="City"
            name="city"
            type="text"
            value={ownerData.city}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
        </div>

        <div className="mb-6">
          <SelectField
            label="Verified Status"
            name="isVerified"
            options={["true", "false"]}
            value={ownerData.isVerified.toString()}
            onChange={handleSelectChange}
            readOnly={!isEditing}
          />
        </div>

        <div className="mb-6">
          <ImageComponent
            title="Shop Image"
            imageUrl={ownerData.shopImage || "/api/placeholder/400/320"}
            onFileChange={isEditing ? handleImageChange : undefined}
            error={imageError}
            name="shopImage"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Types
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {ownerData.productType.map((type) => (
              <div
                key={type}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center"
              >
                {type}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleRemoveProductType(type)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    &times;
                  </button>
                )}
              </div>
            ))}
          </div>
          {isEditing && (
            <SelectField
              label="Add Product Type"
              name="productType"
              options={PRODUCT_TYPES.filter(
                (type) => !ownerData.productType.includes(type),
              )}
              value=""
              onChange={handleSelectChange}
            />
          )}
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setOwnerData((prev) =>
                  prev
                    ? {
                        ...prev,
                        productType: [...prev.productType, ""],
                      }
                    : null,
                );
              }}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Product Type
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
