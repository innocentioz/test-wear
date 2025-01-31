"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Button from "@/app/components/ui/button";
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
  const [selectedSize, setSelectedSize] = useState<string>("");
  const { data: session } = useSession();

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
  };

  const handleAddToWishlist = async () => {
    if (!session) {
      alert("Вы должны быть авторизованы, чтобы добавлять товары в избранное");
      return;
    }
  
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
  
    const data = await response.json();
    if (response.ok) {
      alert("Товар добавлен в избранное");
    } else {
      alert(data.error || "Произошла ошибка");
    }
  };

  return (
    <div>
      <div className="mb-4">
        <Link href="/" className="text-neutral-500 hover:text-neutral-900 transition duration-300">
          Главная
        </Link> 
        {" / "}
        <Link href={`/category/${product.category}`} className="text-neutral-500 hover:text-neutral-900 transition duration-300">
          {categoryNames[product.category] || "Категория"}
        </Link> 
        {" / "}
        <span className="text-neutral-900">{product.name}</span>
      </div>

      <div className="flex items-center gap-36">
        <Image
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-96 object-cover"
            width={1920}
            height={1080}
          />

          <div className="w-full flex flex-col gap-5">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            {product.sizes.length > 0 && (
              <SizeSelect
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSizeChange={handleSizeChange}
              />
            )}

            <p className="text-lg">Цена товара: {product.price} ₽</p>

            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                variant="outline" size="long"
              >
                Добавить в корзину
              </Button>
              <Button
                onClick={handleAddToWishlist}
                variant="default" size="long"
              >
                Добавить в избранное
              </Button>
            </div>
          </div>
      </div>

      <div>
      <Tabs defaultValue="delivery" className="w-[800px]">
        <TabsList>
          <TabsTrigger value="delivery">Способы доставки</TabsTrigger>
          <TabsTrigger value="rulesReturn">Правила возврата</TabsTrigger>
          <TabsTrigger value="payment">Способы оплаты</TabsTrigger>
        </TabsList>
        <TabsContent value="delivery" className="flex flex-col gap-3 montserrat mt-6">
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
        <TabsContent value="rulesReturn" className="flex flex-col gap-3 montserrat mt-6">
          <span>
            *Если вы считаете, что вам пришел товар с браком или товар ненадлежащего качества, свяжитесь с нами по почте SUPPORT@STEPANBATALOV.COM. Приложите к обращению фото и подробное описание вашей проблемы, наша команда свяжется с вами и мы обязательно решим этот вопрос в частном порядке  
          </span>
          <span>
            *Обмен товара производится исключительно через возврат и оформление нового заказа
          </span>
        </TabsContent>
        <TabsContent value="payment" className="flex flex-col gap-3 montserrat mt-6">
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
