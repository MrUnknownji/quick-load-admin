import React from "react";
import ListItem from "./components/ListItem";

const productsData = [
  {
    title: "Bajri",
    image: "https://quick-load.onrender.com/assets/bajri.jpeg",
    href: "/products/bajri",
  },
  {
    title: "Grit",
    image: "https://quick-load.onrender.com/assets/grit.png",
    href: "/products/grit",
  },
  {
    title: "Bricks",
    image: "https://quick-load.onrender.com/assets/bricks.webp",
    href: "/products/bricks",
  },
  {
    title: "Cement",
    image: "https://quick-load.onrender.com/assets/quick-load-icon.png",
    href: "/products/cement",
  },
];

const Products: React.FC = () => {
  return (
    <div className="space-y-4">
      {productsData.map((product, index) => (
        <ListItem
          key={index}
          title={product.title}
          image={product.image}
          href={product.href}
        />
      ))}
    </div>
  );
};

export default Products;
