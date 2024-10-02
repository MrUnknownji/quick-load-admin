"use client";
import React, { useState } from "react";
import InputField from "@/components/form-components/InputField";
import SelectField from "@/components/form-components/SelectField";
import ImageComponent from "@/components/form-components/ImageComponent";
import { CheckCircle, XCircle, Edit, Check } from "lucide-react";

const UserInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Jane Cooper",
    email: "janecooper123@gmail.com",
    phone: "+91 98765 43210",
    role: "Merchant-Driver",
    address:
      "Word no -3, near Shani Mandir, Aazad Nagar, Hisar, Haryana (125001)",
    shopName: "Raja Building Material",
    gstNumber: "2993839283",
    shopAddress: "",
    driverName: "",
    driverPhone: "",
    vehicleNumber: "",
    vehicleType: "Dumper",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

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
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Name"
              type="text"
              value={userData.name}
              readOnly={!isEditing}
              onChange={handleInputChange}
            />
            <InputField
              label="Email"
              type="email"
              value={userData.email}
              readOnly={!isEditing}
              onChange={handleInputChange}
            />
            <InputField
              label="Phone number"
              type="tel"
              value={userData.phone}
              readOnly={!isEditing}
              onChange={handleInputChange}
            />
            <SelectField
              label="Role"
              options={["Driver", "Merchant", "Merchant-Driver", "Customer"]}
              value={userData.role}
              readOnly={!isEditing}
              onChange={handleSelectChange}
            />
          </div>
          <div className="mt-4">
            <InputField
              label="Address"
              type="text"
              value={userData.address}
              readOnly={!isEditing}
              onChange={handleInputChange}
            />
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageComponent
              title="PAN card"
              imageUrl="https://via.placeholder.com/150x100"
            />
            <ImageComponent
              title="Aadhar card"
              imageUrl="https://via.placeholder.com/150x100"
            />
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Shop Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Shop Name"
              type="text"
              value={userData.shopName}
              readOnly={!isEditing}
              onChange={handleInputChange}
            />
            <InputField
              label="GST Number"
              type="text"
              value={userData.gstNumber}
              readOnly={!isEditing}
              onChange={handleInputChange}
            />
            <div className="col-span-1 md:col-span-2">
              <InputField
                label="Shop Address"
                type="text"
                value={userData.shopAddress}
                readOnly={!isEditing}
                onChange={handleInputChange}
              />
            </div>
            <ImageComponent
              title="Shop Image"
              imageUrl="https://via.placeholder.com/200x150"
            />
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-4">Vehicle Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Driver's Name"
              type="text"
              value={userData.driverName}
              readOnly={!isEditing}
              onChange={handleInputChange}
            />
            <InputField
              label="Driver's Phone Number"
              type="tel"
              value={userData.driverPhone}
              readOnly={!isEditing}
              onChange={handleInputChange}
            />
            <InputField
              label="Vehicle Number"
              type="text"
              value={userData.vehicleNumber}
              readOnly={!isEditing}
              onChange={handleInputChange}
            />
            <SelectField
              label="Vehicle Type"
              options={["Dumper", "Trailer", "Open Body", "Container"]}
              value={userData.vehicleType}
              readOnly={!isEditing}
              onChange={handleSelectChange}
            />
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Vehicle Image",
              "RC Image",
              "Driving License",
              "Aadhar Card Image",
              "PAN Card Image",
            ].map((item) => (
              <ImageComponent
                key={item}
                title={item}
                imageUrl="https://via.placeholder.com/150x100"
              />
            ))}
          </div>
        </section>
      </form>
    </div>
  );
};

export default UserInfo;
