"use client";

import { useState } from "react";
import Link from "next/link";
import { adminModeration, supplierImports, importBatches, mockCsvData, mockCsvColumns, defaultMapping, applyMapping, applyEligibilityGate, getEligibilityStats } from "@/lib/data";
import { getDisplayPrice, getMargin, getUnitLabel, validatePrice } from "@/lib/pricing";
import type { ModerationStatus, ModerationAction, ConfidenceLevel, SupplierImportItem, ColumnMapping, MappingField, RawImportRow, EligibleImportRow, EligibilityResult, RejectReason, ReviewReason } from "@/lib/types";

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
  // Вкладка: moderation, import или file-intake
  const [tab, setTab] = useState<"moderation" | "import" | "file-intake">("moderation");
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

      {/* Tabs: Moderation / Supplier Import */}
      <div className="flex border-b border-[#e4e9e6]">
        <button
          onClick={() => setTab("moderation")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === "moderation"
              ? "border-brand-leaf text-brand-leaf"
              : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          Модерация
        </button>
        <button
          onClick={() => setTab("import")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === "import"
              ? "border-brand-leaf text-brand-leaf"
              : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          Импорт
          {supplierImports.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-brand-leaf/10 text-brand-leaf rounded-full">
              {supplierImports.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("file-intake")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === "file-intake"
              ? "border-brand-leaf text-brand-leaf"
              : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          Загрузка файла
        </button>
      </div>

      {/* Content based on tab */}
      {tab === "import" ? (
        <SupplierImportSection />
      ) : tab === "file-intake" ? (
        <FileIntakeSection />
      ) : (
        <>
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

        {/* End of moderation content */}
        </>
      )}

      <div className="pt-4">
        <Link href="/admin" className="link-underline text-sm">
          ← Назад в админку
        </Link>
      </div>
    </div>
  );
}

// ========================================
// Supplier Import Section
// ========================================

function SupplierImportSection() {
  // Фильтр по confidence
  const [confidenceFilter, setConfidenceFilter] = useState<ConfidenceLevel | "all">("all");
  // Показывать только с дубликатами
  const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false);

  const filteredImports = supplierImports.filter(item => {
    if (confidenceFilter !== "all" && item.confidenceLevel !== confidenceFilter) return false;
    if (showDuplicatesOnly && item.duplicationHints.length === 0) return false;
    return true;
  });

  // Сводка по импортам
  const newCount = supplierImports.filter(i => !i.moderationStatus || i.moderationStatus === "new").length;
  const reviewCount = supplierImports.filter(i => i.moderationStatus === "review").length;
  const lowConfidenceCount = supplierImports.filter(i => i.confidenceLevel === "low").length;
  const duplicateCount = supplierImports.filter(i => i.duplicationHints.length > 0).length;

  return (
    <div className="space-y-6">
      {/* Import Stats */}
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="surface-subtle p-3 rounded-lg">
          <div className="text-xs text-[var(--text-muted)]">Всего импортов</div>
          <div className="text-xl font-semibold text-[var(--text-primary)]">{supplierImports.length}</div>
        </div>
        <div className="surface-subtle p-3 rounded-lg">
          <div className="text-xs text-[var(--text-muted)]">Нуждаются в проверке</div>
          <div className="text-xl font-semibold text-blue-600">{newCount + reviewCount}</div>
        </div>
        <div className="surface-subtle p-3 rounded-lg">
          <div className="text-xs text-[var(--text-muted)]">Низкая уверенность</div>
          <div className="text-xl font-semibold text-amber-600">{lowConfidenceCount}</div>
        </div>
        <div className="surface-subtle p-3 rounded-lg">
          <div className="text-xs text-[var(--text-muted)]">Возможные дубли</div>
          <div className="text-xl font-semibold text-red-600">{duplicateCount}</div>
        </div>
      </div>

      {/* Import Batches Summary */}
      <div className="surface-subtle p-4 rounded-lg">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Последние партии импорта</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {importBatches.map(batch => (
            <div key={batch.id} className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded-lg">
              <div>
                <div className="font-medium text-[var(--text-primary)]">{batch.supplierName}</div>
                <div className="text-xs text-[var(--text-muted)]">
                  {new Date(batch.importedAt).toLocaleDateString('ru-RU')}
                </div>
              </div>
              <div className="text-right text-sm">
                <div className="text-[var(--text-primary)]">{batch.totalItems} позиций</div>
                <div className={`text-xs ${
                  batch.status === "processed" ? "text-green-600" :
                  batch.status === "pending" ? "text-amber-600" : "text-blue-600"
                }`}>
                  {batch.status === "processed" ? "Обработано" : batch.status === "pending" ? "В ожидании" : "Частично"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <span className="text-sm text-[var(--text-muted)]">Фильтр:</span>
        <button
          onClick={() => setConfidenceFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-sm ${
            confidenceFilter === "all" 
              ? "bg-brand-ink text-white" 
              : "bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
          }`}
        >
          Все
        </button>
        <button
          onClick={() => setConfidenceFilter("high")}
          className={`px-3 py-1.5 rounded-lg text-sm ${
            confidenceFilter === "high" 
              ? "bg-green-600 text-white" 
              : "bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
          }`}
        >
          Высокая уверенность
        </button>
        <button
          onClick={() => setConfidenceFilter("medium")}
          className={`px-3 py-1.5 rounded-lg text-sm ${
            confidenceFilter === "medium" 
              ? "bg-amber-500 text-white" 
              : "bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
          }`}
        >
          Средняя
        </button>
        <button
          onClick={() => setConfidenceFilter("low")}
          className={`px-3 py-1.5 rounded-lg text-sm ${
            confidenceFilter === "low" 
              ? "bg-red-500 text-white" 
              : "bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
          }`}
        >
          Низкая
        </button>
        <label className="flex items-center gap-2 ml-auto text-sm text-[var(--text-secondary)]">
          <input
            type="checkbox"
            checked={showDuplicatesOnly}
            onChange={(e) => setShowDuplicatesOnly(e.target.checked)}
            className="rounded"
          />
          Только с дублями
        </label>
      </div>

      {/* Import Items Grid */}
      {filteredImports.length === 0 ? (
        <div className="text-[var(--text-muted)]">Нет импортов по выбранным критериям.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredImports.map((item) => (
            <SupplierImportCard key={item.supplierSku} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function SupplierImportCard({ item }: { item: SupplierImportItem }) {
  const confidenceColors: Record<ConfidenceLevel, string> = {
    high: "bg-green-100 text-green-700",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-red-100 text-red-700",
  };

  const confidenceLabels: Record<ConfidenceLevel, string> = {
    high: "Высокая",
    medium: "Средняя",
    low: "Низкая",
  };

  const statusColors: Record<string, string> = {
    "new": "bg-blue-100 text-blue-700",
    "review": "bg-amber-100 text-amber-700",
    "published": "bg-green-100 text-green-700",
  };

  const statusLabels: Record<string, string> = {
    "new": "Новое",
    "review": "На проверке",
    "published": "Опубликовано",
  };

  return (
    <div className="card-surface p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-0.5 rounded ${confidenceColors[item.confidenceLevel]}`}>
          {confidenceLabels[item.confidenceLevel]} ({item.confidence})
        </span>
        {item.moderationStatus && (
          <span className={`text-xs px-2 py-0.5 rounded ${statusColors[item.moderationStatus]}`}>
            {statusLabels[item.moderationStatus]}
          </span>
        )}
      </div>

      {/* Title */}
      <div>
        <div className="text-lg font-semibold text-[var(--text-primary)]">{item.normalizedTitle}</div>
        <div className="text-xs text-[var(--text-muted)]">{item.rawTitle}</div>
      </div>

      {/* Details */}
      <div className="text-sm text-[var(--text-secondary)] space-y-1">
        <div>Поставщик: {item.supplierName}</div>
        <div>SKU: {item.supplierSku}</div>
        <div>Категория: {item.suggestedCategory}</div>
        <div>Тип: {item.unitType === 'weight' ? 'Вес' : item.unitType === 'pack' ? 'Упаковка' : 'Штука'}</div>
        <div>Себестоимость: {item.costPrice} ₽</div>
        <div>Остаток: {item.stock > 0 ? `${item.stock} шт` : item.stockStatus === 'expected' ? 'Ожидается' : 'Нет в наличии'}</div>
      </div>

      {/* Decision Notes Block */}
      {item.decisionNotes.length > 0 && (
        <div className="p-3 bg-[var(--bg-subtle)] rounded-lg space-y-2">
          <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Решения системы</div>
          {item.decisionNotes.map((note, idx) => (
            <div key={idx} className="text-xs">
              <span className="font-medium text-[var(--text-primary)]">{note.field}:</span>{" "}
              <span className="text-[var(--text-secondary)]">{note.reason}</span>
            </div>
          ))}
        </div>
      )}

      {/* Warnings */}
      {item.warnings.length > 0 && (
        <div className="p-3 bg-red-50 rounded-lg">
          <div className="text-xs text-red-700 font-medium mb-1">⚠️ Предупреждения</div>
          {item.warnings.map((warning, idx) => (
            <div key={idx} className="text-xs text-red-600">{warning}</div>
          ))}
        </div>
      )}

      {/* Duplication Hints */}
      {item.duplicationHints.length > 0 && (
        <div className="p-3 bg-amber-50 rounded-lg space-y-2">
          <div className="text-xs text-amber-700 font-medium">🔍 Возможный дубль</div>
          {item.duplicationHints.map((hint, idx) => (
            <div key={idx} className="text-xs text-amber-600">
              {hint.type === "slug-match" && "⚡ Точное совпадение slug: "}
              {hint.type === "title-similarity" && `🔍 Похожее название (${Math.round((hint.similarity || 0) * 100)}%): `}
              {hint.type === "supplier-sku-match" && "🏷️ Совпадение SKU поставщика: "}
              {hint.matchedProductTitle || hint.matchedProductSlug}
              {hint.severity === "high" && " [высокая вероятность]"}
            </div>
          ))}
        </div>
      )}

      {/* Notes */}
      {item.notes.length > 0 && (
        <div className="text-xs text-[var(--text-muted)]">
          {item.notes.map((note, idx) => (
            <div key={idx}>• {note}</div>
          ))}
        </div>
      )}

      {/* Action */}
      <div className="flex gap-2 pt-2 border-t border-[#e4e9e6]">
        <button
          onClick={() => alert(`Создать карточку модерации для: ${item.normalizedTitle}`)}
          className="flex-1 inline-flex items-center justify-center rounded-lg bg-brand-leaf px-3 py-1.5 text-sm text-white"
        >
          Создать карточку
        </button>
        <button
          onClick={() => alert(`Пропустить: ${item.normalizedTitle}`)}
          className="inline-flex items-center justify-center rounded-lg border border-[#dfe5e1] bg-white px-3 py-1.5 text-sm text-[var(--text-primary)]"
        >
          Пропустить
        </button>
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

// ========================================
// File Intake Section (Sprint 4)
// ========================================

export function FileIntakeSection() {
  const [step, setStep] = useState<"upload" | "mapping" | "validation" | "preview" | "eligibility">("upload");
  const [supplierName, setSupplierName] = useState("");
  const [validatedRows, setValidatedRows] = useState<RawImportRow[]>([]);
  const [eligibleRows, setEligibleRows] = useState<EligibleImportRow[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>(defaultMapping);
  const [columns, setColumns] = useState<string[]>([]);

  // Имитация загрузки файла
  const handleFileUpload = () => {
    // Мок: используем тестовые данные
    setColumns(mockCsvColumns);
    setStep("mapping");
  };

  // Обновить маппинг
  const updateMapping = (field: MappingField, column: string) => {
    setMapping(prev => ({ ...prev, [field]: column || null }));
  };

  // Применить маппинг и валидацию
  const applyCurrentMapping = () => {
    const mappedRows = applyMapping(mockCsvData, mapping);
    setValidatedRows(mappedRows);
    setStep("validation");
  };

  // Перейти к preview (после просмотра ошибок валидации)
  const goToPreview = () => {
    setStep("preview");
  };

  // Перейти к eligibility (после preview)
  const goToEligibility = () => {
    const eligible = applyEligibilityGate(validatedRows);
    setEligibleRows(eligible);
    setStep("eligibility");
  };

  // Название полей маппинга
  const mappingFields: { key: MappingField; label: string }[] = [
    { key: "supplierSku", label: "SKU поставщика" },
    { key: "rawTitle", label: "Название" },
    { key: "costPrice", label: "Цена" },
    { key: "stock", label: "Остаток" },
    { key: "imageSource", label: "Изображение" },
    { key: "categoryHint", label: "Категория" },
    { key: "typeHint", label: "Тип единицы" },
  ];

  if (step === "upload") {
    return (
      <div className="space-y-6">
        <div className="surface-subtle p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Загрузка файла поставщика
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                Название поставщика
              </label>
              <input
                type="text"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="Например: Yunnan Craft"
                className="w-full px-3 py-2 border border-[#dfe5e1] rounded-lg"
              />
            </div>

            <div className="border-2 border-dashed border-[#dfe5e1] rounded-lg p-8 text-center">
              <div className="text-4xl mb-2">📄</div>
              <div className="text-[var(--text-primary)] font-medium mb-1">
                Перетащите файл сюда
              </div>
              <div className="text-sm text-[var(--text-muted)] mb-4">
                или нажмите для выбора
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                Поддерживается: CSV, XLSX
              </div>
              <button
                onClick={handleFileUpload}
                className="mt-4 px-4 py-2 bg-brand-leaf text-white rounded-lg"
              >
                Загрузить тестовый файл (мок)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "mapping") {
    return (
      <div className="space-y-6">
        <div className="surface-subtle p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            Сопоставление колонок
          </h3>
          <p className="text-sm text-[var(--text-muted)]">
            Найдите соответствующие колонки в файле
          </p>
        </div>

        {/* Supplier name */}
        <div className="surface-subtle p-4 rounded-lg">
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Поставщик
          </label>
          <input
            type="text"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            className="w-full px-3 py-2 border border-[#dfe5e1] rounded-lg"
          />
        </div>

        {/* Mapping fields */}
        <div className="surface-subtle p-4 rounded-lg space-y-3">
          {mappingFields.map(field => (
            <div key={field.key} className="flex items-center gap-4">
              <label className="w-40 text-sm font-medium text-[var(--text-primary)]">
                {field.label}
              </label>
              <select
                value={mapping[field.key] || ""}
                onChange={(e) => updateMapping(field.key, e.target.value)}
                className="flex-1 px-3 py-2 border border-[#dfe5e1] rounded-lg"
              >
                <option value="">— Не выбрано —</option>
                {columns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Preview of first 3 rows */}
        <div className="surface-subtle p-4 rounded-lg">
          <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">
            Предпросмотр (первые 3 строки)
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e4e9e6]">
                  {columns.map(col => (
                    <th key={col} className="px-2 py-1 text-left text-[var(--text-muted)]">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockCsvData.slice(0, 3).map((row, idx) => (
                  <tr key={idx} className="border-b border-[#e4e9e6]">
                    {columns.map(col => (
                      <td key={col} className="px-2 py-1 text-[var(--text-secondary)]">
                        {row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setStep("upload")}
            className="px-4 py-2 border border-[#dfe5e1] rounded-lg text-[var(--text-primary)]"
          >
            Назад
          </button>
          <button
            onClick={applyCurrentMapping}
            className="px-4 py-2 bg-brand-leaf text-white rounded-lg"
          >
            Применить и проверить
          </button>
        </div>
      </div>
    );
  }

  // Validation step - показываем ошибки и предупреждения
  if (step === "validation") {
    const totalRows = validatedRows.length;
    const rowsWithErrors = validatedRows.filter(r => r.validation.errors.length > 0).length;
    const rowsWithWarnings = validatedRows.filter(r => r.validation.warnings.length > 0 && r.validation.errors.length === 0).length;
    const validRows = validatedRows.filter(r => r.validation.isValid).length;

    return (
      <div className="space-y-6">
        <div className="surface-subtle p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            Проверка данных
          </h3>
          <p className="text-sm text-[var(--text-muted)]">
            Результаты валидации после сопоставления колонок
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="surface-subtle p-3 rounded-lg">
            <div className="text-xs text-[var(--text-muted)]">Всего строк</div>
            <div className="text-xl font-semibold text-[var(--text-primary)]">{totalRows}</div>
          </div>
          <div className="surface-subtle p-3 rounded-lg border-2 border-green-500">
            <div className="text-xs text-green-600">✓ Валидных</div>
            <div className="text-xl font-semibold text-green-600">{validRows}</div>
          </div>
          <div className="surface-subtle p-3 rounded-lg border-2 border-amber-500">
            <div className="text-xs text-amber-600">⚠ Предупреждения</div>
            <div className="text-xl font-semibold text-amber-600">{rowsWithWarnings}</div>
          </div>
          <div className="surface-subtle p-3 rounded-lg border-2 border-red-500">
            <div className="text-xs text-red-600">✕ Ошибки</div>
            <div className="text-xl font-semibold text-red-600">{rowsWithErrors}</div>
          </div>
        </div>

        {/* Validation details */}
        <div className="surface-subtle p-4 rounded-lg">
          <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">
            Результаты по строкам
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e4e9e6]">
                  <th className="px-2 py-2 text-left text-[var(--text-muted)] w-12">#</th>
                  <th className="px-2 py-2 text-left text-[var(--text-muted)]">SKU</th>
                  <th className="px-2 py-2 text-left text-[var(--text-muted)]">Название</th>
                  <th className="px-2 py-2 text-left text-[var(--text-muted)]">Цена</th>
                  <th className="px-2 py-2 text-left text-[var(--text-muted)]">Статус</th>
                </tr>
              </thead>
              <tbody>
                {validatedRows.map(row => (
                  <tr key={row.rowIndex} className="border-b border-[#e4e9e6]">
                    <td className="px-2 py-2 text-[var(--text-muted)]">{row.rowIndex}</td>
                    <td className="px-2 py-2 text-[var(--text-primary)]">{row.supplierSku || '—'}</td>
                    <td className="px-2 py-2 text-[var(--text-primary)]">{row.rawTitle || '—'}</td>
                    <td className="px-2 py-2 text-[var(--text-secondary)]">{row.costPrice} ₽</td>
                    <td className="px-2 py-2">
                      {row.validation.errors.length > 0 ? (
                        <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700">
                          ✕ {row.validation.errors.length} ошибок
                        </span>
                      ) : row.validation.warnings.length > 0 ? (
                        <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                          ⚠ {row.validation.warnings.length} предупреждений
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">
                          ✓ OK
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Error details */}
        {rowsWithErrors > 0 && (
          <div className="surface-subtle p-4 rounded-lg">
            <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">
              Ошибки
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {validatedRows.filter(r => r.validation.errors.length > 0).map(row => (
                <div key={row.rowIndex} className="text-sm p-2 bg-red-50 rounded">
                  <span className="font-medium text-red-700">Строка {row.rowIndex}:</span>
                  <ul className="mt-1 ml-4 text-red-600">
                    {row.validation.errors.map((err, idx) => (
                      <li key={idx}>• {err.message}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warning details */}
        {rowsWithWarnings > 0 && (
          <div className="surface-subtle p-4 rounded-lg">
            <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">
              Предупреждения
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {validatedRows.filter(r => r.validation.warnings.length > 0 && r.validation.errors.length === 0).map(row => (
                <div key={row.rowIndex} className="text-sm p-2 bg-amber-50 rounded">
                  <span className="font-medium text-amber-700">Строка {row.rowIndex}:</span>
                  <ul className="mt-1 ml-4 text-amber-600">
                    {row.validation.warnings.map((warn, idx) => (
                      <li key={idx}>• {warn.message}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setStep("mapping")}
            className="px-4 py-2 border border-[#dfe5e1] rounded-lg text-[var(--text-primary)]"
          >
            Назад к маппингу
          </button>
          <button
            onClick={goToPreview}
            className="px-4 py-2 bg-brand-leaf text-white rounded-lg"
          >
            Продолжить
          </button>
        </div>
      </div>
    );
  }

  // Eligibility step - проверка допустимости товаров
  if (step === "eligibility") {
    return (
      <EligibilityStep 
        rows={eligibleRows} 
        onBack={() => setStep("preview")} 
      />
    );
  }

  // Preview step - данные после валидации
  return (
    <div className="space-y-6">
      <div className="surface-subtle p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          Результат проверки
        </h3>
        <p className="text-sm text-[var(--text-muted)]">
          Данные прошли валидацию. Перейдите к следующему шагу.
        </p>
      </div>

      {/* Rows table - only validation status */}
      <div className="surface-subtle p-4 rounded-lg">
        <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">
          Строки данных
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e4e9e6]">
                <th className="px-2 py-2 text-left text-[var(--text-muted)] w-12">#</th>
                <th className="px-2 py-2 text-left text-[var(--text-muted)]">SKU</th>
                <th className="px-2 py-2 text-left text-[var(--text-muted)]">Название</th>
                <th className="px-2 py-2 text-left text-[var(--text-muted)]">Цена</th>
                <th className="px-2 py-2 text-left text-[var(--text-muted)]">Остаток</th>
                <th className="px-2 py-2 text-left text-[var(--text-muted)]">Статус</th>
              </tr>
            </thead>
            <tbody>
              {validatedRows.map(row => (
                <tr key={row.rowIndex} className="border-b border-[#e4e9e6]">
                  <td className="px-2 py-2 text-[var(--text-muted)]">{row.rowIndex}</td>
                  <td className="px-2 py-2 text-[var(--text-primary)]">{row.supplierSku || '—'}</td>
                  <td className="px-2 py-2 text-[var(--text-primary)]">{row.rawTitle || '—'}</td>
                  <td className="px-2 py-2 text-[var(--text-secondary)]">{row.costPrice} ₽</td>
                  <td className="px-2 py-2 text-[var(--text-secondary)]">{row.stock}</td>
                  <td className="px-2 py-2">
                    {row.validation.errors.length > 0 ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700">
                        ✕ Ошибки
                      </span>
                    ) : row.validation.warnings.length > 0 ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                        ⚠ Предупреждения
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">
                        ✓ OK
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => setStep("validation")}
          className="px-4 py-2 border border-[#dfe5e1] rounded-lg text-[var(--text-primary)]"
        >
          Назад
        </button>
        <button
          onClick={goToEligibility}
          className="px-4 py-2 bg-brand-leaf text-white rounded-lg"
        >
          Продолжить
        </button>
      </div>
    </div>
  );
}

const rejectReasonLabels: Record<RejectReason, string> = {
  coffee: "Кофе",
  mate: "Мате",
  packaging_no_core: "Нецелевая упаковка",
  outside_core_category: "Не в ассортименте",
  invalid_row: "Пустая/тестовая строка",
  ambiguous: "Неоднозначный товар",
};

const reviewReasonLabels: Record<ReviewReason, string> = {
  unclear_category: "Неочевидная категория",
  ambiguous_type: "Спорный тип товара",
  low_confidence: "Низкая уверенность",
};

const eligibilityColors: Record<EligibilityResult, string> = {
  pass: "bg-green-100 text-green-700",
  soft_review: "bg-amber-100 text-amber-700",
  hard_reject: "bg-red-100 text-red-700",
};

const eligibilityLabels: Record<EligibilityResult, string> = {
  pass: "✓ Прошли",
  soft_review: "⚠ На проверку",
  hard_reject: "✕ Отклонены",
};

function EligibilityStep({ 
  rows, 
  onBack 
}: { 
  rows: EligibleImportRow[]; 
  onBack: () => void;
}) {
  const stats = getEligibilityStats(rows);

  const hasRejections = stats.hardReject > 0;
  const hasReviews = stats.softReview > 0;

  return (
    <div className="space-y-6">
      <div className="surface-subtle p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          Проверка допустимости
        </h3>
        <p className="text-sm text-[var(--text-muted)]">
          Определение товаров для импорта в каталог
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="surface-subtle p-3 rounded-lg">
          <div className="text-xs text-[var(--text-muted)]">Всего строк</div>
          <div className="text-xl font-semibold text-[var(--text-primary)]">{stats.total}</div>
        </div>
        <div className="surface-subtle p-3 rounded-lg border-2 border-green-500">
          <div className="text-xs text-green-600">✓ Прошли</div>
          <div className="text-xl font-semibold text-green-600">{stats.pass}</div>
        </div>
        <div className="surface-subtle p-3 rounded-lg border-2 border-amber-500">
          <div className="text-xs text-amber-600">⚠ На проверку</div>
          <div className="text-xl font-semibold text-amber-600">{stats.softReview}</div>
        </div>
        <div className="surface-subtle p-3 rounded-lg border-2 border-red-500">
          <div className="text-xs text-red-600">✕ Отклонены</div>
          <div className="text-xl font-semibold text-red-600">{stats.hardReject}</div>
        </div>
      </div>

      {/* Reject reasons */}
      {hasRejections && (
        <div className="surface-subtle p-4 rounded-lg">
          <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">
            Причины отклонения
          </h4>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(stats.rejectReasons) as [RejectReason, number][]).map(([reason, count]) => (
              count > 0 && (
                <span key={reason} className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded">
                  {rejectReasonLabels[reason]}: {count}
                </span>
              )
            ))}
          </div>
        </div>
      )}

      {/* Review reasons */}
      {hasReviews && (
        <div className="surface-subtle p-4 rounded-lg">
          <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">
            Причины проверки
          </h4>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(stats.reviewReasons) as [ReviewReason, number][]).map(([reason, count]) => (
              count > 0 && (
                <span key={reason} className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded">
                  {reviewReasonLabels[reason]}: {count}
                </span>
              )
            ))}
          </div>
        </div>
      )}

      {/* Rows table */}
      <div className="surface-subtle p-4 rounded-lg">
        <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">
          Строки данных
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e4e9e6]">
                <th className="px-2 py-2 text-left text-[var(--text-muted)] w-12">#</th>
                <th className="px-2 py-2 text-left text-[var(--text-muted)]">SKU</th>
                <th className="px-2 py-2 text-left text-[var(--text-muted)]">Название</th>
                <th className="px-2 py-2 text-left text-[var(--text-muted)]">Цена</th>
                <th className="px-2 py-2 text-left text-[var(--text-muted)]">Статус</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.rowIndex} className="border-b border-[#e4e9e6]">
                  <td className="px-2 py-2 text-[var(--text-muted)]">{row.rowIndex}</td>
                  <td className="px-2 py-2 text-[var(--text-primary)]">{row.supplierSku || '—'}</td>
                  <td className="px-2 py-2 text-[var(--text-primary)]">{row.rawTitle || '—'}</td>
                  <td className="px-2 py-2 text-[var(--text-secondary)]">{row.costPrice} ₽</td>
                  <td className="px-2 py-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${eligibilityColors[row.eligibility]}`}>
                      {eligibilityLabels[row.eligibility]}
                    </span>
                    {row.eligibility === "hard_reject" && row.rejectReason && (
                      <span className="text-xs text-red-600 ml-1">
                        ({rejectReasonLabels[row.rejectReason]})
                      </span>
                    )}
                    {row.eligibility === "soft_review" && row.reviewReason && (
                      <span className="text-xs text-amber-600 ml-1">
                        ({reviewReasonLabels[row.reviewReason]})
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-[#dfe5e1] rounded-lg text-[var(--text-primary)]"
        >
          Назад
        </button>
        <button
          onClick={() => alert('Готово! (Импорт в каталог - следующий этап)')}
          className="px-4 py-2 bg-brand-leaf text-white rounded-lg"
        >
          Продолжить
        </button>
      </div>
    </div>
  );
}
