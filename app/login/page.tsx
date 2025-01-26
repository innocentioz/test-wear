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
      router.push("/profile"); // Перенаправляем на страницу профиля
    } else {
      setMessage("Неверные логин или пароль.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="border p-2 mb-2 w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 w-full mt-2 rounded"
        >
          Login
        </button>
      </form>
      <div>
        Если у вас отсутствует аккаунт, вы можете его зарегистрировать{" "}
        <Link href="/register">
          <span className="text-blue-500">здесь.</span>
        </Link>
      </div>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
}
