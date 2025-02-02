/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "../components/ui/button";

const WishlistClient = ({ wishlist: initialWishlist, userId }: { wishlist: any[]; userId: number }) => {
  const [wishlist, setWishlist] = useState(initialWishlist);

  const handleRemoveFromWishlist = async (productId: number) => {
    const response = await fetch("/api/wishlist", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        userId,
      }),
    });

    if (response.ok) {
      setWishlist((prev) => prev.filter((item) => item.productId !== productId));
    } else {
      alert("Не удалось удалить товар из избранного.");
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 lg:mt-12 mb-24 sm:mb-32">
        <p className="text-center text-lg sm:text-xl">Ваш список избранного пуст.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 lg:mt-12 mb-24 sm:mb-32">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center">Избранное</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 justify-items-center montserrat sm:text-sm">
        {wishlist.map((item) => (
          <div key={item.id} className="w-[85%] sm:w-5/6 flex flex-col items-center justify-between gap-4">
            <Link href={`/product/${item.productId}`} className="w-full flex flex-col gap-2 hover:-translate-y-2 hover:transform duration-300">
              <div className="relative aspect-square w-full">
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="object-cover"
                  fill
                />
              </div>
              <h2 className="text-base sm:text-base line-clamp-2">{item.product.name}</h2>
              <p className="text-base sm:text-base font-medium">{item.product.price} ₽</p>
            </Link>

            <Button
              onClick={() => handleRemoveFromWishlist(item.productId)}
              variant="outline"
              size="long"
            >
              Удалить
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistClient;
