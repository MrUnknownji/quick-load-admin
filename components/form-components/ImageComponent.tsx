import React from "react";
import Image from "next/image";

interface ImageComponentProps {
  title: string;
  imageUrl: string;
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  name?: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({
  title,
  imageUrl,
  onFileChange,
  error,
  name,
}) => {
  return (
    <div className="border p-4 rounded">
      <p className="text-sm font-medium mb-2">{title}</p>
      <div className="bg-gray-200 h-40 flex items-center justify-center mb-2 rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          width={150}
          height={100}
          className="rounded-lg"
        />
      </div>
      {onFileChange && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload New {title}
          </label>
          <input
            type="file"
            onChange={onFileChange}
            accept="image/jpeg,image/png,image/svg+xml"
            name={name}
            className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default ImageComponent;
