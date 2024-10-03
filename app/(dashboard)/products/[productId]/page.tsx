"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import InputField from "@/components/form-components/InputField";
import SelectField from "@/components/form-components/SelectField";
import ImageComponent from "@/components/form-components/ImageComponent";
import { Edit, Check } from "lucide-react";
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
  const [updatedFields, setUpdatedFields] = useState<Partial<Product>>({});
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
    setUpdatedFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData((prevData) =>
      prevData ? { ...prevData, [name]: value } : null,
    );
    setUpdatedFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProductImage(e.target.files[0]);
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
    if (productImage) {
      formData.append("productImage", productImage);
    }
    return formData;
  };

  const handleUpdate = async () => {
    if (!productData) return;

    const formData = createFormData();

    try {
      const updatedProduct = await updateProduct(productId as string, formData);
      if (updatedProduct) {
        setProductData(updatedProduct);
        setIsEditing(false);
        setProductImage(null);
        setUpdatedFields({});
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
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Detail</h2>
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
          <InputField
            label="Product Details"
            name="productDetails"
            type="text"
            value={productData.productDetails}
            onChange={handleInputChange}
            readOnly={!isEditing}
          />
          <SelectField
            label="Verified"
            name="isVerified"
            options={["true", "false"]}
            value={productData.isVerified.toString()}
            readOnly={!isEditing}
            onChange={handleSelectChange}
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
              type="file"
              onChange={handleImageChange}
            />
          )}
        </div>
      </form>
    </div>
  );
}
