import Link from "next/link";
import { Product } from "@/lib/types";
import { FallbackImage } from "./FallbackImage";
import { getDisplayPrice } from "@/lib/pricing";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const displayPrice = getDisplayPrice(product.price);

  return (
    <Link href={`/product/${product.slug}`} className="card-surface p-4 space-y-3">
      <div className="relative h-48 w-full aspect-[3/4] bg-[var(--bg-subtle)] rounded-lg overflow-hidden">
        <FallbackImage src={product.image} alt={product.title} fill className="object-cover" />
      </div>
      <div className="space-y-1">
        {product.subtitle ? <div className="text-sm text-[var(--text-muted)]">{product.subtitle}</div> : null}
        <div className="text-lg font-semibold text-[var(--text-primary)]">{product.title}</div>
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-[var(--text-secondary)]">
        <span className="inline-flex items-center rounded-full bg-[var(--bg-subtle)] px-2.5 py-1 border border-[#e1e7e3]">
          В наличии: {product.inStock ? "да" : "ожидается"}
        </span>
        <span className="inline-flex items-center rounded-full bg-[var(--bg-subtle)] px-2.5 py-1 border border-[#e1e7e3]">
          Цена: {displayPrice} ₽
        </span>
      </div>
    </Link>
  );
}

