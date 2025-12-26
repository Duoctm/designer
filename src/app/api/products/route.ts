import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, productVariants } from "@/db/schema/products";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allProducts = await db
      .select({
        id: products.id,
        handle: products.handle,
        title: products.title,
        description: products.description,
        productType: products.productType,
        thumbnail: products.thumbnail,
        status: products.status,
      })
      .from(products)
      .where(eq(products.status, "active"));

    // Get default variant for each product (for price display)
    const productsWithPrice = await Promise.all(
      allProducts.map(async (product) => {
        const defaultVariant = await db
          .select({
            price: productVariants.price,
            compareAtPrice: productVariants.compareAtPrice,
          })
          .from(productVariants)
          .where(eq(productVariants.productId, product.id))
          .limit(1);

        return {
          ...product,
          price: defaultVariant[0]?.price ?? null,
          compareAtPrice: defaultVariant[0]?.compareAtPrice ?? null,
        };
      })
    );

    return NextResponse.json(productsWithPrice);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
