import Link from "next/link";
import { categories, products } from "@/lib/data";
import type { CategorySlug } from "@/lib/types";

export default function CategoryPage({ params }: { params: { category: CategorySlug } }) {
  const currentCategory = categories.find((c) => c.slug === params.category);
  const items = products.filter((p) => p.category === params.category);

  return (
    <div className="py-8 space-y-8">
      <div className="space-y-2">
        <div className="eyebrow">Категория</div>
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">{currentCategory?.title ?? "Каталог"}</h1>
        <p className="text-[var(--text-secondary)]">{currentCategory?.description ?? "Ассортимент."}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <Link key={cat.slug} href={`/catalog/${cat.slug}`} className="link-underline text-[var(--text-primary)]">
            {cat.title}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="surface-subtle p-4 text-[var(--text-secondary)]">Нет товаров в этой категории.</div>
      ) : (
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
      )}
    </div>
  );
}
