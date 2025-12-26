import {
  pgTable,
  text,
  integer,
  jsonb,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Templates
export const templates = pgTable("templates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"),
  thumbnail: text("thumbnail"),
  // Static layout elements (text, images that don't change)
  layout: jsonb("layout").$type<{
    background?: string;
    staticElements?: Array<{
      type: string;
      content?: string;
      image?: string;
      style?: Record<string, unknown>;
      position?: { x: number; y: number };
    }>;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Template Fields - Generic customization fields
export const templateFields = pgTable("template_fields", {
  id: text("id").primaryKey(),
  templateId: text("template_id")
    .references(() => templates.id)
    .notNull(),

  // Identification
  key: text("key").notNull(), // "animal", "name", "background"

  // Display
  label: text("label").notNull(), // "Choose An Animal", "Name's"
  description: text("description"), // "*Can Be Left Empty*"

  // Type: text_input, image_select, number_input, color_select
  type: text("type").notNull(),

  // Validation
  required: boolean("required").default(true),

  // Type-specific configuration
  config: jsonb("config").notNull().$type<
    | {
        // text_input
        placeholder?: string;
        maxLength?: number;
        showCharCount?: boolean;
        defaultValue?: string;
      }
    | {
        // image_select
        columns?: number;
        multiple?: boolean;
        minSelect?: number;
        maxSelect?: number;
      }
    | {
        // number_input
        min?: number;
        max?: number;
        default?: number;
        step?: number;
      }
    | {
        // color_select (still image-based, but specifically for colors)
        columns?: number;
        showLabel?: boolean;
      }
  >(),

  position: integer("position").default(0),
  isActive: boolean("is_active").default(true),
});

// Field Options - Options for image_select/color_select fields
export const fieldOptions = pgTable("field_options", {
  id: text("id").primaryKey(),
  fieldId: text("field_id")
    .references(() => templateFields.id)
    .notNull(),

  // Display
  label: text("label"), // Optional label under image
  image: text("image").notNull(), // "/options/rooster-1.png"

  // For color type
  colorHex: text("color_hex"), // "#FF0000" - for preview/fallback

  // Extra metadata
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),

  position: integer("position").default(0),
  isActive: boolean("is_active").default(true),
});

// Relations
export const templatesRelations = relations(templates, ({ many }) => ({
  fields: many(templateFields),
}));

export const templateFieldsRelations = relations(
  templateFields,
  ({ one, many }) => ({
    template: one(templates, {
      fields: [templateFields.templateId],
      references: [templates.id],
    }),
    options: many(fieldOptions),
  })
);

export const fieldOptionsRelations = relations(fieldOptions, ({ one }) => ({
  field: one(templateFields, {
    fields: [fieldOptions.fieldId],
    references: [templateFields.id],
  }),
}));
