import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#e4e9e6] pt-6 pb-10 text-sm text-[var(--text-secondary)] flex flex-col gap-3 sm:flex-row sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-brand-ink text-white flex items-center justify-center font-semibold">BG</div>
        <div>
          <div className="font-semibold text-[var(--text-primary)]">Black Green New</div>
          <div className="text-xs text-[var(--text-muted)]">Новая витрина бренда Black-Green</div>
        </div>
      </div>
      <div className="flex gap-4">
        <Link href="/about" className="link-underline">
          О магазине
        </Link>
        <Link href="/contacts" className="link-underline">
          Контакты
        </Link>
        <Link href="/delivery" className="link-underline">
          Доставка
        </Link>
        <Link href="/news" className="link-underline">
          Журнал
        </Link>
      </div>
    </footer>
  );
}

