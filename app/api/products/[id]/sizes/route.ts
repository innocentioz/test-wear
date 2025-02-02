import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const productId = parseInt(params.id, 10);

        // Получаем размеры для конкретного продукта
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: { sizes: true }, // Включаем размеры
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(product.sizes);
    } catch (error) {
        console.error('Error fetching sizes:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const productId = parseInt(params.id, 10);
        const { size } = await req.json(); // Получаем новый размер из тела запроса

        if (!size) {
            return NextResponse.json({ error: 'Size is required' }, { status: 400 });
        }

        // Добавляем новый размер для продукта
        const newSize = await prisma.size.create({
            data: {
                name: size,
                productId,
            },
        });

        return NextResponse.json(newSize, { status: 201 });
    } catch (error) {
        console.error('Error adding size:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
