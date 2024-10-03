"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import InputField from "@/components/form-components/InputField";
import SelectField from "@/components/form-components/SelectField";
import ImageComponent from "@/components/form-components/ImageComponent";
import { Edit, Check } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { User } from "@/types/User";
import LoadingComponent from "@/components/form-components/LoadingComponent";

const UserInfo = () => {
  const { userId } = useParams();
  const { getUser, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aadharCardImage, setAadharCardImage] = useState<File | null>(null);
  const [panCardImage, setPanCardImage] = useState<File | null>(null);
  const [updatedFields, setUpdatedFields] = useState<Partial<User>>({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUser(userId as string);
        setUserData(user);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.name === "aadharCard") {
        setAadharCardImage(e.target.files[0]);
      } else if (e.target.name === "panCard") {
        setPanCardImage(e.target.files[0]);
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
    if (aadharCardImage) {
      formData.append("aadharCard", aadharCardImage);
    }
    if (panCardImage) {
      formData.append("panCard", panCardImage);
    }
    return formData;
  };

  const handleUpdate = async () => {
    if (!userData) return;

    try {
      const formData = createFormData();
      const updatedUser = await updateProfile(userId as string, formData);
      setUserData(updatedUser);
      setIsEditing(false);
      setAadharCardImage(null);
      setPanCardImage(null);
      setUpdatedFields({});
    } catch (err) {
      setError("Failed to update user information");
      console.error(err);
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
            {userData.aadharCard && (
              <ImageComponent
                title="Aadhar Card"
                imageUrl={`https://quick-load.onrender.com/${userData.aadharCard}`}
              />
            )}
            {userData.panCard && (
              <ImageComponent
                title="PAN Card"
                imageUrl={`https://quick-load.onrender.com/${userData.panCard}`}
              />
            )}
          </div>
          {isEditing && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Upload New Aadhar Card"
                name="aadharCard"
                type="file"
                onChange={handleImageChange}
              />
              <InputField
                label="Upload New PAN Card"
                name="panCard"
                type="file"
                onChange={handleImageChange}
              />
            </div>
          )}
        </section>
      </form>
    </div>
  );
};

export default UserInfo;
