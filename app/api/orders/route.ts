/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();


export async function POST(request: Request) {
  try {
    const { cartItems, totalPrice, customerInfo, status, userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        userId: parseInt(userId), 
        customerName: customerInfo.fullName,
        phone: customerInfo.phone,
        address: customerInfo.address,
        paymentMethod: customerInfo.paymentMethod,
        totalPrice,
        status,
        items: {
          create: cartItems.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            size: item.size,
            price: item.price,
            imageUrl: item.imageUrl,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ success: false, error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId: Number(session.user.id) },
      include: {
        items: { include: { product: true } }, 
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Ошибка при получении заказов:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}