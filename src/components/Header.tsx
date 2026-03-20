"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems: { label: string; href: string }[] = [
  { label: "Каталог", href: "/catalog" },
  { label: "Журнал", href: "/news" },
  { label: "Отзывы", href: "/reviews" },
  { label: "Доставка и оплата", href: "/delivery" },
  { label: "Контакты", href: "/contacts" },
  { label: "О магазине", href: "/about" },
];

export function Header() {
  const pathname = usePathname();

  // Проверяем, является ли текущий путь активным
  const isActive = (href: string) => {
    if (href === "/catalog") {
      // Каталог активен на /catalog и /catalog/*
      return pathname === "/catalog" || pathname.startsWith("/catalog/");
    }
    return pathname === href;
  };

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
      <nav className="flex flex-wrap gap-3 text-sm sm:text-base">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`link-underline px-1 py-0.5 ${
              isActive(item.href)
                ? "text-[var(--leaf)] font-medium"
                : "text-[var(--text-primary)]"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

