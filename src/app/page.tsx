import Link from "next/link";
import { categories, products, reviews, news } from "@/lib/data";
import { CategoryCard } from "@/components/CategoryCard";
import { FallbackImage } from "@/components/FallbackImage";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { TopBar } from "@/components/TopBar";
import { getDisplayPrice } from "@/lib/pricing";

function Section({ title, eyebrow, children }: { title: string; eyebrow?: string; children: React.ReactNode }) {
  return (
    <section className="section-gap">
      <div className="space-y-2">
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[var(--bg-subtle)] px-3 py-1 text-sm text-[var(--text-secondary)] border border-[#e1e7e3]">
      {children}
    </span>
  );
}

export default function Home() {
  const featuredGift = products.find((p) => p.type === "gift");

  return (
    <div className="py-6 sm:py-8 lg:py-10 space-y-10 sm:space-y-12">
      <TopBar />

      <Header />

      <Hero highlightImage="/images/hero-tea.jpg" />

      {/* 4 точки входа в каталог */}
      <Section title="Каталог" eyebrow="4 раздела">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.slug} {...category} />
          ))}
        </div>
      </Section>

      {/* Хиты / популярное - ОДИН товарный блок */}
      <Section title="Популярное" eyebrow="Хиты" >
        <div className="grid-cards">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </Section>

      {/* Подарки */}
      <Section title="Подарки" eyebrow="Готовые наборы">
        {featuredGift ? (
          <Link href={`/product/${featuredGift.slug}`} className="card-surface p-5 flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative h-48 w-full lg:w-80 aspect-[3/4] rounded-xl overflow-hidden bg-[var(--bg-subtle)]">
              <FallbackImage src={featuredGift.image} alt={featuredGift.title} fill className="object-cover" />
            </div>
            <div className="space-y-3 flex-1">
              <div className="eyebrow">Шубер + набор</div>
              <div className="text-2xl font-semibold text-[var(--text-primary)]">{featuredGift.title}</div>
              <p className="text-[var(--text-secondary)]">{featuredGift.description}</p>
              <div className="flex flex-wrap gap-2">
                {featuredGift.composition.map((item) => (
                  <Pill key={item}>{item}</Pill>
                ))}
              </div>
              <div className="text-sm text-[var(--text-muted)]">Цена: {getDisplayPrice(featuredGift.price)} ₽</div>
            </div>
          </Link>
        ) : (
          <div className="surface-subtle p-4 text-[var(--text-secondary)]">Нет готовых подарков, добавьте позже.</div>
        )}
      </Section>

      {/* Новости - компактный блок */}
      {news.length > 0 && (
        <Section title="Новости и руководства" eyebrow="Контент">
          <div className="grid gap-4 sm:grid-cols-2">
            {news.slice(0, 3).map((item) => (
              <Link key={item.slug} href={`/news/${item.slug}`} className="card-surface p-4 space-y-2 hover:shadow-md transition-shadow">
                <div className="text-sm text-[var(--text-muted)]">{item.date}</div>
                <div className="font-semibold text-[var(--text-primary)]">{item.title}</div>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{item.excerpt}</p>
              </Link>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/news" className="text-sm link-underline text-[var(--text-primary)]">
              Все публикации →
            </Link>
          </div>
        </Section>
      )}

      {/* Отзывы */}
      <Section title="Отзывы" eyebrow="Живые отклики">
        <div className="grid gap-4 sm:grid-cols-2">
          {reviews.map((review) => (
            <div key={review.id} className="card-surface p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-[var(--text-primary)]">{review.author}</div>
                <div className="text-sm text-[var(--text-secondary)]">★ {review.rating}</div>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">{review.text}</p>
              {review.productSlug ? (
                <Link href={`/product/${review.productSlug}`} className="text-sm link-underline text-[var(--text-primary)]">
                  К товару
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </Section>

      {/* Доставка / сервис */}
      <Section title="Доставка и сервис" eyebrow="Сервис">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { title: "Москва", text: "Курьером в день заказа, самовывоз — Чистые пруды." },
            { title: "Регионы", text: "СДЭК и Почта, аккуратная упаковка без лишнего пластика." },
          ].map((item) => (
            <div key={item.title} className="card-surface p-4 space-y-2">
              <div className="text-lg font-semibold text-[var(--text-primary)]">{item.title}</div>
              <p className="text-sm text-[var(--text-secondary)]">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Подвал */}
      <footer className="border-t border-[#e4e9e6] pt-6 pb-10 text-sm text-[var(--text-secondary)] flex flex-col gap-3 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-brand-ink text-white flex items-center justify-center font-semibold">BG</div>
          <div>
            <div className="font-semibold text-[var(--text-primary)]">Black Green New</div>
            <div className="text-xs text-[var(--text-muted)]">Новая витрина бренда Black-Green</div>
          </div>
        </div>
        <div className="flex gap-4">
          <Link href="/about" className="link-underline">О магазине</Link>
          <Link href="/contacts" className="link-underline">Контакты</Link>
          <Link href="/delivery" className="link-underline">Доставка</Link>
          <Link href="/news" className="link-underline">Журнал</Link>
        </div>
      </footer>
    </div>
  );
}
