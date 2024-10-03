"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import InputField from "@/components/form-components/InputField";
import SelectField from "@/components/form-components/SelectField";
import ImageComponent from "@/components/form-components/ImageComponent";
import { Edit, Check } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { User } from "@/types/User";
import LoadingComponent from "@/components/form-components/LoadingComponent";

type UpdatedFields = Partial<Omit<User, "aadharCard" | "panCard">> & {
  aadharCard?: File | string;
  panCard?: File | string;
  [key: string]: string | number | boolean | File | undefined;
};

const UserInfo = () => {
  const { userId } = useParams();
  const { getUser, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedFields, setUpdatedFields] = useState<UpdatedFields>({});
  const [imageErrors, setImageErrors] = useState({
    aadharCard: "",
    panCard: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const user = await getUser(userId as string);
        setUserData(user);
        setError(null);
      } catch (err) {
        setError("Failed to fetch user data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, getUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) =>
      prevData ? { ...prevData, [name]: value } : null,
    );
    setUpdatedFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) =>
      prevData ? { ...prevData, [name]: value } : null,
    );
    setUpdatedFields((prev) => ({ ...prev, [name]: value }));
  };

  const validateFile = useCallback((file: File, fieldName: string) => {
    const validTypes = ["image/jpeg", "image/png", "image/svg+xml"];
    const maxSize = 5 * 1024 * 1024;

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
        const fieldName = e.target.name as "aadharCard" | "panCard";

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
      setImageErrors({ aadharCard: "", panCard: "" });
    }
  };

  const createFormData = (): FormData => {
    const formData = new FormData();
    Object.entries(updatedFields).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === "boolean" || typeof value === "number") {
          formData.append(key, value.toString());
        } else if (typeof value === "string") {
          formData.append(key, value);
        } else {
          console.warn(`Unexpected type for ${key}:`, typeof value);
        }
      }
    });
    return formData;
  };

  const handleUpdate = async () => {
    if (!userData) return;
    if (Object.values(imageErrors).some((error) => error !== "")) {
      console.error("Please fix all errors before submitting");
      return;
    }

    setUpdating(true);
    try {
      const formData = createFormData();
      const updatedUser = await updateProfile(userId as string, formData);
      setUserData(updatedUser);
      setIsEditing(false);
      setUpdatedFields({});
      setError(null);
    } catch (err) {
      setError("Failed to update user information");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingComponent />;
  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>No user data found</div>;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Detail</h2>
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
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="First Name"
              name="firstName"
              type="text"
              value={userData.firstName}
              readOnly={!isEditing}
              onChange={handleInputChange}
            />
            <InputField
              label="Last Name"
              name="lastName"
              type="text"
              value={userData.lastName || ""}
              readOnly={!isEditing}
              onChange={handleInputChange}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              value={userData.email}
              readOnly={!isEditing}
              onChange={handleInputChange}
            />
            <InputField
              label="Phone number"
              name="phone"
              type="tel"
              value={userData.phone}
              readOnly={!isEditing}
              onChange={handleInputChange}
            />
            <SelectField
              label="Role"
              name="type"
              options={["driver", "merchant", "merchant-driver", "customer"]}
              value={userData.type}
              readOnly={!isEditing}
              onChange={handleSelectChange}
            />
            <SelectField
              label="Verified"
              name="isVerified"
              options={["true", "false"]}
              value={userData.isVerified.toString()}
              readOnly={!isEditing}
              onChange={handleSelectChange}
            />
          </div>
          <div className="mt-4">
            <InputField
              label="Address"
              name="address"
              type="text"
              value={userData.address || ""}
              readOnly={!isEditing}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-4">
            <InputField
              label="City"
              name="city"
              type="text"
              value={userData.city || ""}
              readOnly={!isEditing}
              onChange={handleInputChange}
            />
          </div>
        </section>
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageComponent
              title="Aadhar Card"
              imageUrl={
                userData.aadharCard
                  ? `https://quick-load.onrender.com/${userData.aadharCard}`
                  : "/api/placeholder/400/320"
              }
              onFileChange={isEditing ? handleImageChange : undefined}
              error={imageErrors.aadharCard}
              name="aadharCard"
            />
            <ImageComponent
              title="PAN Card"
              imageUrl={
                userData.panCard
                  ? `https://quick-load.onrender.com/${userData.panCard}`
                  : "/api/placeholder/400/320"
              }
              onFileChange={isEditing ? handleImageChange : undefined}
              error={imageErrors.panCard}
              name="panCard"
            />
          </div>
        </section>
      </form>
    </div>
  );
};

export default UserInfo;
