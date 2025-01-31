"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      username: formData.username,
      password: formData.password,
    });

    if (res?.ok) {
      router.push("/profile");
    } else {
      setMessage("Неверные логин или пароль.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full sm:w-[400px] md:w-[500px] bg-white p-10 rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl">
        <div>
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-8 transition-all duration-300 hover:text-gray-700">
            Вход в систему
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Введите логин"
              value={formData.username}
              onChange={handleChange}
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Введите пароль"
              value={formData.password}
              onChange={handleChange}
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
              required
            />
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            Войти
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600">
          <p className="transition-all duration-300 hover:text-gray-900">
            Нет аккаунта?{" "}
            <Link 
              href="/register" 
              className="font-medium text-gray-900 hover:text-gray-700 transition-all duration-300 border-b border-gray-900 hover:border-gray-700"
            >
              Зарегистрируйтесь
            </Link>
          </p>
        </div>

        {message && (
          <div className="mt-6 text-center">
            <p className="text-red-500 text-lg animate-fade-in transition-all duration-300">
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
