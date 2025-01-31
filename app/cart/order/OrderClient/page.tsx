/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Router from "next/router";
import PaymentSelect from "@/app/components/ui/PaymentSelect";

const OrderClient = () => {
  const { cart, total, clearCart } = useCart();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    paymentMethod: "cash",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const paymentMethods = [
    { value: "cash", label: "Наличными" },
    { value: "card", label: "Банковской картой" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!session) {
      setError("Вы должны быть авторизованы для оформления заказа!");
      return;
    }
  
    if (!formData.fullName || !formData.phone || !formData.address) {
      setError("Заполните все поля!");
      return;
    }
  
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          cartItems: cart,
          totalPrice: total,
          customerInfo: formData,
          status: "Обработан",
        }),
      });
  
      if (!response.ok) {
        throw new Error("Ошибка при создании заказа.");
      }
  
      setSuccess(true);
      clearCart(); 
      Router.push("@/profile");
    } catch (error: any) {
      setError(error.message || "Ошибка при отправке заказа.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return <p>Корзина пуста. Добавьте товары для оформления заказа.</p>;
  }

  return (
    <div className="montserrat">
      <div className="flex gap-16">
        <div className="">
          <h2 className="text-lg mb-4 text-center">Контактные данные</h2>
          <div className="mb-4">
            <input
              type="text"
              name="fullName"
              placeholder="Ваше имя"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full border border-neutral-300 rounded-lg py-2 px-4 focus:outline-none focus:border-neutral-800 transition-colors-300"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="phone"
              placeholder="Ваш телефон"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full border border-neutral-300 rounded-lg py-2 px-4 focus:outline-none focus:border-neutral-800 transition-colors-300"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="address"
              placeholder="Адрес доставки"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full border border-neutral-300 rounded-lg py-2 px-4 focus:outline-none focus:border-neutral-800 transition-colors-300"
            />
          </div>
          <div className="mb-4">
          <PaymentSelect
            paymentMethods={paymentMethods}
            selectedPaymentMethod={formData.paymentMethod}
            onPaymentMethodChange={(newMethod) => setFormData({ ...formData, paymentMethod: newMethod })}
          />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">Заказ успешно оформлен!</p>}
        </div>

        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 max-h-[600px] overflow-y-auto mt-10">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                >
                  <div>
                    <div>
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={200}
                        height={200}
                      />
                    </div>
                    <p className="text-base max-w-72">{item.name}</p>
                    {item.size && <p className="text-sm">Размер: {item.size}</p>}
                    <p className="text-base">Цена: {item.price} ₽</p>
                    <p className="text-base">Количество: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

          <div className="mt-4 flex flex-col">
            <div className="mt-4 text-xl">Итоговая цена: <span className="font-medium motivasans">{total}₽</span> </div>
            <button
            onClick={handleSubmit}
            disabled={loading}
            className={`mt-4 bg-neutral-800 text-white py-2 rounded-full w-1/3 hover:bg-neutral-900 transition-all duration-300 ease-in-out ${
              loading ? "opacity-50" : ""
            }`}
            >
              {loading ? "Отправка..." : "Подтвердить заказ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderClient;
