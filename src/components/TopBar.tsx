import Image from "next/image";

const PHONE = "+7 (495) 123-45-67";
const MAX = "https://getmax.io/blackgreen";
const TELEGRAM = "https://t.me/blackgreen";

export function TopBar() {
  return (
    <div className="text-sm text-[var(--text-secondary)] flex items-center justify-between border-b border-[#e4e9e6] pb-3">
      <div className="flex items-center gap-6">
        <a 
          href="/delivery" 
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-brand-leaf transition-colors font-medium"
        >
          <Image
            src="/images/brand/hero/icons/header/05-delivery.png"
            alt=""
            width={48}
            height={44}
            className="w-[48px] h-[44px]"
          />
          Доставка
        </a>
        <span className="text-[var(--text-muted)]">·</span>
        <span className="text-[var(--text-secondary)] hover:text-brand-leaf transition-colors font-medium cursor-pointer">
          Личный кабинет
        </span>
      </div>
      <div className="flex items-center gap-6">
        <a 
          href={`tel:${PHONE.replace(/[^0-9+]/g, '')}`} 
          className="flex items-center gap-2 text-[var(--text-secondary)] font-medium hover:text-brand-leaf transition-colors"
        >
          <Image
            src="/images/brand/hero/icons/header/04-phone.png"
            alt=""
            width={48}
            height={44}
            className="w-[48px] h-[44px]"
          />
          {PHONE}
        </a>
        <span className="text-[var(--text-muted)]">·</span>
        <a 
          href={MAX} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-brand-leaf transition-colors font-medium"
          aria-label="MAX"
        >
          <Image
            src="/images/brand/hero/icons/header/01-max.png"
            alt=""
            width={48}
            height={44}
            className="w-[48px] h-[44px]"
          />
          MAX
        </a>
        <a 
          href={TELEGRAM} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-brand-leaf transition-colors font-medium"
          aria-label="Telegram"
        >
          <Image
            src="/images/brand/hero/icons/header/02-telegram.png"
            alt=""
            width={48}
            height={44}
            className="w-[48px] h-[44px]"
          />
          Telegram
        </a>
        <a 
          href="/cart"
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-brand-leaf transition-colors font-medium"
          aria-label="Корзина"
        >
          <Image
            src="/images/brand/hero/icons/header/03-cart.png"
            alt=""
            width={48}
            height={44}
            className="w-[48px] h-[44px]"
          />
          <span>0 товаров · 0 ₽</span>
        </a>
      </div>
    </div>
  );
}
