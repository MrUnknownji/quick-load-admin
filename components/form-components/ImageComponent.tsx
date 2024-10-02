import React from "react";
import Image from "next/image";

interface ImageComponentProps {
  title: string;
  imageUrl: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ title, imageUrl }) => {
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
    </div>
  );
};

export default ImageComponent;
