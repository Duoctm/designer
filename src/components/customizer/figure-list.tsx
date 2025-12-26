"use client";

import type { ChibiFigure } from "@/types";

interface FigureListProps {
  figures: ChibiFigure[];
  selectedFigureId: string | null;
  onSelectFigure: (figureId: string) => void;
  onAddFigure: () => void;
  onRemoveFigure: (figureId: string) => void;
  maxFigures: number;
}

export function FigureList({
  figures,
  selectedFigureId,
  onSelectFigure,
  onAddFigure,
  onRemoveFigure,
  maxFigures,
}: FigureListProps) {
  const canAddMore = figures.length < maxFigures;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">
          Characters ({figures.length}/{maxFigures})
        </h3>
        {canAddMore && (
          <button
            onClick={onAddFigure}
            className="text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors flex items-center gap-1"
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
            Add
          </button>
        )}
      </div>

      <div className="space-y-2">
        {figures.map((figure, index) => (
          <div
            key={figure.id}
            onClick={() => onSelectFigure(figure.id)}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
              selectedFigureId === figure.id
                ? "bg-rose-50 border-2 border-rose-300"
                : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
            }`}
          >
            {/* Avatar placeholder */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-lg">
              {figure.bodyId.includes("female") ? "👩" : "👨"}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {figure.name || `Character ${index + 1}`}
              </div>
              <div className="text-xs text-gray-500">Click to edit</div>
            </div>

            {/* Remove button */}
            {figures.length > 2 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFigure(figure.id);
                }}
                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
