const PHONE = "+7 (495) 123-45-67";
const MAX = "https://getmax.io/blackgreen";
const TELEGRAM = "https://t.me/blackgreen";

export function TopBar() {
  return (
    <div className="text-sm text-[var(--text-secondary)] flex items-center justify-between border-b border-[#e4e9e6] pb-3">
      <div className="flex items-center gap-4">
        <span>Доставка по Москве в день заказа</span>
        <span className="hidden sm:inline">Самовывоз: Чистые пруды</span>
      </div>
      <div className="flex items-center gap-4">
        {/* Phone */}
        <a 
          href={`tel:${PHONE.replace(/[^0-9+]/g, '')}`} 
          className="text-[var(--text-primary)] hover:text-brand-leaf transition-colors"
        >
          {PHONE}
        </a>
        {/* MAX - главный канал */}
        <a 
          href={MAX} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[var(--text-primary)] hover:text-brand-leaf transition-colors font-medium"
          aria-label="MAX"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          MAX
        </a>
        {/* Telegram - вторичный канал */}
        <a 
          href={TELEGRAM} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-brand-leaf transition-colors hidden sm:inline-flex"
          aria-label="Telegram"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m21.2 2.8-2.1 9.8c-.2.9-.7 1.7-1.4 2.1-1.1.7-2.5.6-3.5-.1l-2-1.4-2 1.4c-.6.4-1.4.5-2.1.2-.7-.3-1.2-.9-1.4-1.7l-.2-.9-9.8 2.1c-.9.2-1.7.7-2.2 1.4-.7 1.1-.6 2.5.1 3.5l1.4 2 1.4-2c.4-.6.5-1.4.2-2.1-.3-.7-.9-1.2-1.7-1.4l-.9-.2 2.1-9.8c.2-.9.7-1.7 1.4-2.2 1.1-.7 2.5-.6 3.5.1l2 1.4 2-1.4c.6-.4 1.4-.5 2.1-.2.7.3 1.2.9 1.4 1.7l.2.9 9.8-2.1c.9-.2 1.7-.7 2.2-1.4.7-1.1.6-2.5-.1-3.5l-1.4-2-1.4 2c-.4.6-.5 1.4-.2 2.1.3.7.9 1.2 1.7 1.4l.9.2z"/>
          </svg>
          Telegram
        </a>
      </div>
    </div>
  );
}

