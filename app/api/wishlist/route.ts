import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { productId, userId } = await req.json();

    if (!productId || !userId) {
      return NextResponse.json({ error: "Product ID and User ID are required" }, { status: 400 });
    }

    const existingWishlistItem = await prisma.wishlist.findFirst({
      where: {
        productId,
        userId: parseInt(userId), // Убедитесь, что типы совпадают
      },
    });

    if (existingWishlistItem) {
      return NextResponse.json({ message: "Product already in wishlist" });
    }

    await prisma.wishlist.create({
      data: {
        productId,
        userId: parseInt(userId), // Убедитесь, что типы совпадают
      },
    });

    return NextResponse.json({ message: "Product added to wishlist" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    try {
        const wishlist = await prisma.wishlist.findMany({
        where: { userId: parseInt(userId) },
        include: { product: true },
        });

        return NextResponse.json(wishlist);
    } catch (error) {
        console.error("Ошибка получения избранного:", error);
        return NextResponse.json({ error: "Произошла ошибка при получении избранного" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
  try {
    const { productId, userId } = await req.json();

    if (!productId || !userId) {
      return NextResponse.json({ error: "Product ID and User ID are required" }, { status: 400 });
    }

    await prisma.wishlist.deleteMany({
      where: {
        productId,
        userId: parseInt(userId), // Убедитесь, что типы совпадают
      },
    });

    return NextResponse.json({ message: "Product removed from wishlist" });
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}

