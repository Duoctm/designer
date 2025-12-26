import {
  pgTable,
  text,
  integer,
  decimal,
  jsonb,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { templates } from "./templates";

// Products
export const products = pgTable("products", {
  id: text("id").primaryKey(),
  handle: text("handle").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  productType: text("product_type").notNull(),
  vendor: text("vendor"),
  tags: text("tags").array(),
  status: text("status").default("active"),
  thumbnail: text("thumbnail"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Product Options (Size, Color, etc.)
export const productOptions = pgTable("product_options", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .references(() => products.id)
    .notNull(),
  name: text("name").notNull(),
  position: integer("position").default(1),
  values: text("values").array().notNull(),
});

// Product Variants
export const productVariants = pgTable("product_variants", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .references(() => products.id)
    .notNull(),
  sku: text("sku").notNull().unique(),
  title: text("title").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal("compare_at_price", { precision: 10, scale: 2 }),
  inventoryQuantity: integer("inventory_quantity").default(0),
  attributes: jsonb("attributes").notNull().$type<Record<string, string>>(),
  // Images for variant selection (White mug image, Black mug image, etc.)
  image: text("image"),
  mockups: jsonb("mockups").$type<Record<string, string>>(),
  designZone: jsonb("design_zone").$type<{
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
  }>(),
  printSpec: jsonb("print_spec").$type<{
    width: number;
    height: number;
    dpi: number;
    format: string;
  }>(),
  isDefault: boolean("is_default").default(false),
});

// Product Templates (many-to-many)
export const productTemplates = pgTable("product_templates", {
  id: text("id").primaryKey(),
  productId: text("product_id")
    .references(() => products.id)
    .notNull(),
  templateId: text("template_id")
    .references(() => templates.id)
    .notNull(),
  isDefault: boolean("is_default").default(false),
  position: integer("position").default(0),
});

// Relations
export const productsRelations = relations(products, ({ many }) => ({
  options: many(productOptions),
  variants: many(productVariants),
  productTemplates: many(productTemplates),
}));

export const productOptionsRelations = relations(productOptions, ({ one }) => ({
  product: one(products, {
    fields: [productOptions.productId],
    references: [products.id],
  }),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
  })
);

export const productTemplatesRelations = relations(
  productTemplates,
  ({ one }) => ({
    product: one(products, {
      fields: [productTemplates.productId],
      references: [products.id],
    }),
    template: one(templates, {
      fields: [productTemplates.templateId],
      references: [templates.id],
    }),
  })
);
