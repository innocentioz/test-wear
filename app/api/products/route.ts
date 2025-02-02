import { NextResponse } from "next/server";
import path from "path";
import { prisma } from "@/lib/prisma";
import fs from "fs";

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const price = parseInt(formData.get("price") as string);
    const category = formData.get("category") as string;
    const image = formData.get("image") as File;
    const sizesString = formData.get("sizes") as string;

    if (!name || !price || !category || !image) {
      return NextResponse.json({ error: "Все поля обязательны." }, { status: 400 });
    }

    let sizes: string[] = [];
    if (sizesString) {
      sizes = sizesString.split(",").map((size: string) => size.trim());
    }
    
    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const imagePath = `/uploads/products/${Date.now()}-${image.name}`;
    const buffer = Buffer.from(await image.arrayBuffer());

    await new Promise((resolve, reject) => {
      const filePath = path.join(process.cwd(), "public", imagePath);
      fs.writeFile(filePath, buffer, (err) => (err ? reject(err) : resolve(null)));
    });

    const productData = {
      name,
      price,
      category,
      imageUrl: imagePath,
      sizes: sizes.length > 0 ? {
        create: sizes.map((size: string) => ({ name: size })),
      } : undefined,
    };

    const product = await prisma.product.create({
      data: productData,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ error: "Произошла ошибка." }, { status: 500 });
  }
};

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Не удалось получить продукты" }, { status: 500 });
  }
}
