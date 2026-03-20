export default function DeliveryPage() {
  return (
    <div className="py-8 space-y-4">
      <div className="eyebrow">Доставка и оплата</div>
      <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Доставка и сервис</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card-surface p-4 space-y-2">
          <div className="text-lg font-semibold text-[var(--text-primary)]">Москва</div>
          <p className="text-sm text-[var(--text-secondary)]">Курьером в день заказа. Самовывоз — Чистые пруды.</p>
        </div>
        <div className="card-surface p-4 space-y-2">
          <div className="text-lg font-semibold text-[var(--text-primary)]">Регионы</div>
          <p className="text-sm text-[var(--text-secondary)]">СДЭК и Почта, без лишнего пластика, аккуратные шуберы для подарков.</p>
        </div>
      </div>
      <div className="surface-subtle p-4 rounded-xl space-y-2 max-w-3xl">
        <div className="text-base font-semibold text-[var(--text-primary)]">Оплата</div>
        <p className="text-sm text-[var(--text-secondary)]">Карты, СБП. Приём наличных при самовывозе. Возвраты по закону о ЗПП.</p>
      </div>
    </div>
  );
}

