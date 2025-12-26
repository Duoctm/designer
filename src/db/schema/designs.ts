import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { products, productVariants } from "./products";
import { templates } from "./templates";

// Saved Designs - Simplified values storage
export const savedDesigns = pgTable("saved_designs", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .references(() => products.id)
    .notNull(),
  variantId: text("variant_id")
    .references(() => productVariants.id)
    .notNull(),
  templateId: text("template_id")
    .references(() => templates.id)
    .notNull(),

  // User's customization values - simple key-value
  // { "animal": "opt_rooster_3", "name": "John", "quantity": 2 }
  values: jsonb("values")
    .notNull()
    .$type<Record<string, string | number | string[]>>(),

  // Preview images
  previewThumbnail: text("preview_thumbnail"),
  previewFullSize: text("preview_full_size"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const savedDesignsRelations = relations(savedDesigns, ({ one }) => ({
  product: one(products, {
    fields: [savedDesigns.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [savedDesigns.variantId],
    references: [productVariants.id],
  }),
  template: one(templates, {
    fields: [savedDesigns.templateId],
    references: [templates.id],
  }),
}));
