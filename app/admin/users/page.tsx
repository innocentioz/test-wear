"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface User {
  id: number;
  fullName: string;
  username: string;
  role: string;
  createdAt: string;
}

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setMessage({ type: "error", text: "Не удалось загрузить пользователей." });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage({ type: "error", text: "Произошла ошибка при загрузке." });
    }
  };

  useEffect(() => {
    if (status !== 'loading' && (!session || !['admin', 'moderator'].includes(session.user.role))) {
        router.push('/');
    }
    if (session?.user?.role === 'admin') {
      fetchUsers();
    }
  }, [session, status, router]);

  if (status === 'loading') return null;
  if (!session || !['admin'].includes(session.user.role)) return <p>У вас нет доступа к этой странице</p>;

  const handleRoleChange = async (id: number, role: string) => {
    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Роль пользователя обновлена." });
        fetchUsers();
      } else {
        setMessage({ type: "error", text: "Не удалось обновить роль." });
      }
    } catch (error) {
      console.error("Error updating role:", error);
      setMessage({ type: "error", text: "Произошла ошибка." });
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Пользователь удалён." });
        fetchUsers();
      } else {
        setMessage({ type: "error", text: "Не удалось удалить пользователя." });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage({ type: "error", text: "Произошла ошибка." });
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-8 lg:px-12">
      <div className="max-w-8xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-10">Управление пользователями</h1>
          
          {message && (
            <div className={`mb-8 p-5 rounded-lg ${
              message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            }`}>
              {message.text}
            </div>
          )}

          {users.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {users.map((user) => (
                <div key={user.id} className="bg-gray-50 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{user.fullName}</h3>
                      <p className="text-base text-gray-500">@{user.username}</p>
                    </div>
                    <span className="text-base text-gray-500">ID: {user.id}</span>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-base font-medium text-gray-700 mb-2">Роль</label>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-base py-3"
                      >
                        <option value="user">Пользователь</option>
                        <option value="moderator">Модератор</option>
                        <option value="admin">Администратор</option>
                      </select>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="w-full inline-flex justify-center items-center px-6 py-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-xl">Пользователи не найдены</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
