"use client";

import { useState } from "react";

interface VariantSelectorProps {
  options: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
  variants: Array<{
    id: string;
    title: string;
    price: string;
    attributes: Record<string, string>;
  }>;
  selectedVariantId: string;
  onVariantChange: (variantId: string) => void;
}

export function VariantSelector({
  options,
  variants,
  selectedVariantId,
  onVariantChange,
}: VariantSelectorProps) {
  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >(selectedVariant?.attributes ?? {});

  const handleOptionChange = (optionName: string, value: string) => {
    const newAttributes = {
      ...selectedAttributes,
      [optionName.toLowerCase()]: value,
    };
    setSelectedAttributes(newAttributes);

    // Find matching variant
    const matchingVariant = variants.find((v) =>
      Object.entries(newAttributes).every(
        ([key, val]) => v.attributes[key]?.toLowerCase() === val.toLowerCase()
      )
    );

    if (matchingVariant) {
      onVariantChange(matchingVariant.id);
    }
  };

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div key={option.id}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {option.name}
          </label>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected =
                selectedAttributes[option.name.toLowerCase()]?.toLowerCase() ===
                value.toLowerCase();

              return (
                <button
                  key={value}
                  onClick={() => handleOptionChange(option.name, value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-gray-900 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
