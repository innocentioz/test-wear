"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

interface OrderItem {
  id: number;
  quantity: number;
  size?: string;
  price: number;
  product: {
    name: string;
  };
  imageUrl: string;
}

interface Order {
  id: number;
  status: string;
  address: string;
  items: OrderItem[];
}
export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => setOrders(data))
        .catch((err) => console.error("Ошибка загрузки заказов:", err));
    }
  }, [session]);

  if (status === "loading") return <p className="text-gray-600 animate-pulse">Загрузка...</p>;
  if (!session) return null;

  const { user } = session;

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/login");
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 transition-all hover:text-gray-700">
        Личный кабинет
      </h1>
      
      <div className="bg-white shadow-lg rounded-2xl p-8 transition-all duration-300 hover:shadow-xl">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            {user.fullName || "Имя не задано"}
          </h2>
          <p className="text-gray-600 font-medium">@{user.username}</p>
          <p className="text-gray-700">
            Статус:{" "}
            <span className="font-medium">
              {(() => {
                switch (user.role) {
                  case "admin":
                    return "Администратор";
                  case "moderator":
                    return "Модератор";
                  default:
                    return "Пользователь";
                }
              })()}
            </span>
          </p>

          <div className="flex gap-4 pt-4">
            {user.role === "admin" || user.role === "moderator" ? (
              <button
                className="px-6 py-3 bg-gray-900 text-white rounded-lg transition-all duration-300 hover:bg-gray-800 hover:shadow-md transform hover:-translate-y-0.5"
                onClick={() => router.push("/admin")}
              >
                Админ панель
              </button>
            ) : null}

            <button
              className="px-6 py-3 bg-gray-700 text-white rounded-lg transition-all duration-300 hover:bg-gray-600 hover:shadow-md transform hover:-translate-y-0.5"
              onClick={handleLogout}
            >
              Выйти
            </button>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold mt-12 mb-8 text-gray-900">Ваши заказы</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600 text-lg">Заказов пока нет.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 montserrat">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-xl">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Заказ #{order.id}</span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {order.status}
                  </span>
                </div>
                <p className="text-gray-700 text-sm">{order.address}</p>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="space-y-3">
                      <div className="relative aspect-square overflow-hidden rounded-lg">
                        <Image 
                          src={item.imageUrl} 
                          alt={item.product.name} 
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">{item.product.name}</p>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Количество: {item.quantity}</span>
                          <span>{item.price}₽</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
