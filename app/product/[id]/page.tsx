import { prisma } from "@/lib/prisma";
import ProductDetails from "./ProductDetails";

const ProductPage = async ({ params }: { params: { id: string } }) => {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(params.id) },
    include: { sizes: true }, // Добавляем загрузку размеров продукта
  });

  if (!product) {
    return <div>Товар не найден</div>;
  }

  return <ProductDetails product={product} />;
};

export default ProductPage;
