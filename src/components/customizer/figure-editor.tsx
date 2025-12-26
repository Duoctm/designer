"use client";

import type {
  ChibiFigure,
  ChibiBody,
  ChibiHair,
  ChibiOutfit,
  ColorPreset,
} from "@/types";

interface FigureEditorProps {
  figure: ChibiFigure;
  bodies: ChibiBody[];
  hairs: ChibiHair[];
  outfits: ChibiOutfit[];
  skinColors: ColorPreset[];
  hairColors: ColorPreset[];
  outfitColors: ColorPreset[];
  onUpdate: (updates: Partial<ChibiFigure>) => void;
}

export function FigureEditor({
  figure,
  bodies,
  hairs,
  outfits,
  skinColors,
  hairColors,
  outfitColors,
  onUpdate,
}: FigureEditorProps) {
  const selectedBody = bodies.find((b) => b.id === figure.bodyId);
  const filteredHairs = hairs.filter(
    (h) =>
      !h.forGender || h.forGender.includes(selectedBody?.gender ?? "unisex")
  );
  const filteredOutfits = outfits.filter(
    (o) =>
      !o.forGender || o.forGender.includes(selectedBody?.gender ?? "unisex")
  );

  return (
    <div className="space-y-6">
      {/* Name input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name
        </label>
        <input
          type="text"
          value={figure.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="Enter name"
          maxLength={15}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
        />
      </div>

      {/* Body type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Body Type
        </label>
        <div className="flex gap-2">
          {bodies.map((body) => (
            <button
              key={body.id}
              onClick={() => onUpdate({ bodyId: body.id })}
              className={`flex-1 p-3 rounded-lg text-center transition-all ${
                figure.bodyId === body.id
                  ? "bg-rose-100 border-2 border-rose-400"
                  : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
              }`}
            >
              <div className="text-2xl mb-1">
                {body.gender === "female"
                  ? "👩"
                  : body.gender === "male"
                  ? "👨"
                  : "👶"}
              </div>
              <div className="text-xs font-medium">{body.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Hair style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hair Style
        </label>
        <div className="grid grid-cols-3 gap-2">
          {filteredHairs.map((hair) => (
            <button
              key={hair.id}
              onClick={() => onUpdate({ hairId: hair.id })}
              className={`p-2 rounded-lg text-center text-xs transition-all ${
                figure.hairId === hair.id
                  ? "bg-rose-100 border-2 border-rose-400"
                  : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
              }`}
            >
              {hair.name}
            </button>
          ))}
        </div>
      </div>

      {/* Outfit */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Outfit
        </label>
        <div className="grid grid-cols-2 gap-2">
          {filteredOutfits.map((outfit) => (
            <button
              key={outfit.id}
              onClick={() => onUpdate({ outfitId: outfit.id })}
              className={`p-2 rounded-lg text-center text-xs transition-all ${
                figure.outfitId === outfit.id
                  ? "bg-rose-100 border-2 border-rose-400"
                  : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
              }`}
            >
              {outfit.name}
            </button>
          ))}
        </div>
      </div>

      {/* Skin color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skin Tone
        </label>
        <div className="flex gap-2">
          {skinColors.map((color) => (
            <button
              key={color.id}
              onClick={() => onUpdate({ skinColorId: color.id })}
              className={`w-8 h-8 rounded-full transition-all ${
                figure.skinColorId === color.id
                  ? "ring-2 ring-offset-2 ring-rose-500"
                  : "hover:scale-110"
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Hair color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hair Color
        </label>
        <div className="flex gap-2">
          {hairColors.map((color) => (
            <button
              key={color.id}
              onClick={() => onUpdate({ hairColorId: color.id })}
              className={`w-8 h-8 rounded-full transition-all ${
                figure.hairColorId === color.id
                  ? "ring-2 ring-offset-2 ring-rose-500"
                  : "hover:scale-110"
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Outfit color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Outfit Color
        </label>
        <div className="flex flex-wrap gap-2">
          {outfitColors.map((color) => (
            <button
              key={color.id}
              onClick={() => onUpdate({ outfitColorId: color.id })}
              className={`w-8 h-8 rounded-full transition-all ${
                figure.outfitColorId === color.id
                  ? "ring-2 ring-offset-2 ring-rose-500"
                  : "hover:scale-110"
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
