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
    return <p>Ваш список избранного пуст.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Избранное</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {wishlist.map((item) => (
          <div key={item.id} className="flex flex-col items-center gap-5">
            <Link href={`/product/${item.productId}`} className="flex flex-col gap-2 hover:-translate-y-2 hover:transform duration-300">
              <Image
                src={item.product.imageUrl}
                alt={item.product.name}
                className="w-full h-48 object-cover"
                width={1920}
                height={1080}
              />
              <h2 className="">{item.product.name}</h2>
              <p className="">{item.product.price} ₽</p>
            </Link>

            <Button
              variant="outline"
              size="long"
              onClick={() => handleRemoveFromWishlist(item.productId)}
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
