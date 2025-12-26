import { Header } from "@/components/layout/header";
import { ProductCard } from "@/components/products/product-card";
import { db } from "@/db";
import { products, productVariants } from "@/db/schema/products";
import { eq } from "drizzle-orm";

interface ProductListItem {
  id: string;
  handle: string;
  title: string;
  thumbnail: string | null;
  productType: string;
}

async function getProducts(): Promise<ProductListItem[]> {
  const allProducts = await db
    .select({
      id: products.id,
      handle: products.handle,
      title: products.title,
      thumbnail: products.thumbnail,
      productType: products.productType,
      status: products.status,
    })
    .from(products)
    .where(eq(products.status, "active"));

  return allProducts;
}

export default async function HomePage() {
  const productList = await getProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productList.map((product) => (
            <ProductCard
              key={product.id}
              handle={product.handle}
              title={product.title}
              thumbnail={product.thumbnail}
              productType={product.productType}
            />
          ))}
        </div>

        {/* Empty state if no products */}
        {productList.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No products available yet.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            © 2025 Demo Designer. Built with Next.js + Drizzle ORM.
          </div>
        </div>
      </footer>
    </div>
  );
}
