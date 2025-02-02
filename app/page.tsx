"use client";

import BrandSlider from "./components/ui/BrandSlider";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen montserrat mt-12 overflow-x-hidden">
      <section className="relative h-[80vh] w-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        >
          <source src="/video/video2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Добро пожаловать в Limitless Wear
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-8">
              Откройте для себя мир стильной одежды
            </p>
            <Link
              href="/search"
              className="bg-white text-black px-8 py-3 rounded-full text-lg hover:bg-opacity-90 transition-all"
            >
              Смотреть каталог
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 w-full">
        <h2 className="text-2xl sm:text-3xl text-center mb-8">Наши бренды</h2>
        <BrandSlider />
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl sm:text-3xl text-center mb-8">Категории</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative h-64 overflow-hidden rounded-lg"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105 blur-[1.5px]"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <h3 className="text-white text-xl">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-neutral-50 py-12 w-full">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl mb-2">Быстрая доставка</h3>
              <p className="text-gray-600">Доставляем по всей России</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl  mb-2">Гарантия качества</h3>
              <p className="text-gray-600">Только оригинальные товары</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl mb-2">Простой возврат</h3>
              <p className="text-gray-600">30 дней на возврат товара</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const categories = [
  {
    id: 1,
    name: "Обувь",
    slug: "shoes",
    image: "/images/shoes.jpg", 
  },

  {
    id: 2,
    name: "Одежда",
    slug: "clothing",
    image: "/images/clothes.jpg",
  },
  {
    id: 3,
    name: "Аксессуары",
    slug: "accessories",
    image: "/images/accessories.jpg",
  },
  {
    id: 4,
    name: "Коллекции",
    slug: "collections",
    image: "/images/collections.jpg",
  },
];