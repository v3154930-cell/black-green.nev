"use client";

import { useState } from "react";
import Link from "next/link";
import { adminModeration } from "@/lib/data";
import { getDisplayPrice, getMargin, getUnitLabel, validatePrice } from "@/lib/pricing";
import type { ModerationStatus, ModerationAction, PriceConfig } from "@/lib/types";

// Метки статусов
const statusLabels: Record<ModerationStatus, string> = {
  new: "Новое",
  review: "На проверке",
  published: "Опубликовано",
};

// Цвета статусов
const statusColors: Record<ModerationStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  review: "bg-amber-100 text-amber-700",
  published: "bg-green-100 text-green-700",
};

// Метки действий
const actionLabels: Record<ModerationAction, string> = {
  approve: "Опубликовать",
  send_to_review: "На проверку",
  hide: "Скрыть",
  defer: "Отложить",
};

// Группировка по статусам для удобства
const groupedByStatus = adminModeration.reduce((acc, item) => {
  const status = item.status;
  if (!acc[status]) acc[status] = [];
  acc[status].push(item);
  return acc;
}, {} as Record<ModerationStatus, typeof adminModeration>);

export default function AdminModerationPage() {
  // Фильтр по статусу
  const [filter, setFilter] = useState<ModerationStatus | "all">("all");
  // Bulk selection
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filteredItems = filter === "all" 
    ? adminModeration 
    : adminModeration.filter(item => item.status === filter);

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const selectAll = () => {
    if (selected.size === filteredItems.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredItems.map(i => i.id)));
    }
  };

  return (
    <div className="py-8 space-y-6">
      <div className="space-y-2">
        <div className="eyebrow">Админка</div>
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Модерация товаров</h1>
        <p className="text-[var(--text-secondary)]">
          new → review → published. Quick actions: approve, send_to_review, hide, defer.
        </p>
      </div>

      {/* Stats summary */}
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="surface-subtle p-3 rounded-lg">
          <div className="text-xs text-[var(--text-muted)]">Новые</div>
          <div className="text-xl font-semibold text-[var(--text-primary)]">{groupedByStatus.new?.length || 0}</div>
        </div>
        <div className="surface-subtle p-3 rounded-lg">
          <div className="text-xs text-[var(--text-muted)]">На проверке</div>
          <div className="text-xl font-semibold text-[var(--text-primary)]">{groupedByStatus.review?.length || 0}</div>
        </div>
        <div className="surface-subtle p-3 rounded-lg">
          <div className="text-xs text-[var(--text-muted)]">Опубликовано</div>
          <div className="text-xl font-semibold text-[var(--text-primary)]">{groupedByStatus.published?.length || 0}</div>
        </div>
        <div className="surface-subtle p-3 rounded-lg">
          <div className="text-xs text-[var(--text-muted)]">Всего</div>
          <div className="text-xl font-semibold text-[var(--text-primary)]">{adminModeration.length}</div>
        </div>
      </div>

      {/* Фильтр по статусу */}
      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-sm ${
            filter === "all" 
              ? "bg-brand-ink text-white" 
              : "bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
          }`}
        >
          Все
        </button>
        {(Object.keys(statusLabels) as ModerationStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              filter === status 
                ? "bg-brand-ink text-white" 
                : "bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
            }`}
          >
            {statusLabels[status]} ({groupedByStatus[status]?.length || 0})
          </button>
        ))}
      </div>

      {/* Bulk actions bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-brand-leaf/10 rounded-lg">
          <span className="text-sm text-[var(--text-primary)]">
            Выбрано: {selected.size}
          </span>
          <button
            onClick={() => {
              alert(`Bulk: approve ${selected.size} items`);
              setSelected(new Set());
            }}
            className="px-3 py-1 text-sm bg-brand-leaf text-white rounded-lg"
          >
            Опубликовать все
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="px-3 py-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            Отменить
          </button>
        </div>
      )}

      {/* Select all */}
      {filteredItems.length > 0 && (
        <label className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <input
            type="checkbox"
            checked={selected.size === filteredItems.length && filteredItems.length > 0}
            onChange={selectAll}
            className="rounded"
          />
          Выбрать все
        </label>
      )}

      {/* Список карточек */}
      {filteredItems.length === 0 ? (
        <div className="text-[var(--text-muted)]">Нет товаров в этом статусе.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <ModerationCard 
              key={item.id} 
              item={item} 
              selected={selected.has(item.id)}
              onToggle={() => toggleSelect(item.id)}
            />
          ))}
        </div>
      )}

      <div className="pt-4">
        <Link href="/admin" className="link-underline text-sm">
          ← Назад в админку
        </Link>
      </div>
    </div>
  );
}

