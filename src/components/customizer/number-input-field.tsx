"use client";

interface NumberInputFieldProps {
  label: string;
  description?: string | null;
  value: number;
  onChange: (value: number) => void;
  config: {
    min?: number;
    max?: number;
    default?: number;
    step?: number;
  };
  required?: boolean;
}

export function NumberInputField({
  label,
  description,
  value,
  onChange,
  config,
  required,
}: NumberInputFieldProps) {
  const { min = 1, max = 10, step = 1 } = config;
  const currentValue = value ?? config.default ?? min;

  const handleDecrement = () => {
    if (currentValue > min) {
      onChange(currentValue - step);
    }
  };

  const handleIncrement = () => {
    if (currentValue < max) {
      onChange(currentValue + step);
    }
  };

  return (
    <div className="space-y-2">
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

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={currentValue <= min}
          className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
              d="M20 12H4"
            />
          </svg>
        </button>

        <span className="w-12 text-center text-lg font-semibold text-gray-900">
          {currentValue}
        </span>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={currentValue >= max}
          className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
