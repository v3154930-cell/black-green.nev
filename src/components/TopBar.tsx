import Link from "next/link";

export function TopBar() {
  return (
    <div className="text-sm text-[var(--text-secondary)] flex items-center justify-between border-b border-[#e4e9e6] pb-3">
      <div className="flex items-center gap-4">
        <span>Доставка по Москве в день заказа</span>
        <span className="hidden sm:inline">Самовывоз: Чистые пруды</span>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/delivery" className="link-underline text-[var(--text-primary)]">
          Доставка и оплата
        </Link>
        <Link href="/contacts" className="link-underline text-[var(--text-primary)]">
          Контакты
        </Link>
      </div>
    </div>
  );
}

