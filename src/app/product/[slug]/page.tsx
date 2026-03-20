import { notFound } from "next/navigation";
import { products, categories } from "@/lib/data";
import type { Product } from "@/lib/types";
import { getDisplayPrice, getUnitLabel } from "@/lib/pricing";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FallbackImage } from "@/components/FallbackImage";
import Link from "next/link";

function PriceBlock({ product }: { product: Product }) {
  const price = getDisplayPrice(product.price);
  const unit = getUnitLabel(product.price.packaging.unitType);

  return (
    <div className="card-surface p-4 space-y-3">
      <div className="text-sm text-[var(--text-muted)]">Цена сайта</div>
      <div className="text-2xl font-semibold text-[var(--text-primary)]">{price} ₽</div>
      <div className="text-sm text-[var(--text-secondary)]">{product.inStock ? "В наличии" : "Ожидается"}</div>
      {product.price.packaging.unitType === "weight" && product.price.packaging.weightOptions ? (
        <div className="flex flex-wrap gap-2 text-sm text-[var(--text-secondary)]">
          {product.price.packaging.weightOptions.map((g) => (
            <span key={g} className="surface-subtle px-3 py-1 rounded-full">{g} {unit}</span>
          ))}
        </div>
      ) : null}
      <button className="w-full inline-flex items-center justify-center rounded-xl bg-brand-ink px-4 py-2 text-white shadow-soft">
        Добавить в корзину
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h2>
      <div className="text-sm text-[var(--text-secondary)] space-y-2">{children}</div>
    </section>
  );
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return notFound();
  
  const category = categories.find((c) => c.slug === product.category);

  return (
    <div className="py-8 space-y-6">
      <Breadcrumbs items={[
        { label: "Каталог", href: "/catalog" },
        { label: category?.title ?? product.category, href: `/catalog/${product.category}` },
        { label: product.title },
      ]} />
      
      {/* Back to catalog link */}
      <Link 
        href={`/catalog/${product.category}`} 
        className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-brand-leaf transition-colors"
      >
        ← Назад в каталог
      </Link>
      
      <div className="space-y-2">
        <div className="eyebrow">{product.category}</div>
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">{product.title}</h1>
        {product.subtitle ? <p className="text-[var(--text-secondary)]">{product.subtitle}</p> : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="card-surface p-4 space-y-4">
          <div className="relative w-full aspect-[3/4] h-auto min-h-[320px] rounded-xl overflow-hidden bg-[var(--bg-subtle)]">
            <FallbackImage src={product.image} alt={product.title} fill className="object-cover" />
          </div>
          <Section title="Описание">
            <p>{product.description}</p>
          </Section>
          {product.type === "tea" ? (
            <div className="space-y-4">
              <Section title="Вкус и аромат">
                <p>{product.flavor}</p>
                <p>{product.aroma}</p>
              </Section>
              <Section title="Как заваривать">
                <p>{product.brew}</p>
              </Section>
              <Section title="Кому подойдёт">
                <p>{product.fits}</p>
              </Section>
            </div>
          ) : null}
          {product.type === "teaware" ? (
            <div className="space-y-4">
              <Section title="Материал">
                <p>{product.material}</p>
              </Section>
              <Section title="Назначение">
                <p>{product.purpose}</p>
              </Section>
              <Section title="Уход">
                <p>{product.care}</p>
              </Section>
            </div>
          ) : null}
          {product.type === "gift" ? (
            <div className="space-y-4">
              <Section title="Состав">
                <ul className="list-disc pl-5 space-y-1">
                  {product.composition.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </Section>
              <Section title="Оформление">
                <p>{product.packaging}</p>
              </Section>
              <Section title="Для кого / повод">
                <p>{product.forWhom}</p>
              </Section>
            </div>
          ) : null}
          <Section title="Отзывы">
            <p className="text-[var(--text-muted)]">Место под отзывы о товаре. Добавить позже.</p>
          </Section>
          <Section title="Похожие товары">
            <p className="text-[var(--text-muted)]">Скелетон блока похожих товаров.</p>
          </Section>
        </div>
        <PriceBlock product={product} />
      </div>
    </div>
  );
}
