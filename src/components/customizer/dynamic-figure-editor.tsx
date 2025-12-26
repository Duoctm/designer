"use client";

import type {
  AnyAttributeDefinition,
  OptionItem,
  DynamicFigure,
  DataSources,
} from "@/types/attributes";

interface DynamicFigureEditorProps {
  figure: DynamicFigure;
  attributeDefinitions: AnyAttributeDefinition[];
  dataSources: DataSources;
  onUpdate: (key: string, value: unknown) => void;
}

export function DynamicFigureEditor({
  figure,
  attributeDefinitions,
  dataSources,
  onUpdate,
}: DynamicFigureEditorProps) {
  // Get current body gender for filtering
  const bodyKey = attributeDefinitions.find(
    (attr) => attr.type === "select" && attr.config.filterByGender === false
  )?.key;
  const currentBodyId = bodyKey ? (figure[bodyKey] as string) : null;
  const bodyDataSource = bodyKey
    ? attributeDefinitions.find((a) => a.key === bodyKey)
    : null;
  const bodyOptions =
    bodyDataSource?.type === "select"
      ? dataSources[bodyDataSource.config.dataSource]
      : [];
  const currentBody = bodyOptions?.find((b) => b.id === currentBodyId);
  const currentGender =
    currentBody?.forGender?.[0] ??
    (currentBody as { gender?: string })?.gender ??
    "unisex";

  // Sort attributes by position
  const sortedAttributes = [...attributeDefinitions].sort(
    (a, b) => a.position - b.position
  );

  return (
    <div className="space-y-5">
      {sortedAttributes.map((attr) => (
        <AttributeRenderer
          key={attr.id}
          attribute={attr}
          value={figure[attr.key]}
          dataSources={dataSources}
          currentGender={currentGender}
          onUpdate={(value) => onUpdate(attr.key, value)}
        />
      ))}
    </div>
  );
}

// ============ ATTRIBUTE RENDERER ============

interface AttributeRendererProps {
  attribute: AnyAttributeDefinition;
  value: unknown;
  dataSources: DataSources;
  currentGender: string;
  onUpdate: (value: unknown) => void;
}

function AttributeRenderer({
  attribute,
  value,
  dataSources,
  currentGender,
  onUpdate,
}: AttributeRendererProps) {
  switch (attribute.type) {
    case "text_input":
      return (
        <TextInputRenderer
          attribute={attribute}
          value={value as string}
          onUpdate={onUpdate}
        />
      );
    case "select":
      return (
        <SelectRenderer
          attribute={attribute}
          value={value as string}
          options={dataSources[attribute.config.dataSource] ?? []}
          currentGender={currentGender}
          onUpdate={onUpdate}
        />
      );
    case "color_picker":
      return (
        <ColorPickerRenderer
          attribute={attribute}
          value={value as string}
          options={dataSources[attribute.config.dataSource] ?? []}
          onUpdate={onUpdate}
        />
      );
    case "image_picker":
      return (
        <ImagePickerRenderer
          attribute={attribute}
          value={value as string[]}
          options={dataSources[attribute.config.dataSource] ?? []}
          onUpdate={onUpdate}
        />
      );
    default:
      return null;
  }
}

// ============ TEXT INPUT ============

function TextInputRenderer({
  attribute,
  value,
  onUpdate,
}: {
  attribute: AnyAttributeDefinition & { type: "text_input" };
  value: string;
  onUpdate: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {attribute.label}
      </label>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder={attribute.config.placeholder}
        maxLength={attribute.config.maxLength}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
      />
    </div>
  );
}

// ============ SELECT ============

function SelectRenderer({
  attribute,
  value,
  options,
  currentGender,
  onUpdate,
}: {
  attribute: AnyAttributeDefinition & { type: "select" };
  value: string;
  options: OptionItem[];
  currentGender: string;
  onUpdate: (value: string) => void;
}) {
  // Filter by gender if needed
  const filteredOptions = attribute.config.filterByGender
    ? options.filter(
        (opt) =>
          !opt.forGender ||
          opt.forGender.includes(currentGender) ||
          opt.forGender.includes("unisex")
      )
    : options;

  const { displayMode, columns = 3 } = attribute.config;

  if (displayMode === "dropdown") {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {attribute.label}
        </label>
        <select
          value={value ?? ""}
          onChange={(e) => onUpdate(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
        >
          <option value="">Select...</option>
          {filteredOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Buttons or Grid mode
  const gridClass =
    displayMode === "grid"
      ? `grid grid-cols-${columns} gap-2`
      : "flex flex-wrap gap-2";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {attribute.label}
      </label>
      <div className={gridClass}>
        {filteredOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onUpdate(opt.id)}
            className={`p-2 rounded-lg text-center text-xs transition-all ${
              value === opt.id
                ? "bg-rose-100 border-2 border-rose-400"
                : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
            }`}
          >
            {attribute.config.showImage && opt.image ? (
              <img
                src={opt.image}
                alt={opt.name}
                className="w-8 h-8 mx-auto mb-1 object-contain"
              />
            ) : null}
            <span>{opt.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ COLOR PICKER ============

function ColorPickerRenderer({
  attribute,
  value,
  options,
  onUpdate,
}: {
  attribute: AnyAttributeDefinition & { type: "color_picker" };
  value: string;
  options: OptionItem[];
  onUpdate: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {attribute.label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((color) => (
          <button
            key={color.id}
            onClick={() => onUpdate(color.id)}
            className={`w-8 h-8 rounded-full transition-all ${
              value === color.id
                ? "ring-2 ring-offset-2 ring-rose-500"
                : "hover:scale-110"
            }`}
            style={{ backgroundColor: color.hex ?? undefined }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
}

// ============ IMAGE PICKER (for accessories) ============

function ImagePickerRenderer({
  attribute,
  value,
  options,
  onUpdate,
}: {
  attribute: AnyAttributeDefinition & { type: "image_picker" };
  value: string[];
  options: OptionItem[];
  onUpdate: (value: string[]) => void;
}) {
  const selectedIds = value ?? [];
  const { multiple = false, maxItems = 3 } = attribute.config;

  const handleToggle = (optionId: string) => {
    if (multiple) {
      if (selectedIds.includes(optionId)) {
        onUpdate(selectedIds.filter((id) => id !== optionId));
      } else if (selectedIds.length < maxItems) {
        onUpdate([...selectedIds, optionId]);
      }
    } else {
      onUpdate(selectedIds.includes(optionId) ? [] : [optionId]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {attribute.label}
        {multiple && (
          <span className="text-gray-400 font-normal ml-1">
            ({selectedIds.length}/{maxItems})
          </span>
        )}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selectedIds.includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => handleToggle(opt.id)}
              className={`p-2 rounded-lg transition-all ${
                isSelected
                  ? "bg-rose-100 border-2 border-rose-400"
                  : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
              }`}
            >
              {opt.image ? (
                <img
                  src={opt.image}
                  alt={opt.name}
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <span className="text-xs">{opt.name}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
