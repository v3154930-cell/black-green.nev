import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, products } from "@/lib/data";
import type { CategorySlug } from "@/lib/types";
import { CatalogSearch } from "@/components/CatalogSearch";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default async function CategoryPage({ params }: { params: Promise<{ category: CategorySlug }> }) {
  const { category } = await params;
  const currentCategory = categories.find((c) => c.slug === category);
  
  // Return 404 for non-existent categories
  if (!currentCategory) {
    return notFound();
  }
  
  // Products are filtered in CatalogSearch component

  return (
    <div className="py-8 space-y-6">
      <Breadcrumbs items={[
        { label: "Каталог", href: "/catalog" },
        { label: currentCategory.title },
      ]} />
      
      <div className="space-y-2">
        <div className="eyebrow">Категория</div>
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">{currentCategory?.title ?? "Каталог"}</h1>
        <p className="text-[var(--text-secondary)]">{currentCategory?.description ?? "Ассортимент."}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/catalog" className="link-underline text-[var(--text-primary)]">
          Все
        </Link>
        {categories.map((cat) => (
          <Link 
            key={cat.slug} 
            href={`/catalog/${cat.slug}`} 
            className={`link-underline ${cat.slug === category ? "font-medium text-[var(--leaf)]" : "text-[var(--text-primary)]"}`}
          >
            {cat.title}
          </Link>
        ))}
      </div>

      {/* Поиск с фильтрацией по категории */}
      <CatalogSearch products={products} initialCategory={category} />
    </div>
  );
}
