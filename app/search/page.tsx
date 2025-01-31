'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
  id: string;
  imageUrl: string;
  name: string;
  category: string;
  price: number; 
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]); 
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/search?searchTerm=${searchTerm}&page=${page}&limit=10`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [searchTerm, page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

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
    <div className="container p-4 relative">
      <div className='flex flex-col items-center'>
        <h1 className="text-2xl font-bold mb-4">Поиск</h1>

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

      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 montserrat text-sm font-medium">
        {products.map((product) => (
          <Link href={`/product/${product.id}`} key={product.id} className="p-4 w-4/6 flex flex-col gap-2 hover:-translate-y-2 hover:transform duration-300">
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


      <div className="flex justify-center items-center mt-10 mb-10 space-x-2 gap-20 absolute bottom-0 left-1/2 transform -translate-x-1/2">
        <button
          className={`cursor-pointer ${page <= 1 ? 'opacity-30 cursor-not-allowed hidden' : ''}`}
          onClick={() => handlePageChange(page - 1)}
          disabled={page <= 1}
        >
        <ChevronLeft width={40} height={40}/>
        </button>

        <div className='flex gap-10 text-2xl'>
          {getPageNumbers().map((pageNumber) => (
            <button
              key={pageNumber}
              className={`${
                pageNumber === page
                  ? 'text-neutral-800'
                  : 'text-neutral-400'
              }`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
        </div>

        <button
          className={`cursor-pointer ${page >= totalPages ? 'opacity-30 cursor-not-allowed hidden' : ''}`}
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
        >
        <ChevronRight width={40} height={40}/>
        </button>
      </div>
    </div>
  );
}
