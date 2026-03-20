import Link from "next/link";

const navItems: { label: string; href: string }[] = [
  { label: "Каталог", href: "/catalog" },
  { label: "Скидки", href: "/catalog?discounts=1" },
  { label: "Отзывы", href: "/reviews" },
  { label: "Доставка и оплата", href: "/delivery" },
  { label: "Контакты", href: "/contacts" },
  { label: "О магазине", href: "/about" },
];

export function Header() {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-brand-leaf text-white flex items-center justify-center font-semibold text-lg shadow-soft">
          BG
        </div>
        <div>
          <div className="text-lg font-semibold text-[var(--text-primary)]">Black Green New</div>
          <div className="text-sm text-[var(--text-muted)]">Современный чайный магазин</div>
        </div>
      </div>
      <nav className="flex flex-wrap gap-3 text-sm sm:text-base text-[var(--text-primary)]">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="link-underline px-1 py-0.5">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

