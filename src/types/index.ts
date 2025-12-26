// Product types
export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string | null;
  productType: string;
  vendor: string | null;
  tags: string[] | null;
  status: string | null;
  thumbnail: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface ProductOption {
  id: string;
  productId: string;
  name: string;
  position: number | null;
  values: string[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  title: string;
  price: string;
  compareAtPrice: string | null;
  inventoryQuantity: number | null;
  attributes: Record<string, string>;
  mockups: Record<string, string> | null;
  designZone: {
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
  } | null;
  printSpec: {
    width: number;
    height: number;
    dpi: number;
    format: string;
  } | null;
  isDefault: boolean | null;
}

export interface ProductWithDetails extends Product {
  options: ProductOption[];
  variants: ProductVariant[];
  templates: Template[];
}

// Template types
export interface Template {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  thumbnail: string | null;
  layout: {
    background?: string;
    staticElements?: Array<{
      type: string;
      content?: string;
      style?: Record<string, unknown>;
      position?: { x: number; y: number };
    }>;
  };
  createdAt: Date | null;
}

export interface TemplateCustomization {
  id: string;
  templateId: string;
  type: "chibi_figures" | "text_input" | "image_upload" | "color_picker";
  name: string;
  key: string;
  position: number | null;
  required: boolean | null;
  config:
    | ChibiFiguresConfig
    | TextInputConfig
    | ImageUploadConfig
    | ColorPickerConfig;
}

export interface ChibiFiguresConfig {
  minCount: number;
  maxCount: number;
  defaultCount: number;
  showName: boolean;
  nameLabel?: string;
  namePlaceholder?: string;
  nameMaxLength?: number;
  nameStyle?: {
    fontFamily: string;
    fontSize: number;
    color: string;
  };
  layout: {
    area: { x: number; y: number; width: number; height: number };
    arrangement: string;
    figureSize: { width: number; height: number };
    spacing: number;
  };
  defaultFigure: {
    bodyId: string;
    hairId: string;
    outfitId: string;
    accessoryIds: string[];
    skinColorId: string;
    hairColorId: string;
    outfitColorId: string;
  };
}

export interface TextInputConfig {
  label: string;
  placeholder?: string;
  defaultValue?: string;
  maxLength: number;
  style?: Record<string, unknown>;
  position?: { x: number; y: number };
}

export interface ImageUploadConfig {
  label: string;
  accept: string[];
  maxSizeMB: number;
  cropAspectRatio?: number;
  minResolution?: { width: number; height: number };
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

export interface ColorPickerConfig {
  label: string;
  target: string;
  presets: Array<{ id: string; hex: string; name: string }>;
  allowCustom: boolean;
  defaultColorId: string;
}

// Chibi parts types
export interface ChibiBody {
  id: string;
  name: string;
  gender: string;
  image: string;
  position: number | null;
  isActive: boolean | null;
}

export interface ChibiHair {
  id: string;
  name: string;
  forGender: string[] | null;
  image: string;
  position: number | null;
  isActive: boolean | null;
}

export interface ChibiOutfit {
  id: string;
  name: string;
  forGender: string[] | null;
  image: string;
  position: number | null;
  isActive: boolean | null;
}

export interface ChibiAccessory {
  id: string;
  name: string;
  category: string | null;
  image: string;
  position: number | null;
  isActive: boolean | null;
}

export interface ColorPreset {
  id: string;
  type: "skin" | "hair" | "outfit";
  name: string;
  hex: string;
  position: number | null;
  isActive: boolean | null;
}

// Design state types
export interface ChibiFigure {
  id: string;
  order: number;
  name: string;
  bodyId: string;
  hairId: string;
  outfitId: string;
  accessoryIds: string[];
  skinColorId: string;
  hairColorId: string;
  outfitColorId: string;
}

export interface DesignCustomization {
  chibi_figures?: ChibiFigure[];
  text_input?: Record<string, string>;
  image_upload?: Record<string, { url: string; crop?: unknown }>;
  color_picker?: Record<string, string>;
}

export interface SavedDesign {
  id: string;
  productId: string;
  variantId: string;
  templateId: string;
  customization: DesignCustomization;
  previewThumbnail: string | null;
  previewFullSize: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}
