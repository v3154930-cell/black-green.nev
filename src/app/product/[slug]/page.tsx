import { notFound } from "next/navigation";
import { products } from "@/lib/data";
import type { Product } from "@/lib/types";

function PriceBlock({ product }: { product: Product }) {
  const price = product.price.sitePrice.overridden ?? product.price.sitePrice.suggested;
  const unit = product.price.packaging.unitLabel ?? (product.type === "tea" ? "г" : "шт");

  return (
    <div className="card-surface p-4 space-y-3">
      <div className="text-sm text-[var(--text-muted)]">Цена сайта</div>
      <div className="text-2xl font-semibold text-[var(--text-primary)]">{price} ₽</div>
      <div className="text-sm text-[var(--text-secondary)]">{product.inStock ? "В наличии" : "Ожидается"}</div>
      {product.type === "tea" && product.price.packaging.gramsOptions ? (
        <div className="flex flex-wrap gap-2 text-sm text-[var(--text-secondary)]">
          {product.price.packaging.gramsOptions.map((g) => (
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

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) return notFound();

  return (
    <div className="py-8 space-y-8">
      <div className="space-y-2">
        <div className="eyebrow">{product.category}</div>
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">{product.title}</h1>
        {product.subtitle ? <p className="text-[var(--text-secondary)]">{product.subtitle}</p> : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="card-surface p-4 space-y-4">
          <div className="relative w-full h-72 rounded-xl bg-[var(--bg-subtle)]" />
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
