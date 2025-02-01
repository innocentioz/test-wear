"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AdminPanel() {
  const [currentUserRole, setCurrentUserRole] = useState<string>("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    image: null as File | null,
    sizes: "",
  });
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== 'loading' && (!session || !['admin', 'moderator'].includes(session.user.role))) {
        router.push('/');
    }
  }, [session, status, router]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUserRole(parsedUser.role);
    }
  }, []);

  if (status === 'loading') return null;
  if (!session || !['admin', 'moderator'].includes(session.user.role)) return <p>У вас нет доступа к этой странице</p>;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.category || !formData.image) {
      setMessage({ type: "error", text: "Пожалуйста, заполните все поля." });
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("price", formData.price);
    formDataObj.append("category", formData.category);
    formDataObj.append("image", formData.image);
    
    if (formData.sizes) {
      formDataObj.append("sizes", formData.sizes); 
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        body: formDataObj,
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Продукт успешно добавлен." });
        setFormData({ name: "", price: "", category: "", image: null, sizes: "" });
      } else {
        setMessage({ type: "error", text: "Не удалось добавить продукт." });
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage({ type: "error", text: "Произошла ошибка." });
    }
  };

  if (!["admin", "moderator"].includes(currentUserRole)) {
    return <p className="text-center mt-10">У вас нет доступа к этой странице.</p>;
  }

  return (
    <div className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-black mb-8 text-center">
          Добавление продукта
        </h1>
        
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-neutral-200 montserrat">
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Название"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-black focus:ring-1 focus:ring-black transition duration-200 outline-none"
            />
            
            <input
              type="number"
              name="price"
              placeholder="Цена"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-black focus:ring-1 focus:ring-black transition duration-200 outline-none"
            />
            
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-black focus:ring-1 focus:ring-black transition duration-200 outline-none appearance-none bg-white"
            >
              <option value="">Выберите категорию</option>
              <option value="clothing">Одежда</option>
              <option value="accessories">Аксессуары</option>
              <option value="shoes">Обувь</option>
              <option value="collections">Коллекции</option>
            </select>
            
            <input
              type="text"
              name="sizes"
              placeholder="Размеры (через запятую, например: S,M,L)"
              value={formData.sizes}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-black focus:ring-1 focus:ring-black transition duration-200 outline-none"
            />
            
            <div className="relative">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-black focus:ring-1 focus:ring-black transition duration-200 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-black file:text-white hover:file:bg-neutral-800"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-black text-white text-lg font-medium rounded-lg hover:bg-neutral-800 transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-md hover:shadow-lg"
          >
            Добавить продукт
          </button>
        </form>
      </div>
    </div>
  );
}
