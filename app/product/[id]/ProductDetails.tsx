"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Button from "@/app/components/ui/button";

type Size = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  sizes: Size[];
};

const ProductDetails = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const { data: session } = useSession();

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSize(e.target.value);
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize || "",
      quantity: 1,
      imageUrl: product.imageUrl,
    });
  };

  const handleAddToWishlist = async () => {
    if (!session) {
      alert("Вы должны быть авторизованы, чтобы добавлять товары в избранное");
      return;
    }
  
    const response = await fetch("/api/wishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: product.id,
        userId: session.user.id, // Передаем ID пользователя
      }),
    });
  
    const data = await response.json();
    if (response.ok) {
      alert("Товар добавлен в избранное");
    } else {
      alert(data.error || "Произошла ошибка");
    }
  };

  return (
    <div>
      <div className="p-4 w-1/4">
        <Image
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-96 object-cover"
          width={1920}
          height={1080}
        />
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-lg">{product.price} ₽</p>

        {product.sizes.length > 0 && (
          <div>
            <label htmlFor="size" className="block mt-4">Выберите размер:</label>
            <select
              id="size"
              value={selectedSize}
              onChange={handleSizeChange}
              className="border p-2 w-full"
            >
              <option value="">Без размера</option>
              {product.sizes.map((size) => (
                <option key={size.id} value={size.name}>
                  {size.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <Button
        onClick={handleAddToCart}
        variant="outline" size="long"
      >
        Добавить в корзину
      </Button>

      <button
        onClick={handleAddToWishlist}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Добавить в избранное
      </button>

    </div>
  );
};

export default ProductDetails;
