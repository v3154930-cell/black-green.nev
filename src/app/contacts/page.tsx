export default function ContactsPage() {
  return (
    <div className="py-8 space-y-4">
      <div className="eyebrow">Контакты</div>
      <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Связаться с Black Green</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card-surface p-4 space-y-2">
          <div className="text-lg font-semibold text-[var(--text-primary)]">Магазин</div>
          <p className="text-sm text-[var(--text-secondary)]">Москва, Чистые пруды. Самовывоз по договорённости.</p>
        </div>
        <div className="card-surface p-4 space-y-2">
          <div className="text-lg font-semibold text-[var(--text-primary)]">Коммуникации</div>
          <p className="text-sm text-[var(--text-secondary)]">hello@blackgreen.ru</p>
          <p className="text-sm text-[var(--text-secondary)]">Telegram: t.me/blackgreen</p>
        </div>
      </div>
    </div>
  );
}
