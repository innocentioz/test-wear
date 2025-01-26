import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const sort = searchParams.get("sort");
  const search = searchParams.get("search") || ""; // Строка поиска
  const page = parseInt(searchParams.get("page") || '1', 8);
  const limit = parseInt(searchParams.get("limit") || '8', 8);

  if (!category || typeof category !== "string") {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  let orderBy = {};
  switch (sort) {
    case "nameAsc":
      orderBy = { name: "asc" };
      break;
    case "nameDesc":
      orderBy = { name: "desc" };
      break;
    case "priceAsc":
      orderBy = { price: "asc" };
      break;
    case "priceDesc":
      orderBy = { price: "desc" };
      break;
    default:
      orderBy = { name: "asc" };
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        category: category,
        name: {
          contains: search, // Фильтр по строке поиска
          mode: "insensitive", // Игнорировать регистр
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy,
    });

    const totalProducts = await prisma.product.count({
      where: {
        category: category,
        name: {
          contains: search, // Фильтр по строке поиска
          mode: "insensitive", // Игнорировать регистр
        },
      },
    });

    return NextResponse.json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
