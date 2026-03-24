"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems: { label: string; href: string }[] = [
  { label: "Каталог", href: "/catalog" },
  { label: "Чайные новости", href: "/news" },
  { label: "Отзывы", href: "/reviews" },
  { label: "Доставка и оплата", href: "/delivery" },
  { label: "Контакты", href: "/contacts" },
  { label: "О магазине", href: "/about" },
];

export function Header() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/catalog") {
      return pathname === "/catalog" || pathname.startsWith("/catalog/");
    }
    return pathname === href;
  };

  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-[#0f2d22] py-3 px-8 rounded-xl">
      <div className="flex items-center gap-3">
        <Image
          src="/images/brand/logo-main.png"
          alt="Black Green New"
          width={100}
          height={32}
          className="h-8 w-auto"
        />
        <div className="hidden sm:block">
          <div className="text-sm text-white/70 leading-tight">Современный чайный магазин</div>
        </div>
      </div>
      <nav className="flex flex-wrap gap-4 text-sm sm:text-base">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-1 py-0.5 ${
              isActive(item.href)
                ? "text-white font-semibold"
                : "text-white/80 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

