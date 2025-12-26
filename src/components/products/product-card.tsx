import Link from "next/link";

interface ProductCardProps {
  handle: string;
  title: string;
  thumbnail: string | null;
  productType: string;
}

export function ProductCard({
  handle,
  title,
  thumbnail,
  productType,
}: ProductCardProps) {
  return (
    <Link
      href={`/product/${handle}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl opacity-30">
              {productType === "mug" ? "☕" : "👕"}
            </div>
          </div>
        )}

        {/* Product type badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full capitalize">
          {productType}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-rose-600 transition-colors line-clamp-2 text-sm">
          {title}
        </h3>

        {/* CTA */}
        <div className="mt-3">
          <span className="inline-block text-xs font-medium text-rose-600 group-hover:text-rose-700 transition-colors">
            Customize Now →
          </span>
        </div>
      </div>
    </Link>
  );
}
