import { adminModeration } from "@/lib/data";

const queueLabels: Record<(typeof adminModeration)[number]["queue"], string> = {
  ready: "Готово к утверждению",
  review: "Требует проверки",
  incoming: "Товар ожидается",
  rework: "На доработку",
  hidden: "Скрыто / архив",
};

export default function AdminModerationPage() {
  return (
    <div className="py-8 space-y-6">
      <div className="space-y-2">
        <div className="eyebrow">Админка</div>
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Модерация товаров</h1>
        <p className="text-[var(--text-secondary)]">Моковая очередь: готово, проверка, ожидается, на доработку, скрыто.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {adminModeration.map((item) => (
          <div key={item.id} className="card-surface p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[var(--text-muted)]">{queueLabels[item.queue]}</div>
              <div className="text-xs text-[var(--text-secondary)]">{item.type}</div>
            </div>
            <div className="text-lg font-semibold text-[var(--text-primary)]">{item.proposedName}</div>
            <div className="text-sm text-[var(--text-secondary)]">Поставщик: {item.vendor}</div>
            <div className="text-sm text-[var(--text-secondary)]">Категория: {item.category}</div>
            <div className="text-sm text-[var(--text-secondary)]">Цена: {item.price} ₽</div>
            <div className="text-sm text-[var(--text-secondary)]">Наличие: {item.stock}</div>
            <div className="text-sm text-[var(--text-secondary)]">Фото: {item.photoSource}</div>
            <div className="text-sm text-[var(--text-secondary)]">Уверенность: {item.confidence}</div>
            <p className="text-sm text-[var(--text-muted)]">Комментарий: {item.comment}</p>
            <button className="w-full inline-flex items-center justify-center rounded-xl bg-brand-ink px-3 py-2 text-white">
              Открыть карточку
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

