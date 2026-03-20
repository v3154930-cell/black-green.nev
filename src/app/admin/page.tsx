import Link from "next/link";
import { adminModeration, adminContentDrafts, products } from "@/lib/data";
import { getDisplayPrice, getMargin } from "@/lib/pricing";

const links = [
  { href: "/admin/moderation", label: "Модерация товаров", desc: "new → review → published" },
  { href: "/admin/content", label: "Контент Журнала", desc: "Черновики, проверка, публикация" },
];

// Подсчёт статистики
const moderationStats = {
  new: adminModeration.filter((i) => i.status === "new").length,
  review: adminModeration.filter((i) => i.status === "review").length,
  published: adminModeration.filter((i) => i.status === "published").length,
  total: adminModeration.length,
};

const contentStats = {
  draft: adminContentDrafts.filter((d) => d.status === "draft").length,
  needsReview: adminContentDrafts.filter((d) => d.status === "needs-review").length,
  needsFix: adminContentDrafts.filter((d) => d.status === "needs-fix").length,
};

const publishedProducts = products.length;

// Pricing issues - items with low margin or errors
const pricingIssues = products.filter((p) => {
  const margin = getMargin(p.price);
  return margin < 30;
}).length;

export default function AdminHomePage() {
  return (
    <div className="py-8 space-y-6">
      <div className="space-y-2">
        <div className="eyebrow">Админка</div>
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Панель управления</h1>
        <p className="text-[var(--text-secondary)]">
          Обзор состояния магазина: модерация, контент, опубликованные товары.
        </p>
      </div>

      {/* Navigation Links */}
      <div className="grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="card-surface p-4 flex flex-col gap-1 border border-[#e4e9e6] hover:border-brand-leaf"
          >
            <span className="text-[var(--text-primary)] font-medium">{link.label}</span>
            <span className="text-sm text-[var(--text-muted)]">{link.desc}</span>
          </Link>
        ))}
      </div>

      {/* Summary Blocks */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Товары на модерации */}
        <Link
          href="/admin/moderation"
          className="card-surface p-4 rounded-xl border border-[#e4e9e6] hover:border-brand-leaf space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm text-[var(--text-muted)]">На модерации</div>
            <span className="text-xs px-2 py-0.5 bg-brand-leaf/10 text-brand-leaf rounded">new</span>
          </div>
          <div className="text-3xl font-semibold text-[var(--text-primary)]">{moderationStats.new}</div>
          <div className="text-xs text-[var(--text-muted)]">
            {moderationStats.review} на проверке / {moderationStats.total} всего
          </div>
        </Link>

        {/* Опубликованные товары */}
        <div className="card-surface p-4 rounded-xl border border-[#e4e9e6] space-y-2">
          <div className="text-sm text-[var(--text-muted)]">Опубликованные</div>
          <div className="text-3xl font-semibold text-[var(--text-primary)]">{publishedProducts}</div>
          <div className="text-xs text-[var(--text-muted)]">товаров в каталоге</div>
        </div>

        {/* Материалы Журнала */}
        <Link
          href="/admin/content"
          className="card-surface p-4 rounded-xl border border-[#e4e9e6] hover:border-brand-leaf space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="text-sm text-[var(--text-muted)]">Контент Журнала</div>
            <span className="text-xs px-2 py-0.5 bg-brand-ink/10 text-brand-ink rounded">draft</span>
          </div>
          <div className="text-3xl font-semibold text-[var(--text-primary)]">{contentStats.draft}</div>
          <div className="text-xs text-[var(--text-muted)]">
            {contentStats.needsReview} на проверке / {contentStats.needsFix} правок
          </div>
        </Link>

        {/* Требует проверки / проблемные */}
        <div className="card-surface p-4 rounded-xl border border-[#e4e9e6] space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm text-[var(--text-muted)]">Требует проверки</div>
            <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded">attention</span>
          </div>
          <div className="text-3xl font-semibold text-[var(--text-primary)]">{pricingIssues}</div>
          <div className="text-xs text-[var(--text-muted)]">позиций с низкой наценкой</div>
        </div>
      </div>
    </div>
  );
}

