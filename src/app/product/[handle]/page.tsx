import { notFound } from "next/navigation";
import ProductDetailClient from "./page-client";
import { db } from "@/db";
import {
  products,
  productOptions,
  productVariants,
  productTemplates,
} from "@/db/schema/products";
import { templates, templateFields, fieldOptions } from "@/db/schema/templates";
import { eq, asc } from "drizzle-orm";

interface PageProps {
  params: Promise<{ handle: string }>;
}

async function getProductByHandle(handle: string) {
  // Get product
  const product = await db
    .select()
    .from(products)
    .where(eq(products.handle, handle))
    .limit(1);

  if (product.length === 0) {
    return null;
  }

  const productData = product[0];

  // Get options
  const options = await db
    .select()
    .from(productOptions)
    .where(eq(productOptions.productId, productData.id))
    .orderBy(asc(productOptions.position));

  // Get variants
  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, productData.id));

  // Get templates associated with this product
  const productTemplateLinks = await db
    .select({
      templateId: productTemplates.templateId,
      isDefault: productTemplates.isDefault,
    })
    .from(productTemplates)
    .where(eq(productTemplates.productId, productData.id))
    .orderBy(asc(productTemplates.position));

  // Get full template data with fields and options
  const templatesData = await Promise.all(
    productTemplateLinks.map(async (link) => {
      const templateData = await db
        .select()
        .from(templates)
        .where(eq(templates.id, link.templateId))
        .limit(1);

      if (templateData.length === 0) return null;

      // Get fields for this template
      const fields = await db
        .select()
        .from(templateFields)
        .where(eq(templateFields.templateId, link.templateId))
        .orderBy(asc(templateFields.position));

      // Get options for each field
      const fieldsWithOptions = await Promise.all(
        fields.map(async (field) => {
          const options = await db
            .select()
            .from(fieldOptions)
            .where(eq(fieldOptions.fieldId, field.id))
            .orderBy(asc(fieldOptions.position));

          return { ...field, options };
        })
      );

      return {
        ...templateData[0],
        isDefault: link.isDefault,
        fields: fieldsWithOptions,
      };
    })
  );

  return {
    ...productData,
    options,
    variants,
    templates: templatesData.filter(Boolean),
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ProductDetailClient product={product as any} />;
}

export async function generateStaticParams() {
  const allProducts = await db
    .select({ handle: products.handle })
    .from(products)
    .where(eq(products.status, "active"));

  return allProducts.map((p) => ({ handle: p.handle }));
}
