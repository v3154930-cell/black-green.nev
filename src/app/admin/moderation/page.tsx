"use client";

import { useState } from "react";
import { adminModeration } from "@/lib/data";
import type { ModerationStatus, ModerationAction } from "@/lib/types";

// Метки статусов
const statusLabels: Record<ModerationStatus, string> = {
  new: "Новое",
  review: "На проверке",
  published: "Опубликовано",
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

  const filteredItems = filter === "all" 
    ? adminModeration 
    : adminModeration.filter(item => item.status === filter);

  return (
    <div className="py-8 space-y-6">
      <div className="space-y-2">
        <div className="eyebrow">Админка</div>
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Модерация</h1>
        <p className="text-[var(--text-secondary)]">
          new → review → published. Действия: approve, send_to_review, hide, defer.
        </p>
      </div>

      {/* Фильтр по статусу */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-sm ${
            filter === "all" 
              ? "bg-brand-ink text-white" 
              : "bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
          }`}
        >
          Все ({adminModeration.length})
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

      {/* Список карточек */}
      {filteredItems.length === 0 ? (
        <div className="text-[var(--text-muted)]">Нет товаров в этом статусе.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <ModerationCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function ModerationCard({ item }: { item: typeof adminModeration[number] }) {
  // Демо: действия просто меняют локальный UI (в реальном app — API)
  const handleAction = (action: ModerationAction) => {
    console.log(`[${action}] for item ${item.id}: ${item.proposedName}`);
    alert(`${actionLabels[action]}: ${item.proposedName}`);
  };

  return (
    <div className="card-surface p-4 space-y-3">
      {/* Статус */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-[var(--text-muted)]">{statusLabels[item.status]}</div>
        <div className="text-xs text-[var(--text-secondary)]">{item.type}</div>
      </div>

      {/* Название */}
      <div className="text-lg font-semibold text-[var(--text-primary)]">{item.proposedName}</div>

      {/* Детали */}
      <div className="text-sm text-[var(--text-secondary)] space-y-1">
        <div>Поставщик: {item.vendor}</div>
        <div>Категория: {item.category}</div>
        <div>Цена: {item.price} ₽</div>
        <div>Наличие: {item.stock}</div>
        <div>Уверенность: {item.confidence}</div>
      </div>

      {/* Комментарий */}
      <p className="text-sm text-[var(--text-muted)]">💬 {item.comment}</p>

      {/* Действия — только для new и review */}
      {item.status !== "published" && (
        <div className="flex flex-wrap gap-2 pt-2">
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
