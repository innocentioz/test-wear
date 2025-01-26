"use client";

import { useEffect, useState } from "react";

export default function AdminPanel() {
  const [currentUserRole, setCurrentUserRole] = useState<string>("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    image: null as File | null,
    sizes: "", // Добавляем поле для размеров
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUserRole(parsedUser.role);
    }
  }, []);

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
    
    // Добавляем размеры, только если они указаны
    if (formData.sizes) {
      formDataObj.append("sizes", formData.sizes); // Добавляем размеры
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
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Добавление продукта</h1>
      {message && (
        <p
          className={`mb-4 text-sm ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Название"
          value={formData.name}
          onChange={handleInputChange}
          className="border p-2 w-full"
        />
        <input
          type="number"
          name="price"
          placeholder="Цена"
          value={formData.price}
          onChange={handleInputChange}
          className="border p-2 w-full"
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="border p-2 w-full"
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
          className="border p-2 w-full"
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Добавить продукт
        </button>
      </form>
    </div>
  );
}
