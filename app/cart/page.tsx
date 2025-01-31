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
    return <div className="flex flex-col items-center gap-5 montserrat mt-24">
        Добавьте что-нибудь в корзину
        <Link href="/search" className="bg-neutral-800 text-white px-12 py-2 rounded-full">Каталог</Link>
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
      <h1 className="text-2xl font-bold mb-4 text-center">Корзина</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {cart.map((item) => (
          <div
            key={`${item.id}-${item.size}`}
            className="flex flex-col items-center justify-between mb-4 montserrat w-2/3 p-4"
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
              <div className="w-12 h-12 bg-gray-200" /> 
            )}
            <div className="flex flex-col gap-1">

              <p className="text-base">{item.name}</p>

              {item.size ? (
                <p className="text-base">Размер: {item.size}</p>
              ) : (
                <p className="text-base"></p>
              )}
              <p className="text-base">Цена: {item.price} ₽</p>

              <div className="flex items-center">
                <button
                  onClick={() =>
                    updateQuantity(item.id, item.size, item.quantity - 1)
                  }
                  disabled={item.quantity === 1} 
                  className="text-2xl"
                >
                  -
                </button>
                <span className="mx-2 text-base">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.id, item.size, item.quantity + 1)
                  }
                  className="text-2xl"
                >
                  +
                </button>
              </div>
            </div>

            <div className="pt-2">

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

      <div className="flex flex-col items-center pb-10 montserrat gap-5">
        <div className="mt-4 text-xl">Итоговая цена: <span className="font-medium motivasans">{total}₽</span> </div>

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
