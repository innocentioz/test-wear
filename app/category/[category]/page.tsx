'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import SortDropdown from '@/app/components/ui/SortDropdown';

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
};

const CategoryPage = () => {
  const params = useParams(); 
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('nameAsc');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const category = Array.isArray(params.category)
    ? params.category[0]
    : params.category;

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

  const getPageNumbers = () => {
    const pageNumbers = [];
    const start = Math.max(1, page - 2); 
    const end = Math.min(totalPages, page + 2); 

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 lg:mt-12 mb-24 sm:mb-32">
      <h1 className="text-2xl sm:text-2xl font-bold mb-4">
        {(() => {
          switch (category) {
            case "shoes":
              return "Обувь";
            case "clothing":
              return "Одежда";
            case "accessories":
              return "Аксессуары";
            case "collections":
              return "Коллекции";
            default:
              return "Категория не найдена";
          }
        })()}
      </h1>

      <div className='flex flex-col gap-3 items-start w-full'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full'> 
            <div className='text-base sm:text-base'>
              <Link href={`/`} className='text-neutral-500 hover:text-neutral-900 transform duration-300 ease-in-out'>Главная / </Link>
              <Link href={`/category/${category}`} className='text-neutral-500 hover:text-neutral-900 transform duration-300 ease-in-out'>
                {(() => {
                  switch (category) {
                    case "shoes":
                      return "Обувь";
                    case "clothing":
                      return "Одежда";
                    case "accessories":
                      return "Аксессуары";
                    case "collections":
                      return "Коллекции";
                    default:
                      return "Категория не найдена";
                  }
                })()}
              </Link>
            </div>

            <input
              type="text"
              placeholder="Поиск товара..."
              className="p-2 px-4 sm:px-5 border rounded-full opacity-40 text-black border-neutral-800 focus:outline-none focus:opacity-80 placeholder:text-neutral-700 w-full sm:w-1/2 lg:w-1/3 text-base"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1); 
              }}
            />
        </div>

        <div className="mb-4 w-full sm:w-auto">
          <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
        </div>
      </div>

      {loading && <p className="text-center">Loading...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 justify-items-center montserrat text-sm sm:text-sm font-medium">
        {products.map((product) => (
          <Link href={`/product/${product.id}`} key={product.id} className="w-[85%] sm:w-5/6 flex flex-col gap-2 hover:-translate-y-2 hover:transform duration-300">
            <div className="relative aspect-square w-full">
              <Image
                src={product.imageUrl}
                alt={product.name}
                className="object-cover"
                fill
              />
            </div>
            <h2 className="line-clamp-2 text-base">{product.name}</h2>
            <p className="text-base">{product.price} ₽</p>
            <span className="text-green-600 text-base">Доступен для заказа</span>
          </Link>
        ))}
      </div>

      <div className="flex justify-center items-center mt-8 sm:mt-12 space-x-2 gap-4 sm:gap-20">
        <button
          className={`cursor-pointer ${page <= 1 ? 'opacity-30 cursor-not-allowed hidden' : ''}`}
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft width={45} height={45} className="sm:w-10 sm:h-10"/>
        </button>

        <div className='flex gap-6 sm:gap-10 text-2xl sm:text-2xl'>
          {getPageNumbers().map((pageNumber) => (
            <button
              key={pageNumber}
              className={`${
                pageNumber === page
                  ? 'text-neutral-800'
                  : 'text-neutral-400'
              } p-2`}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
        </div>

        <button
          className={`cursor-pointer ${page >= totalPages ? 'opacity-30 cursor-not-allowed hidden' : ''}`}
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
        >
          <ChevronRight width={45} height={45} className="sm:w-10 sm:h-10"/>
        </button>
      </div>
    </div>
  );
};

export default CategoryPage;
