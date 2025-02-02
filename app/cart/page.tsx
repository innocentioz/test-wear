"use client";

import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "../components/ui/button";

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, total } = useCart();
  const router = useRouter();

  if (cart.length === 0) {
    return <div className="flex flex-col items-center gap-5 montserrat mt-12 sm:mt-24 px-4">
        <p className="text-center">Добавьте что-нибудь в корзину</p>
        <Link href="/search" className="bg-neutral-800 text-white px-8 sm:px-12 py-2 rounded-full text-sm sm:text-base">Каталог</Link>
      </div>
    ;
  }

  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/check-auth");
      if (response.ok) {
        router.push("/cart/order");
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Ошибка проверки авторизации", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">Корзина</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
        {cart.map((item) => (
          <div
            key={`${item.id}-${item.size}`}
            className="flex flex-col items-center mb-4 montserrat w-full max-w-[400px] mx-auto p-3 sm:p-4"
          >
            {item.imageUrl ? (
              <div className="relative w-full aspect-square max-w-[200px]">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-gray-200" /> 
            )}
            <div className="flex flex-col gap-1 w-full mt-3">
              <p className="text-sm sm:text-base">{item.name}</p>

              {item.size ? (
                <p className="text-sm sm:text-base">Размер: {item.size}</p>
              ) : (
                <p className="text-sm sm:text-base"></p>
              )}
              <p className="text-sm sm:text-base">Цена: {item.price} ₽</p>

              <div className="flex items-center justify-center mt-2">
                <button
                  onClick={() =>
                    updateQuantity(item.id, item.size, item.quantity - 1)
                  }
                  disabled={item.quantity === 1} 
                  className="text-xl sm:text-2xl px-3 py-1"
                >
                  -
                </button>
                <span className="mx-2 text-sm sm:text-base">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.id, item.size, item.quantity + 1)
                  }
                  className="text-xl sm:text-2xl px-3 py-1"
                >
                  +
                </button>
              </div>
            </div>

            <div className="pt-2 w-full flex justify-center">
              <Button
                onClick={() => removeFromCart(item.id, item.size)}
                variant="outline"
                size="long"
              >
                Удалить
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center pb-6 sm:pb-10 montserrat gap-4 sm:gap-5 mt-4 sm:mt-6">
        <div className="text-lg sm:text-xl">
          Итоговая цена: <span className="font-medium motivasans">{total}₽</span>
        </div>

        <Button
          onClick={handleCheckout}
          variant="outline"
          size="long"
        >
          Оформить заказ
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
