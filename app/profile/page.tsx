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

  if (status === "loading") return <p>Загрузка...</p>;
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
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Личный кабинет</h1>
      <div className="border p-4 rounded">
        <h2 className="text-xl font-semibold mt-4">{user.fullName || "Имя не задано"}</h2>
        <p className="text-gray-600">@{user.username}</p>
        <p className="text-gray-600">
          Статус:{" "}
          <span>
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

        {user.role === "admin" || user.role === "moderator" ? (
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => router.push("/admin")}
          >
            Админ панель
          </button>
        ) : null}

        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          onClick={handleLogout}
        >
          Выйти
        </button>
      </div>

      <h2 className="text-xl font-bold mt-6">Ваши заказы</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600">Заказов пока нет.</p>
      ) : (
        <div className="">
          {orders.map((order) => (
            <div key={order.id} className="border p-4">
              <p>Статус: {order.status}</p>
              <p>Адрес:{order.address}</p>
              <div>
                {order.items.map((item) => (
                  <li key={item.id} className="flex flex-col">
                    <span>Заказ №{item.id}</span>
                    {item.product.name} (x{item.quantity}) - {item.price}₽
                    <Image src={item.imageUrl} alt={item.product.name} width={1920} height={1080}>

                    </Image>
                  </li>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
