import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchTerm, page = '1', limit = '6' } = Object.fromEntries(new URL(req.url).searchParams);

  // Преобразуем `page` и `limit` в числа
  const pageNumber = parseInt(page, 6) || 1;
  const limitNumber = parseInt(limit, 6) || 6;

  // Вычисляем сдвиг (offset)
  const skip = (pageNumber - 1) * limitNumber;

  // Выполняем поиск продуктов с пагинацией
  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: searchTerm || '', // Если `searchTerm` пустой, вернёт все записи
        mode: 'insensitive',
      },
    },
    skip,
    take: limitNumber, // Ограничиваем количество возвращаемых записей
  });

  // Считаем общее количество продуктов для построения навигации
  const totalProducts = await prisma.product.count({
    where: {
      name: {
        contains: searchTerm || '',
        mode: 'insensitive',
      },
    },
  });

  return NextResponse.json({
    products,
    totalProducts,
    totalPages: Math.ceil(totalProducts / limitNumber),
    currentPage: pageNumber,
  });
}
