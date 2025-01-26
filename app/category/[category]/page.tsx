'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
};

const CategoryPage = () => {
  const params = useParams(); // Используем хук useParams для получения параметров
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('nameAsc');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Получаем категорию как строку
  const category = Array.isArray(params.category)
    ? params.category[0]
    : params.category;

  // Запрос данных при изменении категории, сортировки, строки поиска или страницы
  useEffect(() => {
    if (!category) return;

    const fetchProducts = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/category?category=${category}&sort=${sortOption}&search=${searchTerm}&page=${page}&limit=10`
        );
        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Ошибка загрузки продуктов:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, sortOption, searchTerm, page]);

  // Генерация массива страниц для отображения (5 страниц вокруг текущей)
  const getPageNumbers = () => {
    const pageNumbers = [];
    const start = Math.max(1, page - 2); // Начало диапазона (минимум 1)
    const end = Math.min(totalPages, page + 2); // Конец диапазона (максимум totalPages)

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-4">{category?.toUpperCase()}</h1>

      {/* Поиск */}
      <input
        type="text"
        placeholder="Type to search..."
        className="border p-2 w-full mb-4"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPage(1); // Сбрасываем на первую страницу при новом поиске
        }}
      />

      {/* Сортировка */}
      <div className="mb-4">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border p-2"
        >
          <option value="nameAsc">Имя (по возрастанию)</option>
          <option value="nameDesc">Имя (по убыванию)</option>
          <option value="priceAsc">Цена (по возрастанию)</option>
          <option value="priceDesc">Цена (по убыванию)</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}

      {/* Список продуктов */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="p-4 border rounded">
            <Image
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-64 object-cover"
              width={1920}
              height={1080}
            />
            <h2>{product.name}</h2>
            <p>{product.price} ₽</p>
            <a href={`/product/${product.id}`} className="text-blue-500">
              Подробнее
            </a>
          </div>
        ))}
      </div>

      {/* Навигация по страницам */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        {/* Кнопка "Previous" */}
        <button
          className="bg-gray-200 px-4 py-2 rounded disabled:bg-gray-100"
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </button>

        {/* Номера страниц */}
        {getPageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            className={`px-4 py-2 rounded ${
              pageNumber === page
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-black'
            }`}
            onClick={() => setPage(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}

        {/* Кнопка "Next" */}
        <button
          className="bg-gray-200 px-4 py-2 rounded disabled:bg-gray-100"
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CategoryPage;
