"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import InputField from "@/components/form-components/InputField";
import SelectField from "@/components/form-components/SelectField";
import ImageComponent from "@/components/form-components/ImageComponent";
import { CheckCircle, XCircle, Edit, Check } from "lucide-react";
import { useFetchProductById, useUpdateProduct } from "@/hooks/useFetchProduct";
import { Product } from "@/types/Product";
import LoadingComponent from "@/components/form-components/LoadingComponent";

export default function ProductInfo() {
  const { productId } = useParams();
  const { product, loading, error } = useFetchProductById(productId as string);
  const { updateProduct } = useUpdateProduct();
  const [isEditing, setIsEditing] = useState(false);
  const [productData, setProductData] = useState<Product | null>(null);
  const [productImage, setProductImage] = useState<File | null>(null);
  const productTypes = ["Bajri", "Bricks", "Grit", "Cement"];

  useEffect(() => {
    if (product) {
      setProductData(product);
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData((prevData) =>
      prevData ? { ...prevData, [name]: value } : null,
    );
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData((prevData) =>
      prevData ? { ...prevData, [name]: value } : null,
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProductImage(e.target.files[0]);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const createFormData = (data: Partial<Product>): FormData => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    if (productImage) {
      formData.append("productImage", productImage);
    }
    return formData;
  };

  const toggleVerify = async () => {
    if (!productData) return;

    try {
      const newVerificationStatus = !productData.isVerified;
      const formData = createFormData({
        ...productData,
        isVerified: newVerificationStatus,
      });
      const updatedProduct = await updateProduct(productId as string, formData);
      if (updatedProduct) {
        setProductData(updatedProduct);
      } else {
        console.error(
          `Failed to ${newVerificationStatus ? "verify" : "unverify"} product: No data returned`,
        );
      }
    } catch (err) {
      console.error(
        `Failed to ${productData.isVerified ? "unverify" : "verify"} product:`,
        err,
      );
    }
  };

  const handleUpdate = async () => {
    if (!productData) return;

    const formData = createFormData(productData);

    try {
      const updatedProduct = await updateProduct(productId as string, formData);
      if (updatedProduct) {
        setProductData(updatedProduct);
        setIsEditing(false);
        setProductImage(null);
      } else {
        console.error("Failed to update product: No data returned");
      }
    } catch (err) {
      console.error("Failed to update product information:", err);
    }
  };

  if (loading) return <LoadingComponent />;
  if (error) return <div>Error: {error}</div>;
  if (!productData) return <div>No product data found</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Detail</h2>
        <div className="flex space-x-2">
          {productData.isVerified ? (
            <CheckCircle
              className="h-8 w-8 text-green-500 cursor-pointer"
              aria-label="Verified"
              onClick={toggleVerify}
            />
          ) : (
            <XCircle
              className="h-8 w-8 text-red-500 cursor-pointer"
              aria-label="Not Verified"
              onClick={toggleVerify}
            />
          )}
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
          <SelectField
            label="Product Type"
            name="productType"
            options={productTypes}
            value={productData.productType}
            onChange={handleSelectChange}
            readOnly={!isEditing}
          />
          <InputField
            label="Product Size"
            name="productSize"
            type="text"
            value={productData.productSize}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <InputField
            label="Product Price"
            name="productPrice"
            type="number"
            value={productData.productPrice.toString()}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
          <InputField
            label="Product Quantity"
            name="productQuantity"
            type="number"
            value={productData.productQuantity.toString()}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <InputField
            label="Product Location"
            name="productLocation"
            type="text"
            value={productData.productLocation}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
          <InputField
            label="Product Rating"
            name="productRating"
            type="number"
            value={productData.productRating.toString()}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
        </div>

        <div className="mb-6">
          <InputField
            label="Product Details"
            name="productDetails"
            type="text"
            value={productData.productDetails}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
        </div>

        <div className="mb-6">
          <ImageComponent
            title="Product Image"
            imageUrl={productData.productImage || "/api/placeholder/400/320"}
          />
          {isEditing && (
            <InputField
              label="Upload New Product Image"
              name="productImage"
              value={productData.productImage}
              type="file"
              onChange={handleImageChange}
            />
          )}
        </div>
      </form>
    </div>
  );
}
