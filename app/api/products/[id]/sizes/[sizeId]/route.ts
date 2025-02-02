import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: { id: string; sizeId: string } }) {
    const productId = parseInt(params.id, 10);
    const sizeId = parseInt(params.sizeId, 10);

    if (isNaN(productId) || isNaN(sizeId)) {
        return NextResponse.json({ error: "Invalid product or size ID" }, { status: 400 });
    }

    try {
        // Удаляем размер
        const deletedSize = await prisma.size.delete({
            where: {
                id: sizeId,
            },
        });

        return NextResponse.json(deletedSize, { status: 200 });
    } catch (error) {
        console.error("Error deleting size:", error);
        return NextResponse.json({ error: "Failed to delete size" }, { status: 500 });
    }
}
