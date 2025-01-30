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

  useEffect(() => {
    if (status !== 'loading' && (!session || !['admin', 'moderator'].includes(session.user.role))) {
        router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading') return null;
  if (!session || !['admin'].includes(session.user.role)) return <p>У вас нет доступа к этой странице</p>;

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
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Админ-панель</h1>
      {message && (
        <p
          className={`mb-4 text-sm ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Имя</th>
            <th className="border p-2">Имя пользователя</th>
            <th className="border p-2">Роль</th>
            <th className="border p-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.id}</td>
              <td className="border p-2">{user.fullName}</td>
              <td className="border p-2">@{user.username}</td>
              <td className="border p-2">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="border p-1"
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
