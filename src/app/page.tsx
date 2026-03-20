import Image from "next/image";
import Link from "next/link";
import { categories, news, products, reviews } from "@/lib/data";
import { CategoryCard } from "@/components/CategoryCard";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { NewsCard } from "@/components/NewsCard";
import { ProductCard } from "@/components/ProductCard";
import { TopBar } from "@/components/TopBar";

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
  const featuredTea = products.find((p) => p.slug === "shou-puer-amber");
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

      {/* Хиты / популярное */}
      <Section title="Популярное" eyebrow="Хиты" >
        <div className="grid-cards">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </Section>

      {/* Скидки */}
      <Section title="Скидки" eyebrow="Акцент">
        <div className="surface-subtle p-5 rounded-2xl border border-[#dfe5e1] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-lg font-semibold text-[var(--text-primary)]">Мягкие скидки без распродажного шума</div>
            <p className="text-sm text-[var(--text-secondary)]">Точка входа для спокойного выбора: ультра-дешёвых товаров нет, скидки точечные.</p>
          </div>
          <Link href="/catalog?discounts=1" className="inline-flex items-center gap-2 rounded-xl bg-brand-leaf px-4 py-2 text-white shadow-soft">
            Посмотреть
          </Link>
        </div>
      </Section>

      {/* Подарки */}
      <Section title="Подарки" eyebrow="Готовые наборы">
        {featuredGift ? (
          <Link href={`/product/${featuredGift.slug}`} className="card-surface p-5 flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative h-44 w-full lg:w-72 rounded-xl overflow-hidden bg-[var(--bg-subtle)]">
              <Image src={featuredGift.image} alt={featuredGift.title} fill className="object-cover" />
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
              <div className="text-sm text-[var(--text-muted)]">Цена: {featuredGift.price.sitePrice.suggested} ₽</div>
            </div>
          </Link>
        ) : (
          <div className="surface-subtle p-4 text-[var(--text-secondary)]">Нет готовых подарков, добавьте позже.</div>
        )}
      </Section>

      {/* Новости */}
      <Section title="Новости" eyebrow="Контентный слой">
        <div className="grid gap-4 sm:grid-cols-2">
          {news.map((item) => (
            <NewsCard key={item.slug} item={item} />
          ))}
        </div>
      </Section>

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

      {/* Преимущества */}
      <Section title="Почему Black Green" eyebrow="Коротко">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Фреймированный layout", text: "Центральное полотно и локальные жёлтые акценты." },
            { title: "Карточки без шума", text: "Единый визуальный стиль: белый фон, нейтральные тени." },
            { title: "Контентный слой", text: "Новости и отзывы живут рядом с каталогом." },
          ].map((item) => (
            <div key={item.title} className="surface-subtle p-4 rounded-xl space-y-2">
              <div className="text-base font-semibold text-[var(--text-primary)]">{item.title}</div>
              <p className="text-sm text-[var(--text-secondary)]">{item.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* MAX / Telegram */}
      <Section title="Поддержка" eyebrow="MAX / Telegram">
        <div className="surface-subtle p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-lg font-semibold text-[var(--text-primary)]">Максимум обратной связи</div>
            <p className="text-sm text-[var(--text-secondary)]">Чат в Telegram и email-канал для быстрой модерации контента.</p>
          </div>
          <div className="flex gap-3">
            <Link href="https://t.me" className="inline-flex items-center gap-2 rounded-xl bg-brand-leaf px-4 py-2 text-white shadow-soft">
              Telegram
            </Link>
            <Link href="mailto:hello@blackgreen.ru" className="inline-flex items-center gap-2 rounded-xl border border-[#dfe5e1] bg-white px-4 py-2 text-[var(--text-primary)]">
              Email
            </Link>
          </div>
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
          <Link href="/news" className="link-underline">Новости</Link>
        </div>
      </footer>
    </div>
  );
}
