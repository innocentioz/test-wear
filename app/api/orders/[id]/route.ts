import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; 

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const { status } = await req.json();
        const orderId = parseInt(params.id, 10);

        if (!status || isNaN(orderId)) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        // Обновляем статус заказа в БД
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status },
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("Ошибка при обновлении заказа:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: {
                        product: true, 
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Ошибка при получении заказов:", error);
        return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
    }
}
