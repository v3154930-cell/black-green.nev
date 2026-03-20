import Link from "next/link";

const links = [
  { href: "/admin/moderation", label: "Модерация товаров", desc: "Очереди ready / review / incoming / rework" },
  { href: "/admin/content", label: "Контент", desc: "Черновики новостей и ответы на отзывы" },
  { href: "/admin/products/preview", label: "Карточка товара (skeleton)", desc: "Превью без логики" },
];

export default function AdminHomePage() {
  return (
    <div className="py-8 space-y-6">
      <div className="space-y-2">
        <div className="eyebrow">Админка</div>
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Администрирование Black Green</h1>
        <p className="text-[var(--text-secondary)]">
          Моковый skeleton: модерация, контент, карточки товаров. Навигация по разделам и быстрые ярлыки.
        </p>
      </div>
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
      <div className="grid gap-3 sm:grid-cols-3">
        {[{ label: "Очередь модерации", value: "5" }, { label: "Черновики контента", value: "2" }, { label: "Нужны правки", value: "1" }].map(
          (item) => (
            <div key={item.label} className="surface-subtle p-4 rounded-xl border border-[#e4e9e6] space-y-1">
              <div className="text-sm text-[var(--text-muted)]">{item.label}</div>
              <div className="text-2xl font-semibold text-[var(--text-primary)]">{item.value}</div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

