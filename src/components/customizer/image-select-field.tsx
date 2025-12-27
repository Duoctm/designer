"use client";

interface FieldOption {
  id: string;
  label: string | null;
  image: string;
  colorHex?: string | null;
}

interface ImageSelectFieldProps {
  label: string;
  description?: string | null;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  options: FieldOption[];
  config: {
    columns?: number;
    multiple?: boolean;
    minSelect?: number;
    maxSelect?: number;
  };
  required?: boolean;
  fieldKey?: string;
}

export function ImageSelectField({
  label,
  description,
  value,
  onChange,
  options,
  config,
  required,
  fieldKey,
}: ImageSelectFieldProps) {
  const { columns = 5, multiple = false, maxSelect = 1 } = config;
  const selectedIds = Array.isArray(value) ? value : value ? [value] : [];
  const isFlagField = fieldKey === "flag";

  const handleSelect = (optionId: string) => {
    if (multiple) {
      if (selectedIds.includes(optionId)) {
        onChange(selectedIds.filter((id) => id !== optionId));
      } else if (selectedIds.length < maxSelect) {
        onChange([...selectedIds, optionId]);
      }
    } else {
      onChange(optionId);
    }
  };

  const isSelected = (optionId: string) => selectedIds.includes(optionId);
  const isLargeView = options.length <= 2; // Large view for flag selector

  return (
    <div className="space-y-3">
      <div>
        <span className="text-sm font-semibold text-gray-900">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </span>
        {description && (
          <span className="text-xs text-gray-500 italic ml-2">
            {description}
          </span>
        )}
      </div>

      <div
        className={isFlagField ? "flex gap-3" : "grid gap-3"}
        style={
          !isFlagField
            ? {
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              }
            : undefined
        }
      >
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => handleSelect(option.id)}
            className={`relative rounded-xl overflow-hidden border-2 transition-all ${
              isFlagField ? "w-32 h-20" : "aspect-square"
            } ${
              isLargeView && !isFlagField ? "min-h-32" : ""
            } ${
              isSelected(option.id)
                ? "border-green-500 ring-2 ring-green-500/20"
                : "border-gray-100 hover:border-gray-300"
            }`}
          >
            {/* Checkmark */}
            {isSelected(option.id) && (
              <div className="absolute top-1 left-1 w-5 h-5 bg-green-500 rounded flex items-center justify-center z-10">
                <svg
                  className="w-3 h-3 text-white"
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

            {/* Image or Color */}
            {option.colorHex ? (
              <div
                className="w-full h-full"
                style={{ backgroundColor: option.colorHex }}
              />
            ) : (
              <img
                src={option.image}
                alt={option.label ?? "Option image"}
                className="w-full h-full object-cover"
              />
            )}

            {/* Label - below image with dark text */}
            {option.label && (
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 px-1 py-0.5">
                <span className="text-[10px] text-gray-700 font-medium truncate block text-center">
                  {option.label}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
