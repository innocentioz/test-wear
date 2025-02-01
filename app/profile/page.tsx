"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import EditProfileModal from "../components/ui/EditProfileModal";
import { Session } from "next-auth";

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
  const { data: session, update } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  useEffect(() => {
    if (session) {
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => setOrders(data))
        .catch((err) => console.error("Ошибка загрузки заказов:", err));
    }
  }, [session]);

  if (session) {
    const { user } = session;

    const handleLogout = async () => {
      try {
        await signOut({ redirect: false });
        router.push("/login");
      } catch (error) {
        console.error("Ошибка при выходе:", error);
      }
    };

    const handleProfileUpdate = async (data: {
      username?: string;
      fullName?: string;
    }) => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/users/${session.user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error);
        }

        const updatedUser = await response.json();

        await update((currentSession: Session) => ({
          ...currentSession,
          user: {
            ...currentSession?.user,
            username: updatedUser.username,
            fullName: updatedUser.fullName,
          }
        }));
        setIsEditModalOpen(false);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('An unknown error occurred');
      }
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24 sm:pb-32">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-gray-900 transition-all hover:text-gray-700">
          Личный кабинет
        </h1>
        
        <div className="bg-white shadow-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 transition-all duration-300 hover:shadow-xl">
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              {user.fullName || "Имя не задано"}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 font-medium">@{user.username}</p>
            <p className="text-sm sm:text-base text-gray-700">
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

            <div className="flex flex-wrap gap-3 sm:gap-4 pt-3 sm:pt-4">
              {user.role === "admin" || user.role === "moderator" ? (
                <button
                  className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gray-900 text-white rounded-lg transition-all duration-300 hover:bg-gray-800 hover:shadow-md transform hover:-translate-y-0.5"
                  onClick={() => router.push("/admin")}
                >
                  Админ панель
                </button>
              ) : null}

              <button
                className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gray-900 text-white rounded-lg transition-all duration-300 hover:bg-gray-800 hover:shadow-md transform hover:-translate-y-0.5"
                onClick={() => setIsEditModalOpen(true)}
              >
                Редактировать профиль
              </button>

              <button
                className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gray-700 text-white rounded-lg transition-all duration-300 hover:bg-gray-600 hover:shadow-md transform hover:-translate-y-0.5"
                onClick={handleLogout}
              >
                Выйти
              </button>
            </div>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold mt-8 sm:mt-12 mb-6 sm:mb-8 text-gray-900">Ваши заказы</h2>
        {orders.length === 0 ? (
          <p className="text-gray-600 text-base sm:text-lg">Заказов пока нет.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 montserrat mb-24 sm:mb-32">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 transition-all duration-300 hover:shadow-xl">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm font-medium text-gray-500">Заказ #{order.id}</span>
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-gray-100 text-gray-800">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700">{order.address}</p>
                  <div className="space-y-3 sm:space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="space-y-2 sm:space-y-3">
                        <div className="relative aspect-square overflow-hidden rounded-md sm:rounded-lg">
                          <Image 
                            src={item.imageUrl} 
                            alt={item.product.name} 
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm sm:text-base font-medium text-gray-900">{item.product.name}</p>
                          <div className="flex justify-between text-xs sm:text-sm text-gray-600">
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

        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentUser={{
            id: session?.user?.id || "",
            username: session?.user?.username || "",
            fullName: session?.user?.fullName || "",
          }}
          onUpdate={handleProfileUpdate}
        />
      </div>
    );
  }

  return null;
}
