import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  products,
  productOptions,
  productVariants,
  productTemplates,
} from "@/db/schema/products";
import { templates, templateFields, fieldOptions } from "@/db/schema/templates";
import { eq, asc } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params;

    // Get product
    const product = await db
      .select()
      .from(products)
      .where(eq(products.handle, handle))
      .limit(1);

    if (product.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
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
    const templatesWithFields = await Promise.all(
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

    return NextResponse.json({
      ...productData,
      options,
      variants,
      templates: templatesWithFields.filter(Boolean),
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
