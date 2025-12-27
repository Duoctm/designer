"use client";

import { TextInputField } from "./text-input-field";
import { ImageSelectField } from "./image-select-field";
import { NumberInputField } from "./number-input-field";

interface FieldOption {
  id: string;
  label: string | null;
  image: string;
  colorHex?: string | null;
}

interface TemplateField {
  id: string;
  key: string;
  label: string;
  description: string | null;
  type: string;
  required: boolean | null;
  config: Record<string, unknown>;
  options: FieldOption[];
}

interface FieldRendererProps {
  field: TemplateField;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
  switch (field.type) {
    case "text_input":
      return (
        <TextInputField
          label={field.label}
          description={field.description}
          value={(value as string) ?? ""}
          onChange={onChange}
          config={
            field.config as {
              placeholder?: string;
              maxLength?: number;
              showCharCount?: boolean;
            }
          }
          required={field.required ?? false}
        />
      );

    case "image_select":
    case "color_select":
      return (
        <ImageSelectField
          label={field.label}
          description={field.description}
          value={(value as string | string[]) ?? ""}
          onChange={onChange}
          options={field.options}
          config={
            field.config as {
              columns?: number;
              multiple?: boolean;
              maxSelect?: number;
            }
          }
          required={field.required ?? false}
          fieldKey={field.key}
        />
      );

    case "number_input":
      return (
        <NumberInputField
          label={field.label}
          description={field.description}
          value={(value as number) ?? 0}
          onChange={onChange}
          config={
            field.config as {
              min?: number;
              max?: number;
              default?: number;
              step?: number;
            }
          }
          required={field.required ?? false}
        />
      );

    default:
      return (
        <div className="p-4 bg-yellow-50 rounded-lg text-yellow-800 text-sm">
          Unknown field type: {field.type}
        </div>
      );
  }
}
