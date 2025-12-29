"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/layout/header";
import { FieldRenderer } from "@/components/customizer/field-renderer";

// Dynamic import for react-konva (SSR not supported)
const ProductCanvasWrapper = dynamic(
  () =>
    import("@/components/customizer/product-canvas").then(
      (mod) => mod.ProductCanvas
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading canvas...</div>
      </div>
    ),
  }
);

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
  position: number | null;
  options: FieldOption[];
}

interface ProductData {
  id: string;
  handle: string;
  title: string;
  description: string | null;
  productType: string;
  thumbnail: string | null;
  options: Array<{
    id: string;
    name: string;
    values: string[] | null;
  }>;
  variants: Array<{
    id: string;
    title: string;
    price: string;
    compareAtPrice: string | null;
    attributes: Record<string, string>;
    image: string | null;
    isDefault: boolean | null;
    designZone: {
      width: number;
      height: number;
      offsetX: number;
      offsetY: number;
    } | null;
  }>;
  templates: Array<{
    id: string;
    name: string;
    fields: TemplateField[];
    isDefault: boolean | null;
  }>;
}

interface ProductDetailClientProps {
  product: ProductData;
}

interface DesignElement {
  id: string;
  type: "image" | "text";
  src?: string;
  text?: string;
  alignment?:
    | "center"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
}

// Build design elements from fields and selected values
function buildDesignElements(
  fields: TemplateField[],
  values: Record<string, unknown>
): DesignElement[] {
  const elements: DesignElement[] = [];

  for (const field of fields) {
    const value = values[field.key];
    if (!value) continue;

    if (field.type === "image_select" || field.type === "color_select") {
      const selectedOption = field.options.find((opt) => opt.id === value);
      if (selectedOption?.image) {
        elements.push({
          id: field.id,
          type: "image",
          src: selectedOption.image,
          alignment:
            (field.config.alignment as DesignElement["alignment"]) ?? "center",
        });
      }
    }

    if (
      field.type === "text_input" &&
      typeof value === "string" &&
      value.trim()
    ) {
      elements.push({
        id: field.id,
        type: "text",
        text: value,
        alignment:
          (field.config.alignment as DesignElement["alignment"]) ?? "center",
      });
    }
  }

  return elements;
}

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const defaultVariant =
    product.variants.find((v) => v.isDefault) ?? product.variants[0];
  const defaultTemplate =
    product.templates?.find((t) => t.isDefault) ?? product.templates?.[0];

  const [selectedVariantId, setSelectedVariantId] = useState(
    defaultVariant?.id ?? ""
  );
  const [values, setValues] = useState<Record<string, unknown>>({});

  const selectedVariant = product.variants.find(
    (v) => v.id === selectedVariantId
  );

  const handleValueChange = (key: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleVariantSelect = (variantId: string) => {
    setSelectedVariantId(variantId);
  };

  const sortedFields = defaultTemplate?.fields
    ? [...defaultTemplate.fields].sort(
        (a, b) => (a.position ?? 0) - (b.position ?? 0)
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Products
        </a>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Live Preview */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 aspect-square flex items-center justify-center relative overflow-hidden sticky top-8">
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50" />

              {/* Canvas Preview */}
              <div className="relative z-10 w-full h-full p-4">
                <ProductCanvasWrapper
                  productImage={selectedVariant?.image ?? ""}
                  designZone={
                    selectedVariant?.designZone ?? {
                      width: 40,
                      height: 45,
                      offsetX: 0,
                      offsetY: -5,
                    }
                  }
                  designs={buildDesignElements(sortedFields, values)}
                  textColor={
                    selectedVariant?.attributes?.color?.toLowerCase() ===
                    "black"
                      ? "#FFFFFF"
                      : "#333333"
                  }
                />
              </div>

              {/* Variant indicator */}
              <div className="absolute bottom-4 left-4 text-xs text-gray-400">
                {selectedVariant?.title}
              </div>
            </div>
          </div>

          {/* RIGHT: Customization Form */}
          <div className="space-y-6">
            {/* Product Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
              {/* Product Title */}
              <div className="border-b border-gray-100 pb-4">
                <h1 className="text-lg font-semibold text-gray-900">
                  Item #1: {product.title}
                </h1>
              </div>

              {/* Color Selection */}
              {product.options
                .filter((o) => o.name.toLowerCase() === "color")
                .map((option) => (
                  <div key={option.id} className="space-y-3">
                    <span className="text-sm font-semibold text-gray-900">
                      {option.name}
                    </span>
                    <div className="flex gap-3">
                      {option.values?.map((value) => {
                        const matchingVariant = product.variants.find(
                          (v) =>
                            v.attributes[option.name.toLowerCase()] === value
                        );
                        const isSelected =
                          selectedVariant?.attributes[
                            option.name.toLowerCase()
                          ] === value;

                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => {
                              if (matchingVariant)
                                handleVariantSelect(matchingVariant.id);
                            }}
                            className={`relative rounded-xl overflow-hidden border-2 transition-all w-16 h-16 ${
                              isSelected
                                ? "border-green-500 ring-2 ring-green-500/20"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-1 left-1 w-4 h-4 bg-green-500 rounded flex items-center justify-center z-10">
                                <svg
                                  className="w-2.5 h-2.5 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            )}
                            {/* Show variant image or color */}
                            {matchingVariant?.image ? (
                              <img
                                src={matchingVariant.image}
                                alt={value}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div
                                className="w-full h-full"
                                style={{
                                  backgroundColor:
                                    value.toLowerCase() === "white"
                                      ? "#FFFFFF"
                                      : value.toLowerCase() === "black"
                                      ? "#1F2937"
                                      : "#E5E7EB",
                                }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs text-gray-500">
                      {selectedVariant?.attributes[option.name.toLowerCase()]}
                    </span>
                  </div>
                ))}

              {/* Customization Fields */}
              {defaultTemplate && sortedFields.length > 0 && (
                <div className="border-t border-gray-100 pt-6 space-y-6">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Personalized
                  </h2>

                  {sortedFields.map((field) => (
                    <FieldRenderer
                      key={field.id}
                      field={field}
                      value={values[field.key]}
                      onChange={(value) => handleValueChange(field.key, value)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
