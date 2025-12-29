import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  products,
  productOptions,
  productVariants,
  productTemplates,
} from "./schema/products";
import { templates, templateFields, fieldOptions } from "./schema/templates";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  console.log("Clearing existing data...");
  await db.delete(fieldOptions);
  await db.delete(templateFields);
  await db.delete(productTemplates);
  await db.delete(productVariants);
  await db.delete(productOptions);
  await db.delete(products);
  await db.delete(templates);

  // ========== TEMPLATES ==========
  console.log("Seeding templates...");

  // Template: Animal Mug (Rooster Collection)
  await db.insert(templates).values([
    {
      id: "tpl_animal_mug",
      name: "Rooster Collection",
      description: "Personalized rooster mugs - F-CAW-F",
      category: "animal",
      thumbnail:
        "https://ik.imagekit.io/9um5tdigihm/8/storage/personalizedDesign/design/images/05.11.2025/252.WZ8NN690c239fdfb87.thumb.png",
      layout: {
        background: "#FFFFFF",
        staticElements: [],
      },
    },
  ]);

  // Template Fields for Animal Mug
  await db.insert(templateFields).values([
    {
      id: "field_name",
      templateId: "tpl_animal_mug",
      key: "name",
      label: "Name's",
      description: "*Can Be Left Empty*",
      type: "text_input",
      required: false,
      config: { placeholder: "Enter", maxLength: 24, showCharCount: true },
      position: 0,
    },
    {
      id: "field_animal",
      templateId: "tpl_animal_mug",
      key: "animal",
      label: "Choose An Animal",
      description: null,
      type: "image_select",
      required: true,
      config: { columns: 5, multiple: false, minSelect: 1, maxSelect: 1 },
      position: 1,
    },
  ]);

  // Field Options - Animals (roosters from Gossby)
  await db.insert(fieldOptions).values([
    {
      id: "opt_rooster_1",
      fieldId: "field_animal",
      label: "F-CAW-F",
      image:
        "https://ik.imagekit.io/9um5tdigihm/8/storage/personalizedDesign/design/images/05.11.2025/252.WZ8NN690c239fdfb87.thumb.png",
      position: 0,
    },
    {
      id: "opt_rooster_2",
      fieldId: "field_animal",
      label: "F-CAW-F",
      image:
        "https://ik.imagekit.io/9um5tdigihm/8/storage/personalizedDesign/design/images/05.11.2025/252.U08VQ690c23ae2b567.thumb.png",
      position: 1,
    },
    {
      id: "opt_rooster_3",
      fieldId: "field_animal",
      label: "F-CAW-F",
      image:
        "https://ik.imagekit.io/9um5tdigihm/8/storage/personalizedDesign/design/images/05.11.2025/252.JTV2F690c23aac3f28.thumb.png",
      position: 2,
    },
    {
      id: "opt_rooster_4",
      fieldId: "field_animal",
      label: null,
      image:
        "https://ik.imagekit.io/9um5tdigihm/8/storage/personalizedDesign/design/images/05.11.2025/252.W2PTS690c23a9f3155.thumb.png",
      position: 3,
    },
    {
      id: "opt_rooster_5",
      fieldId: "field_animal",
      label: null,
      image:
        "https://ik.imagekit.io/9um5tdigihm/8/storage/personalizedDesign/design/images/05.11.2025/252.FS4DN690c23aae92e4.thumb.png",
      position: 4,
    },
    {
      id: "opt_rooster_6",
      fieldId: "field_animal",
      label: null,
      image:
        "https://ik.imagekit.io/9um5tdigihm/8/storage/personalizedDesign/design/images/05.11.2025/252.NEC9L690c23aadf99f.thumb.png",
      position: 5,
    },
    {
      id: "opt_rooster_7",
      fieldId: "field_animal",
      label: "F-CAW-F",
      image:
        "https://ik.imagekit.io/9um5tdigihm/8/storage/personalizedDesign/design/images/05.11.2025/252.70SU1690c23ad67ae9.thumb.png",
      position: 6,
    },
    {
      id: "opt_rooster_8",
      fieldId: "field_animal",
      label: "F-CAW-F",
      image:
        "https://ik.imagekit.io/9um5tdigihm/8/storage/personalizedDesign/design/images/05.11.2025/252.NSQ33690c23af8bae3.thumb.png",
      position: 7,
    },
    {
      id: "opt_rooster_9",
      fieldId: "field_animal",
      label: "F-CAW-F",
      image:
        "https://ik.imagekit.io/9um5tdigihm/8/storage/personalizedDesign/design/images/05.11.2025/252.92691690c23afd25ef.thumb.png",
      position: 8,
    },
    {
      id: "opt_rooster_10",
      fieldId: "field_animal",
      label: null,
      image:
        "https://ik.imagekit.io/9um5tdigihm/8/storage/personalizedDesign/design/images/05.11.2025/252.9ZT68690c23a96eeca.thumb.png",
      position: 9,
    },
  ]);

  // ========== PRODUCTS ==========
  console.log("Seeding products...");

  // Product: Rooster Mug
  await db.insert(products).values([
    {
      id: "prod_rooster_mug",
      handle: "rooster-mug",
      title: "Personalized Rooster Mug - F-CAW-F Collection",
      description:
        "Funny personalized ceramic mug with rooster designs. Microwave and dishwasher safe. Perfect gift for rooster lovers!",
      productType: "mug",
      vendor: "Demo Designer",
      tags: ["mug", "rooster", "personalized", "gift", "funny"],
      status: "active",
      thumbnail:
        "https://cms.gossby.com/resource/template/core/image/catalog/campaign/type/preview/mug/11oz/white/front.png",
    },
  ]);

  // Product Options
  await db.insert(productOptions).values([
    {
      id: "opt_rooster_mug_color",
      productId: "prod_rooster_mug",
      name: "Color",
      position: 1,
      values: ["White", "Black"],
    },
    {
      id: "opt_rooster_mug_size",
      productId: "prod_rooster_mug",
      name: "Size",
      position: 2,
      values: ["11 oz", "15 oz"],
    },
  ]);

  // Product Variants with real Gossby images and designZone
  await db.insert(productVariants).values([
    {
      id: "var_rooster_11oz_white",
      productId: "prod_rooster_mug",
      sku: "ROOSTER-MUG-11-WHT",
      title: "11 oz / White",
      price: "14.99",
      compareAtPrice: "25.99",
      inventoryQuantity: 100,
      attributes: { size: "11 oz", color: "White" },
      image:
        "https://cms.gossby.com/resource/template/core/image/catalog/campaign/type/preview/mug/11oz/white/front.png",
      // Design zone: percentage-based positioning on the mug
      // offsetX/Y from center, width/height as percentage of mug
      designZone: { width: 35, height: 50, offsetX: 8, offsetY: 0 },
      isDefault: true,
    },
    {
      id: "var_rooster_11oz_black",
      productId: "prod_rooster_mug",
      sku: "ROOSTER-MUG-11-BLK",
      title: "11 oz / Black",
      price: "14.99",
      compareAtPrice: "25.99",
      inventoryQuantity: 80,
      attributes: { size: "11 oz", color: "Black" },
      image:
        "https://cms.gossby.com/resource/template/core/image/catalog/campaign/type/preview/mug/11oz/black/front/background.png",
      designZone: { width: 35, height: 50, offsetX: 8, offsetY: 0 },
      isDefault: false,
    },
    {
      id: "var_rooster_15oz_white",
      productId: "prod_rooster_mug",
      sku: "ROOSTER-MUG-15-WHT",
      title: "15 oz / White",
      price: "16.99",
      compareAtPrice: "27.99",
      inventoryQuantity: 60,
      attributes: { size: "15 oz", color: "White" },
      image:
        "https://cms.gossby.com/resource/template/core/image/catalog/campaign/type/preview/mug/11oz/white/front.png",
      designZone: { width: 38, height: 55, offsetX: 8, offsetY: 0 },
      isDefault: false,
    },
    {
      id: "var_rooster_15oz_black",
      productId: "prod_rooster_mug",
      sku: "ROOSTER-MUG-15-BLK",
      title: "15 oz / Black",
      price: "16.99",
      compareAtPrice: "27.99",
      inventoryQuantity: 40,
      attributes: { size: "15 oz", color: "Black" },
      image:
        "https://cms.gossby.com/resource/template/core/image/catalog/campaign/type/preview/mug/11oz/black/front/background.png",
      designZone: { width: 38, height: 55, offsetX: 8, offsetY: 0 },
      isDefault: false,
    },
  ]);

  // Link product to template
  await db.insert(productTemplates).values([
    {
      id: "pt_rooster_mug",
      productId: "prod_rooster_mug",
      templateId: "tpl_animal_mug",
      isDefault: true,
      position: 0,
    },
  ]);

  // ========== T-SHIRT PRODUCT ==========
  console.log("Seeding T-shirt product...");

  // Template for T-shirt (reuse animal template for demo)
  await db.insert(templates).values([
    {
      id: "tpl_tshirt_graphic",
      name: "Graphic Tee",
      description: "Custom graphic t-shirt design",
      category: "tshirt",
      thumbnail:
        "https://cms.gossby.com/resource/template/core/image/catalog/campaign/type/preview/classicTee2/ash/front/background.png",
      layout: { background: "#FFFFFF" },
    },
  ]);

  // T-shirt template fields
  await db.insert(templateFields).values([
    {
      id: "field_tshirt_graphic",
      templateId: "tpl_tshirt_graphic",
      key: "graphic",
      label: "Choose Design",
      description: null,
      type: "image_select",
      required: true,
      config: { columns: 5, multiple: false, minSelect: 1, maxSelect: 1 },
      position: 0,
    },
    {
      id: "field_tshirt_flower",
      templateId: "tpl_tshirt_graphic",
      key: "flower",
      label: "Choose Flower",
      description: "*Optional decoration*",
      type: "image_select",
      required: false,
      config: {
        columns: 5,
        multiple: false,
        minSelect: 0,
        maxSelect: 1,
        alignment: "top-right",
      },
      position: 1,
    },
    {
      id: "field_tshirt_flag",
      templateId: "tpl_tshirt_graphic",
      key: "flag",
      label: "Choose Flag",
      description: "*Optional badge*",
      type: "image_select",
      required: false,
      config: {
        columns: 5,
        multiple: false,
        minSelect: 0,
        maxSelect: 1,
        alignment: "top-left",
      },
      position: 2,
    },
  ]);

  // T-shirt design options (unique images)
  await db.insert(fieldOptions).values([
    {
      id: "opt_tshirt_1",
      fieldId: "field_tshirt_graphic",
      label: "Design 1",
      image:
        "https://ik.imagekit.io/9um5tdigihm/8/storage/personalizedDesign/design/images/24.05.2022/487.ERC2T628cb5f14bb04.preview.png",
      position: 0,
    },
    {
      id: "opt_tshirt_2",
      fieldId: "field_tshirt_graphic",
      label: "Design 2",
      image:
        "https://ik.imagekit.io/9um5tdigihm/8/storage/personalizedDesign/design/images/24.05.2022/487.5PZQ9628cb63d5f182.preview.png",
      position: 1,
    },
    {
      id: "opt_tshirt_3",
      fieldId: "field_tshirt_graphic",
      label: "Design 3",
      image:
        "https://ik.imagekit.io/9um5tdigihm/8/storage/personalizedDesign/design/images/24.05.2022/487.88WWZ628cb60f8a1f6.preview.png",
      position: 2,
    },
  ]);

  // Flower options (top-left position)
  await db.insert(fieldOptions).values([
    {
      id: "opt_flower_sakura",
      fieldId: "field_tshirt_flower",
      label: "Sakura",
      image:
        "https://png.pngtree.com/png-vector/20230120/ourmid/pngtree-sakura-blooming-season-elements-png-image_6567346.png",
      position: 0,
    },
    {
      id: "opt_flower_lotus",
      fieldId: "field_tshirt_flower",
      label: "Lotus",
      image:
        "https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482644ggc/anh-mo-ta.png",
      position: 1,
    },
  ]);

  // Flag options (bottom-right position)
  await db.insert(fieldOptions).values([
    {
      id: "opt_flag_usa",
      fieldId: "field_tshirt_flag",
      label: "USA",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_of_the_United_States_%281819%E2%80%931820%29.svg/250px-Flag_of_the_United_States_%281819%E2%80%931820%29.svg.png",
      position: 0,
    },
    {
      id: "opt_flag_france",
      fieldId: "field_tshirt_flag",
      label: "France",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Ensign_of_France.svg/250px-Ensign_of_France.svg.png",
      position: 1,
    },
  ]);

  // T-shirt Product
  await db.insert(products).values([
    {
      id: "prod_graphic_tshirt",
      handle: "graphic-tshirt",
      title: "Custom Graphic T-Shirt",
      description:
        "Premium quality cotton t-shirt with your custom design. Comfortable and stylish.",
      productType: "tshirt",
      vendor: "Demo Designer",
      tags: ["tshirt", "graphic", "personalized", "apparel"],
      status: "active",
      thumbnail:
        "https://cms.gossby.com/resource/template/core/image/catalog/campaign/type/preview/classicTee2/ash/front/background.png",
    },
  ]);

  // T-shirt options
  await db.insert(productOptions).values([
    {
      id: "opt_tshirt_color",
      productId: "prod_graphic_tshirt",
      name: "Color",
      position: 1,
      values: ["Ash", "Black", "White"],
    },
    {
      id: "opt_tshirt_size",
      productId: "prod_graphic_tshirt",
      name: "Size",
      position: 2,
      values: ["S", "M", "L", "XL", "2XL"],
    },
  ]);

  // T-shirt variants with designZone
  await db.insert(productVariants).values([
    {
      id: "var_tshirt_ash_m",
      productId: "prod_graphic_tshirt",
      sku: "TSHIRT-ASH-M",
      title: "M / Ash",
      price: "24.99",
      compareAtPrice: "34.99",
      inventoryQuantity: 100,
      attributes: { size: "M", color: "Ash" },
      image:
        "https://cms.gossby.com/resource/template/core/image/catalog/campaign/type/preview/classicTee2/ash/front/background.png",
      // T-shirt design zone: centered on chest area
      designZone: { width: 40, height: 45, offsetX: 0, offsetY: -5 },
      isDefault: true,
    },
    {
      id: "var_tshirt_black_m",
      productId: "prod_graphic_tshirt",
      sku: "TSHIRT-BLK-M",
      title: "M / Black",
      price: "24.99",
      compareAtPrice: "34.99",
      inventoryQuantity: 80,
      attributes: { size: "M", color: "Black" },
      image:
        "https://cms.gossby.com/resource/template/core/image/catalog/campaign/type/preview/classicTee2/black/front/background.png",
      designZone: { width: 40, height: 45, offsetX: 0, offsetY: -5 },
      isDefault: false,
    },
    {
      id: "var_tshirt_white_m",
      productId: "prod_graphic_tshirt",
      sku: "TSHIRT-WHT-M",
      title: "M / White",
      price: "24.99",
      compareAtPrice: "34.99",
      inventoryQuantity: 60,
      attributes: { size: "M", color: "White" },
      image:
        "https://cms.gossby.com/resource/template/core/image/catalog/campaign/type/preview/classicTee2/white/front/background.png",
      designZone: { width: 40, height: 45, offsetX: 0, offsetY: -5 },
      isDefault: false,
    },
  ]);

  // Link T-shirt to template
  await db.insert(productTemplates).values([
    {
      id: "pt_graphic_tshirt",
      productId: "prod_graphic_tshirt",
      templateId: "tpl_tshirt_graphic",
      isDefault: true,
      position: 0,
    },
  ]);

  console.log("✅ Seeding completed!");
  console.log(
    "   - 2 Products: Rooster Mug (4 variants), Graphic T-Shirt (3 variants)"
  );
  console.log("   - 2 Templates with fields");
  console.log("   - 15 Field Options");

  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
