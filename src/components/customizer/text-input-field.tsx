"use client";

interface TextInputFieldProps {
  label: string;
  description?: string | null;
  value: string;
  onChange: (value: string) => void;
  config: {
    placeholder?: string;
    maxLength?: number;
    showCharCount?: boolean;
    defaultValue?: string;
  };
  required?: boolean;
}

export function TextInputField({
  label,
  description,
  value,
  onChange,
  config,
  required,
}: TextInputFieldProps) {
  const currentValue = value ?? config.defaultValue ?? "";

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

      <div className="relative">
        <input
          type="text"
          value={currentValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={config.placeholder}
          maxLength={config.maxLength}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white"
        />
        {config.showCharCount && config.maxLength && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            {currentValue.length}/{config.maxLength}
          </span>
        )}
      </div>
    </div>
  );
}
