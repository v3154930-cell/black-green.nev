import Link from "next/link";
import { categories, products } from "@/lib/data";

export default function CatalogPage() {
  const items = products;

  return (
    <div className="py-8 space-y-8">
      <div className="space-y-2">
        <div className="eyebrow">Каталог</div>
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Ассортимент Black Green</h1>
        <p className="text-[var(--text-secondary)]">Чай, чайные напитки, посуда и подарки — аккуратные карточки, без визуального шума.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <Link key={cat.slug} href={`/catalog/${cat.slug}`} className="link-underline text-[var(--text-primary)]">
            {cat.title}
          </Link>
        ))}
      </div>

      <div className="grid-cards">
        {items.map((item) => (
          <Link key={item.slug} href={`/product/${item.slug}`} className="card-surface p-4 space-y-3">
            <div className="text-sm text-[var(--text-muted)]">{item.subtitle}</div>
            <div className="text-lg font-semibold text-[var(--text-primary)]">{item.title}</div>
            <div className="text-sm text-[var(--text-secondary)]">{item.description}</div>
            <div className="text-sm text-[var(--text-muted)]">Цена: {item.price.sitePrice.overridden ?? item.price.sitePrice.suggested} ₽</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
