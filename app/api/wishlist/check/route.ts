import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const productId = searchParams.get("productId");

  if (!userId || !productId) {
    return NextResponse.json({ error: "User ID and Product ID are required" }, { status: 400 });
  }

  try {
    const wishlistItem = await prisma.wishlist.findFirst({
      where: {
        userId: parseInt(userId),
        productId: parseInt(productId),
      },
    });

    return NextResponse.json({ isInWishlist: !!wishlistItem });
  } catch (error) {
    console.error("Error checking wishlist:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
} 