import Link from "next/link";
import { categories, products } from "@/lib/data";
import { CatalogSearch } from "@/components/CatalogSearch";

export default function CatalogPage() {
  return (
    <div className="py-8 space-y-8">
      <div className="space-y-2">
        <div className="eyebrow">Каталог</div>
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Ассортимент Black Green</h1>
        <p className="text-[var(--text-secondary)]">Чай, чайные напитки, посуда и подарки — аккуратные карточки, без визуального шума.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/catalog" className="link-underline text-[var(--text-primary)] font-medium">
          Все
        </Link>
        {categories.map((cat) => (
          <Link key={cat.slug} href={`/catalog/${cat.slug}`} className="link-underline text-[var(--text-primary)]">
            {cat.title}
          </Link>
        ))}
      </div>

      {/* Поиск и результаты */}
      <CatalogSearch products={products} />
    </div>
  );
}
