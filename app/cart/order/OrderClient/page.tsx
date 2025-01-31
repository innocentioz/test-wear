/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        clearCart();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [success, clearCart]);

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
    } catch (error: any) {
      setError(error.message || "Ошибка при отправке заказа.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-center text-base sm:text-lg md:text-xl lg:text-2xl px-4 md:px-6 lg:px-8">
          Корзина пуста. Добавьте товары для оформления заказа.
        </p>
      </div>
    );
  }

  return (
    <div className="montserrat w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
      <div className="flex flex-col lg:flex-row lg:gap-8 xl:gap-16 items-start">
        {/* Форма контактных данных */}
        <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
          <h2 className="text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 lg:mb-8 text-center">Контактные данные</h2>
          <div className="space-y-4 md:space-y-6 max-w-[500px] mx-auto">
            <input
              type="text"
              name="fullName"
              placeholder="Ваше имя"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full border border-neutral-300 rounded-lg py-2.5 sm:py-3 px-4 text-sm sm:text-base focus:outline-none focus:border-neutral-800 transition-colors duration-300"
            />
            <input
              type="text"
              name="phone"
              placeholder="Ваш телефон"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full border border-neutral-300 rounded-lg py-2.5 sm:py-3 px-4 text-sm sm:text-base focus:outline-none focus:border-neutral-800 transition-colors duration-300"
            />
            <input
              type="text"
              name="address"
              placeholder="Адрес доставки"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full border border-neutral-300 rounded-lg py-2.5 sm:py-3 px-4 text-sm sm:text-base focus:outline-none focus:border-neutral-800 transition-colors duration-300"
            />
            <div className="w-full relative z-10">
              <PaymentSelect
                paymentMethods={paymentMethods}
                selectedPaymentMethod={formData.paymentMethod}
                onPaymentMethodChange={(newMethod) => setFormData({ ...formData, paymentMethod: newMethod })}
              />
            </div>
          </div>
          {error && <p className="text-red-500 mt-4 text-sm sm:text-base text-center">{error}</p>}
          {success && <p className="text-green-500 mt-4 text-sm sm:text-base text-center">Заказ успешно оформлен!</p>}
        </div>

        {/* Корзина товаров */}
        <div className="w-full lg:w-1/2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] overflow-y-auto mt-4 sm:mt-6 lg:mt-10 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-neutral-100">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="w-full p-3 sm:p-4 border border-neutral-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex flex-col gap-2 sm:gap-3">
                  <div className="relative w-full aspect-square">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <p className="text-sm sm:text-base md:text-lg line-clamp-2">{item.name}</p>
                  {item.size && <p className="text-xs sm:text-sm md:text-base">Размер: {item.size}</p>}
                  <p className="text-sm sm:text-base md:text-lg">Цена: {item.price} ₽</p>
                  <p className="text-sm sm:text-base md:text-lg">Количество: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Итоговая информация */}
          <div className="mt-6 sm:mt-8 lg:mt-10 flex flex-col items-center lg:items-start space-y-4 pb-20">
            <div className="text-lg sm:text-xl lg:text-2xl text-center lg:text-left">
              Итоговая цена: <span className="font-medium motivasans">{total}₽</span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full sm:w-2/3 lg:w-1/2 bg-neutral-800 text-white py-3 sm:py-4 rounded-full text-sm sm:text-base lg:text-lg hover:bg-neutral-900 transition-all duration-300 ease-in-out ${
                loading ? "opacity-50 cursor-not-allowed" : ""
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