function ModerationCard({ 
  item, 
  selected, 
  onToggle 
}: { 
  item: typeof adminModeration[number]; 
  selected: boolean;
  onToggle: () => void;
}) {
  // Демо: действия просто меняют локальный UI (в реальном app — API)
  const handleAction = (action: ModerationAction) => {
    console.log(`[${action}] for item ${item.id}: ${item.proposedName}`);
    alert(`${actionLabels[action]}: ${item.proposedName}`);
  };

  // Pricing info
  const hasPriceConfig = !!item.priceConfig;
  const priceConfig = item.priceConfig;
  const displayPrice = priceConfig ? getDisplayPrice(priceConfig) : item.price;
  const margin = priceConfig ? getMargin(priceConfig) : null;
  const validation = priceConfig ? validatePrice(priceConfig) : null;
  const unitLabel = priceConfig ? getUnitLabel(priceConfig.packaging.unitType) : null;

  return (
    <div className={`card-surface p-4 space-y-3 ${selected ? 'ring-2 ring-brand-leaf' : ''}`}>
      {/* Header with checkbox */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggle}
            className="rounded"
          />
          <span className={`text-xs px-2 py-0.5 rounded ${statusColors[item.status]}`}>
            {statusLabels[item.status]}
          </span>
        </label>
        <div className="text-xs text-[var(--text-secondary)]">{item.type}</div>
      </div>

      {/* Название */}
      <div className="text-lg font-semibold text-[var(--text-primary)]">{item.proposedName}</div>

      {/* Детали */}
      <div className="text-sm text-[var(--text-secondary)] space-y-1">
        <div>Поставщик: {item.vendor}</div>
        <div>Категория: {item.category}</div>
        <div>Наличие: {item.stock}</div>
        <div>Уверенность: {item.confidence}</div>
      </div>

      {/* Pricing Summary Block */}
      {hasPriceConfig && priceConfig && (
        <div className="p-3 bg-[var(--bg-subtle)] rounded-lg space-y-2">
          <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Ценообразование</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-[var(--text-muted)]">Тип:</span>{" "}
              <span className="text-[var(--text-primary)] font-medium">{priceConfig.packaging.unitType === 'weight' ? 'Вес' : priceConfig.packaging.unitType === 'pack' ? 'Упаковка' : 'Штука'}</span>
              {unitLabel && <span className="text-xs text-[var(--text-muted)]"> ({unitLabel})</span>}
            </div>
            <div>
              <span className="text-[var(--text-muted)]">Себестоимость:</span>{" "}
              <span className="text-[var(--text-primary)] font-medium">{priceConfig.price.costPrice} ₽</span>
            </div>
            <div>
              <span className="text-[var(--text-muted)]">Рекомендованная:</span>{" "}
              <span className="text-[var(--text-primary)] font-medium">{priceConfig.price.suggestedPrice} ₽</span>
            </div>
            <div>
              <span className="text-[var(--text-muted)]">Итоговая:</span>{" "}
              <span className="text-[var(--text-primary)] font-semibold text-brand-leaf">{displayPrice} ₽</span>
            </div>
          </div>
          
          {/* Manual override indicator */}
          {priceConfig.price.manualOverride && (
            <div className="text-xs text-amber-600">
              ⚠️ Ручная корректировка: {priceConfig.price.manualOverride} ₽
              {priceConfig.price.isLocked && ' (заблокирована)'}
            </div>
          )}
          
          {/* Margin */}
          {margin !== null && (
            <div className={`text-xs ${margin >= 30 ? 'text-green-600' : margin >= 20 ? 'text-amber-600' : 'text-red-600'}`}>
              Наценка: {margin}% {margin < 30 && '(ниже рекомендованных 30%)'}
            </div>
          )}
          
          {/* Validation warnings/errors */}
          {validation && validation.warnings.length > 0 && (
            <div className="text-xs text-amber-600">
              {validation.warnings.join(', ')}
            </div>
          )}
          {validation && validation.errors.length > 0 && (
            <div className="text-xs text-red-600">
              {validation.errors.join(', ')}
            </div>
          )}
        </div>
      )}

      {/* Fallback price display for items without priceConfig */}
      {!hasPriceConfig && (
        <div className="text-sm text-[var(--text-secondary)]">
          Цена: {item.price} ₽
        </div>
      )}

      {/* Комментарий */}
      <p className="text-sm text-[var(--text-muted)]">💬 {item.comment}</p>

      {/* Date */}
      <div className="text-xs text-[var(--text-muted)]">
        Обновлено: {new Date(item.updatedAt).toLocaleDateString('ru-RU')}
      </div>

      {/* Действия — только для new и review */}
      {item.status !== "published" && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#e4e9e6]">
          {item.status === "review" && (
            <button
              onClick={() => handleAction("approve")}
              className="flex-1 inline-flex items-center justify-center rounded-lg bg-brand-leaf px-3 py-1.5 text-sm text-white"
            >
              {actionLabels.approve}
            </button>
          )}
          {item.status === "new" && (
            <button
              onClick={() => handleAction("send_to_review")}
              className="flex-1 inline-flex items-center justify-center rounded-lg bg-brand-ink px-3 py-1.5 text-sm text-white"
            >
              {actionLabels.send_to_review}
            </button>
          )}
          <button
            onClick={() => handleAction("defer")}
            className="inline-flex items-center justify-center rounded-lg border border-[#dfe5e1] bg-white px-3 py-1.5 text-sm text-[var(--text-primary)]"
          >
            {actionLabels.defer}
          </button>
          <button
            onClick={() => handleAction("hide")}
            className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-700"
          >
            {actionLabels.hide}
          </button>
        </div>
      )}
    </div>
  );
}
