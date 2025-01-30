"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface OrderItem {
  id: number;
  quantity: number;
  size?: string;
  price: number;
  product: {
    name: string;
  };
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
        <ul className="mt-4 space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border p-4 rounded">
              <p>
                <strong>Статус:</strong> {order.status}
              </p>
              <p>
                <strong>Адрес:</strong> {order.address}
              </p>
              <p className="font-semibold mt-2">Товары:</p>
              <ul className="list-disc pl-5">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.product.name} (x{item.quantity}) - {item.price}₽
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
