/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Router from "next/router";

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
          userId: session.user.id, // Передаем userId
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
    <div>
      <ul>
        {cart.map((item) => (
          <li
            key={`${item.id}-${item.size}`}
            className="flex items-center justify-between mb-4 border-b pb-2"
          >
            <div>
              <p className="text-lg font-semibold">{item.name}</p>
              {item.size && <p className="text-sm">Размер: {item.size}</p>}
              <p className="text-sm">Цена: {item.price} ₽</p>
              <p className="text-sm">Количество: {item.quantity}</p>
            </div>
            <div>
              <Image
                src={item.imageUrl}
                alt={item.name}
                className="w-20 h-20 object-cover"
                width={1920}
                height={1080}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <div className="text-xl font-bold">Итоговая цена: {total} ₽</div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Контактные данные</h2>
        <div className="mb-4">
          <input
            type="text"
            name="fullName"
            placeholder="ФИО"
            value={formData.fullName}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="phone"
            placeholder="Телефон"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="address"
            placeholder="Адрес доставки"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Способ оплаты</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="cash">Наличными</option>
            <option value="card">Банковской картой</option>
          </select>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">Заказ успешно оформлен!</p>}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`mt-4 bg-blue-500 text-white px-4 py-2 rounded ${
            loading ? "opacity-50" : ""
          }`}
        >
          {loading ? "Отправка..." : "Подтвердить заказ"}
        </button>
      </div>
    </div>
  );
};

export default OrderClient;
