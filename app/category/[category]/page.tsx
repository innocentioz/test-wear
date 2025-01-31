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
    <div className="container mt-12 mb-16">
      <h1 className="text-2xl font-bold mb-4">
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

      <div className='flex flex-col gap-3 items-start'>
        <div className='flex items-center justify-between gap-2 w-full'> 
            <div>
              <Link href={`/`} className=' text-neutral-500 hover:text-neutral-900 transform duration-300 ease-in-out'>Главная / </Link><Link href={`/category/${category}`} className=' text-neutral-500 hover:text-neutral-900 transform duration-300 ease-in-out'>
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
              placeholder="Введите название товара, например: nike sb dunk"
              className="p-2 px-5 border rounded-full opacity-40 text-black border-neutral-800 focus:outline-none focus:opacity-80 placeholder:text-neutral-700 w-1/3"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1); 
              }}
            />
        </div>

        <div className="mb-4">
          <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
        </div>
      </div>

      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 justify-items-center montserrat text-sm font-medium">
        {products.map((product) => (
          <Link href={`/product/${product.id}`} key={product.id} className="w-4/6 flex flex-col gap-2 hover:-translate-y-2 hover:transform duration-300">
            <Image
              src={product.imageUrl}
              alt={product.name}
              className="object-cover"
              width={1920}
              height={1080}
            />
            <h2>{product.name}</h2>
            <p>{product.price} ₽</p>
            <span>Доступен для заказа</span>
          </Link>
        ))}
      </div>

      <div className="flex justify-center items-center mt-10 mb-10 space-x-2 gap-20">
        {/* Кнопка "Previous" */}
        <button
          className={`cursor-pointer ${page <= 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
        >
        <ChevronLeft width={40} height={40}/>
        </button>

        {/* Номера страниц */}
        
        <div className='flex gap-10 text-2xl'>
          {getPageNumbers().map((pageNumber) => (
            <button
              key={pageNumber}
              className={`${
                pageNumber === page
                  ? 'text-neutral-800'
                  : 'text-neutral-400'
              }`}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
        </div>

        {/* Кнопка "Next" */}
        <button
          className={`cursor-pointer ${page >= totalPages ? 'opacity-30 cursor-not-allowed' : ''}`}
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
        >
        <ChevronRight width={40} height={40}/>
        </button>
      </div>
    </div>
  );
};

export default CategoryPage;
