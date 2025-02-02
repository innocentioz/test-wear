"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { useSession } from "next-auth/react";
import Image from "next/image";
import SizeSelect from "@/app/components/ui/SizeSelect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import Link from "next/link";

type Size = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  sizes: Size[];
  category: string;
};

const categoryNames: Record<string, string> = {
  shoes: "Обувь",
  clothing: "Одежда",
  accessories: "Аксессуары",
  collections: "Коллекции",
};

const ProductDetails = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes.length > 0 ? product.sizes[0].name : ""
  );
  const { data: session } = useSession();
  const [showNotification, setShowNotification] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showWishlistNotification, setShowWishlistNotification] = useState(false);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  useEffect(() => {
    if (showWishlistNotification) {
      const timer = setTimeout(() => {
        setShowWishlistNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showWishlistNotification]);

  useEffect(() => {
    const checkWishlist = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch(`/api/wishlist/check?userId=${session.user.id}&productId=${product.id}`);
          if (!response.ok) {
            throw new Error('Failed to check wishlist status');
          }
          const data = await response.json();
          setIsInWishlist(data.isInWishlist);
        } catch (error) {
          console.error("Error checking wishlist:", error);
        }
      }
    };

    checkWishlist();
  }, [session, product.id]);

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize || "",
      quantity: 1,
      imageUrl: product.imageUrl,
    });
    setShowNotification(true);
  };

  const handleAddToWishlist = async () => {
    if (!session) {
      alert("Вы должны быть авторизованы, чтобы добавлять товары в избранное");
      return;
    }

    if (isInWishlist) {
      return;
    }

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product.id,
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Неизвестная ошибка" }));
        throw new Error(errorData.error || "Произошла ошибка при добавлении в избранное");
      }

      setIsInWishlist(true);
      setShowWishlistNotification(true);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      alert(error instanceof Error ? error.message : "Произошла ошибка при добавлении в избранное");
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-24">
      {showNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black text-white px-4 py-2 rounded-lg shadow-lg text-sm sm:text-base animate-fade-in-down max-w-[90%] sm:max-w-md">
          <div className="flex items-center justify-center">
            <span>Товар добавлен в корзину</span>
          </div>
        </div>
      )}

      {showWishlistNotification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black text-white px-4 py-2 rounded-lg shadow-lg text-sm sm:text-base animate-fade-in-down max-w-[90%] sm:max-w-md">
          <div className="flex items-center justify-center">
            <span>Товар добавлен в избранное</span>
          </div>
        </div>
      )}

      <div className="mb-4 text-sm sm:text-base montserrat">
        <Link href="/" className="text-neutral-500 hover:text-neutral-900 transition duration-300">
          Главная
        </Link> 
        <span className="text-neutral-500">{" / "}</span>
        <Link href={`/category/${product.category}`} className="text-neutral-500 hover:text-neutral-900 transition duration-300">
          {categoryNames[product.category] || "Категория"}
        </Link> 
        <span className="text-neutral-500">{" / "}</span>
        <span className="text-neutral-900">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-36">
        <div className="w-full lg:w-1/2">
          <Image
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-[300px] sm:h-[400px] lg:h-96 object-cover"
            width={1920}
            height={1080}
          />
        </div>

        <div className="w-full lg:w-1/2 flex flex-col gap-5">
          <h1 className="text-xl sm:text-2xl font-bold">{product.name}</h1>
          <div className="relative z-10">
            {product.sizes.length > 0 && (
              <SizeSelect
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSizeChange={handleSizeChange}
              />
            )}
          </div>

          <p className="text-base sm:text-lg">Цена товара: {product.price} ₽</p>

          <div className="flex flex-col sm:flex-row gap-3 montserrat relative z-1">
            <button
              onClick={handleAddToCart}
              className="w-full sm:w-auto px-6 py-3 bg-black text-white hover:bg-neutral-800 transition-all duration-300 ease-in-out transform hover:scale-[1.02] rounded-full shadow-md hover:shadow-lg"
            >
              Добавить в корзину
            </button>
            <button
              onClick={handleAddToWishlist} 
              disabled={isInWishlist}
              className={`w-full sm:w-auto px-6 py-3 border border-black transition-all duration-300 ease-in-out transform hover:scale-[1.02] rounded-full ${
                isInWishlist 
                  ? "bg-neutral-100 text-neutral-500 border-neutral-300 cursor-not-allowed"
                  : "text-black hover:bg-black hover:text-white"
              }`}
            >
              {isInWishlist ? "В избранном" : "Добавить в избранное"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <Tabs defaultValue="delivery" className="w-full max-w-[800px] mx-auto">
          <TabsList className="w-full flex flex-col sm:flex-row">
            <TabsTrigger value="delivery" className="flex-1">Способы доставки</TabsTrigger>
            <TabsTrigger value="rulesReturn" className="flex-1">Правила возврата</TabsTrigger>
            <TabsTrigger value="payment" className="flex-1">Способы оплаты</TabsTrigger>
          </TabsList>
          <TabsContent value="delivery" className="flex flex-col gap-3 montserrat mt-6 text-sm sm:text-base">
            <span>
              Мы работаем над тем, чтобы наши клиенты были самыми счастливыми, поэтому стараемся доставлять заказы максимально быстро и комфортно для Вас. 
            </span>
            <span>
              Сейчас доступны следующие варианты доставки:
            </span>
            <span className="text-neutral-500">
              - доставка домой или в офис курьерской службой. 
            </span>
            <span>
              Доставка осуществляется для всех заказов
            </span>
            <span className="text-neutral-500">
              - Доставка курьерской службой производится в рамках сроков обозначенных после оформления заказа. Доставка осуществляется по России и СНГ
            </span>
            <span className="text-neutral-500">
              - Доставка в любой регион России и стран СНГ осуществляется курьерской службой. Срок доставки: от 3х рабочих дней. 
            </span>
          </TabsContent>
          <TabsContent value="rulesReturn" className="flex flex-col gap-3 montserrat mt-6 text-sm sm:text-base">
            <span>
              *Если вы считаете, что вам пришел товар с браком или товар ненадлежащего качества, свяжитесь с нами по почте SUPPORT@STEPANBATALOV.COM. Приложите к обращению фото и подробное описание вашей проблемы, наша команда свяжется с вами и мы обязательно решим этот вопрос в частном порядке  
            </span>
            <span>
              *Обмен товара производится исключительно через возврат и оформление нового заказа
            </span>
          </TabsContent>
          <TabsContent value="payment" className="flex flex-col gap-3 montserrat mt-6 text-sm sm:text-base">
            <span>
              Мы принимаем оплату также банковскими картами:
            </span>
            <span className="text-neutral-500">
              Visa, Mastercard, МИР, СБП и др.
            </span>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetails;
