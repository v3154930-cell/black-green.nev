import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  return (
    <Link href={`/product/${product.slug}`} className="card-surface p-4 space-y-3">
      <div className="relative h-40 w-full bg-[var(--bg-subtle)] rounded-lg overflow-hidden">
        <Image src={product.image} alt={product.title} fill className="object-cover" />
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
          Цена: {product.price.sitePrice.overridden ?? product.price.sitePrice.suggested} ₽
        </span>
      </div>
    </Link>
  );
}

