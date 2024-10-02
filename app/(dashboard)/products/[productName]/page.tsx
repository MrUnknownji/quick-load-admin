import React from "react";
import ListItem from "../components/ListItem";

interface ProductPageProps {
  params: {
    productName: string;
  };
}

const productsDetails = {
  bajri: [
    {
      title: "Fine Bajri",
      image: "https://quick-load.onrender.com/assets/fine-bajri.jpg",
      owner: "John Doe",
      price: "$20",
    },
    {
      title: "Coarse Bajri",
      image: "https://quick-load.onrender.com/assets/coarse-bajri.jpg",
      owner: "Jane Smith",
      price: "$25",
    },
  ],
  grit: [
    {
      title: "Small Grit",
      image: "https://quick-load.onrender.com/assets/small-grit.jpg",
      owner: "Alice Johnson",
      price: "$15",
    },
    {
      title: "Large Grit",
      image: "https://quick-load.onrender.com/assets/large-grit.jpg",
      owner: "Bob Williams",
      price: "$18",
    },
  ],
  bricks: [
    {
      title: "Red Bricks",
      image: "https://quick-load.onrender.com/assets/red-bricks.jpg",
      owner: "Charlie Brown",
      price: "$0.5 each",
    },
    {
      title: "Clay Bricks",
      image: "https://quick-load.onrender.com/assets/clay-bricks.jpg",
      owner: "Diana Clark",
      price: "$0.6 each",
    },
  ],
  cement: [
    {
      title: "Portland Cement",
      image: "https://quick-load.onrender.com/assets/portland-cement.jpg",
      owner: "Edward Davis",
      price: "$10",
    },
    {
      title: "Quick Setting Cement",
      image: "https://quick-load.onrender.com/assets/quick-cement.jpg",
      owner: "Fiona White",
      price: "$12",
    },
  ],
};

const ProductPage: React.FC<ProductPageProps> = ({ params }) => {
  const productName = params.productName as keyof typeof productsDetails;
  const products = productsDetails[productName] || [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 capitalize">
        {productName} Products
      </h1>
      <div className="space-y-4">
        {products.map((product, index) => (
          <ListItem
            key={index}
            title={product.title}
            subtitle={`Owner: ${product.owner} | Price: ${product.price}`}
            image={product.image}
            href="/products/product-info"
          />
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
