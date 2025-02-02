import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const { name, price } = await request.json();

    try {
        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: { name, price },
        });
        return NextResponse.json(updatedProduct);
    } catch {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        // Шаг 1: Получаем продукт из базы данных, чтобы получить путь к картинке
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            select: { imageUrl: true },
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Шаг 2: Генерируем абсолютный путь к картинке
        const imagePath = path.join(process.cwd(), 'public', product.imageUrl);

        // Шаг 3: Проверяем, существует ли картинка и удаляем ее
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); // Удаляем картинку
        } else {
            console.error('Image not found at path:', imagePath);
        }

        // Шаг 4: Используем транзакцию для удаления размеров и продукта
        await prisma.$transaction([
            prisma.size.deleteMany({
                where: { productId: parseInt(id) }, // Удаляем все размеры, связанные с продуктом
            }),
            prisma.product.delete({
                where: { id: parseInt(id) }, // Удаляем сам продукт
            }),
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}