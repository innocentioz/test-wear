"use client";

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== 'loading' && (!session || !['admin', 'moderator'].includes(session.user.role))) {
        router.push('/');
    }
  }, [session, status, router]);

  if (status === 'loading') return null;
  if (!session || !['admin', 'moderator'].includes(session.user.role)) return <p>У вас нет доступа к этой странице</p>;

  return (
    <div className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8 mb-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-black mb-8 montserrat text-center">
          Админ Панель
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/users"
            className="group relative overflow-hidden rounded-lg bg-black p-6 transition-all duration-300 hover:bg-neutral-900"
          >
            <div className="flex flex-col space-y-2">
              <span className="text-white text-xl font-medium">Управление участниками</span>
              <span className="text-neutral-400 text-sm">Просмотр и управление пользователями</span>
            </div>
          </Link>
          
          <Link
            href="/admin/add-product"
            className="group relative overflow-hidden rounded-lg bg-white border-2 border-black p-6 transition-all duration-300 hover:bg-neutral-100"
          >
            <div className="flex flex-col space-y-2">
              <span className="text-black text-xl font-medium">Добавление товара</span>
              <span className="text-neutral-600 text-sm">Создание нового товара</span>
            </div>
          </Link>

          <Link
            href="/admin/edit-product"
            className="group relative overflow-hidden rounded-lg bg-black p-6 transition-all duration-300 hover:bg-neutral-900"
          >
            <div className="flex flex-col space-y-2">
              <span className="text-white text-xl font-medium">Редактирование товаров</span>
              <span className="text-neutral-400 text-sm">Изменение существующих товаров</span>
            </div>
          </Link>

          <Link
            href="/admin/orders"
            className="group relative overflow-hidden rounded-lg bg-white border-2 border-black p-6 transition-all duration-300 hover:bg-neutral-100"
          >
            <div className="flex flex-col space-y-2">
              <span className="text-black text-xl font-medium">Просмотр заказов</span>
              <span className="text-neutral-600 text-sm">Управление заказами</span>
            </div>
          </Link>

          <Link
            href="/profile"
            className="group relative overflow-hidden rounded-lg bg-neutral-100 p-6 transition-all duration-300 hover:bg-neutral-200"
          >
            <div className="flex flex-col space-y-2">
              <span className="text-black text-xl font-medium">Назад</span>
              <span className="text-neutral-600 text-sm">Вернуться в профиль</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
