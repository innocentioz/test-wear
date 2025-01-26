"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

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
        <p className="text-gray-600">Статус: {user.role}</p>

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
    </div>
  );
}
