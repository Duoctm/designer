// Attribute definition types - drives the UI dynamically

export type AttributeType =
  | "select"
  | "color_picker"
  | "text_input"
  | "image_picker";

// Base attribute definition
export interface AttributeDefinition {
  id: string;
  key: string; // key in the figure object, e.g., "bodyId", "hairId"
  label: string;
  type: AttributeType;
  required?: boolean;
  position: number;
}

// Select attribute - choose from a list of options
export interface SelectAttributeDefinition extends AttributeDefinition {
  type: "select";
  config: {
    dataSource: string; // API endpoint or data key, e.g., "chibi_bodies", "chibi_hairs"
    displayMode: "buttons" | "grid" | "dropdown";
    columns?: number; // for grid mode
    showImage?: boolean;
    filterByGender?: boolean; // filter options based on selected body gender
  };
}

// Color picker attribute
export interface ColorPickerAttributeDefinition extends AttributeDefinition {
  type: "color_picker";
  config: {
    dataSource: string; // e.g., "colors.skin", "colors.hair", "colors.outfit"
    allowCustom?: boolean;
  };
}

// Text input attribute
export interface TextInputAttributeDefinition extends AttributeDefinition {
  type: "text_input";
  config: {
    placeholder?: string;
    maxLength?: number;
    validation?: {
      pattern?: string;
      errorMessage?: string;
    };
  };
}

// Image picker attribute (for accessories, etc.)
export interface ImagePickerAttributeDefinition extends AttributeDefinition {
  type: "image_picker";
  config: {
    dataSource: string;
    multiple?: boolean;
    maxItems?: number;
  };
}

export type AnyAttributeDefinition =
  | SelectAttributeDefinition
  | ColorPickerAttributeDefinition
  | TextInputAttributeDefinition
  | ImagePickerAttributeDefinition;

// Figure attributes configuration - defines what attributes a figure has
export interface FigureAttributesConfig {
  attributes: AnyAttributeDefinition[];
}

// Generic option item for select/color picker
export interface OptionItem {
  id: string;
  name: string;
  image?: string | null;
  hex?: string | null; // for colors
  forGender?: string[] | null; // for filtering
  [key: string]: unknown; // allow additional properties
}

// Figure data - dynamic key-value pairs
export interface DynamicFigure {
  id: string;
  order: number;
  [key: string]: unknown; // Dynamic attributes stored by key
}

// Data sources registry
export interface DataSources {
  [key: string]: OptionItem[];
}
