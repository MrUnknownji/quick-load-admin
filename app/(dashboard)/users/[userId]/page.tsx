"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import InputField from "@/components/form-components/InputField";
import SelectField from "@/components/form-components/SelectField";
import { CheckCircle, XCircle, Edit, Check } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { User } from "@/types/User";

const UserInfo = () => {
  const { userId } = useParams();
  const { getUser, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) =>
      prevData ? { ...prevData, [name]: value } : null,
    );
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const createFormData = (data: Partial<User>): FormData => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    return formData;
  };

  const handleVerify = async () => {
    if (!userData) return;

    try {
      const formData = createFormData({ ...userData, isVerified: true });
      const updatedUser = await updateProfile(userId as string, formData);
      setUserData(updatedUser);
    } catch (err) {
      setError("Failed to verify user");
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    if (!userData) return;

    try {
      const formData = createFormData(userData);
      const updatedUser = await updateProfile(userId as string, formData);
      setUserData(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update user information");
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>No user data found</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Detail</h2>
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
        </section>
      </form>
    </div>
  );
};

export default UserInfo;
