"use client";

import { useCart } from "@/app/context/CartContext";
import Image from "next/image";

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, total } = useCart();

  if (cart.length === 0) {
    return <div className="p-4">Корзина пуста</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Корзина</h1>
      <ul>
        {cart.map((item) => (
          <li
            key={`${item.id}-${item.size}`}
            className="flex items-center justify-between mb-4"
          >
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={200}
                height={200}
                className="mr-4"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 mr-4" /> // Placeholder if no image
            )}
            <div>
              <p className="text-lg">{item.name}</p>
              {/* Conditionally render size only if it's not empty */}
              {item.size ? (
                <p className="text-sm">Размер: {item.size}</p>
              ) : (
                <p className="text-sm"></p>
              )}
              <p className="text-sm">Цена: {item.price} ₽</p>
            </div>
            <div className="flex items-center">
              <button
                onClick={() =>
                  updateQuantity(item.id, item.size, item.quantity - 1)
                }
                disabled={item.quantity === 1} // Prevent decreasing below 1
              >
                -
              </button>
              <span className="mx-2">{item.quantity}</span>
              <button
                onClick={() =>
                  updateQuantity(item.id, item.size, item.quantity + 1)
                }
              >
                +
              </button>
              <button
                onClick={() => removeFromCart(item.id, item.size)}
                className="ml-4 text-red-500"
              >
                Удалить
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 text-xl">Итоговая цена: {total} ₽</div>
    </div>
  );
};

export default CartPage;
