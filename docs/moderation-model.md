# Moderation Model

Упрощённая модель модерации товаров.

## Статусы

```typescript
type ModerationStatus = "new" | "review" | "published";
```

Flow: `new` → `review` → `published`

## Действия

```typescript
type ModerationAction = "approve" | "send_to_review" | "hide" | "defer";
```

| Действие | Откуда | Куда |
|----------|--------|------|
| send_to_review | new | review |
| approve | review | published |
| hide | any | скрыто |
| defer | any | отложено |

## UI (Admin MVP)

### Главная /admin
- Summary-блоки: на модерации, опубликовано, контент, проблемные
- Быстрая навигация по разделам

### /admin/moderation
- Статистика по статусам (new/review/published)
- Фильтр по статусу
- Bulk-выбор с действиями
- Карточки с деталями:
  - vendor, category, stock, confidence
  - **Pricing block**: unit type, cost price, suggested price, manual override, margin
- Контекстные кнопки действий
- Дата обновления

## Pricing Integration

Модерация интегрирована с pricing layer:

```typescript
type AdminModerationCard = {
  // ...
  price: number;           // Legacy, для совместимости
  priceConfig?: PriceConfig; // Pricing layer
};
```

### Price Summary Block

В каждой карточке модерации отображается:
- Тип единицы (вес/упаковка/штука)
- Себестоимость
- Рекомендованная цена
- Итоговая цена (с учётом override)
- Индикатор ручной корректировки
- Наценка (%) с цветовой индикацией
- Warnings/Errors от validatePrice()

## Файлы

- `src/lib/types.ts` — типы
- `src/lib/data.ts` — моки с priceConfig
- `src/lib/pricing.ts` — helpers (getDisplayPrice, getMargin, validatePrice)
- `src/app/admin/moderation/page.tsx` — UI

## Supplier Import Integration

В Sprint 3 добавлен Supplier Import Layer — MVP-слой для работы с входящими товарами от поставщиков.

### Типы

```typescript
type ConfidenceLevel = "high" | "medium" | "low";

type SupplierImportItem = {
  supplierName: string;
  supplierSku: string;
  rawTitle: string;
  normalizedTitle: string;
  suggestedCategory: CategorySlug;
  suggestedType: Product["type"];
  unitType: UnitType;
  costPrice: number;
  stock: number;
  stockStatus: "in-stock" | "out-of-stock" | "expected";
  imageSource: string;
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  warnings: string[];
  notes: string[];
  moderationId?: string;
  moderationStatus?: ModerationStatus;
  decisionNotes: DecisionNote[];
  duplicationHints: DuplicationHint[];
  importedAt: string;
  importBatchId: string;
};
```

### Decision Notes

Блок с пояснениями решений системы:
- Почему предложена категория
- Почему выбран unit type
- Почему confidence высокий/средний/низкий
- Почему есть warnings

### Deduplication Hints

Базовые признаки возможного дубликата:
- `slug-match` — точное совпадение slug
- `title-similarity` — похожее название (с процентом совпадения)
- `supplier-sku-match` — совпадение SKU поставщика

### Import → Moderation Flow

1. Товар импортируется как `SupplierImportItem`
2. Автоматически связывается с `moderationStatus`:
   - High confidence → рекомендуется сразу в `new`
   - Medium confidence → `new` с пометкой
   - Low confidence → `new` с warning
3. При наличии duplication hints → обязательный review
4. Администратор может:
   - Создать карточку модерации
   - Пропустить товар

### UI: /admin/moderation (вкладка "Импорт поставщиков")

- Статистика: всего, нуждаются в проверке, низкая уверенность, возможные дубли
- Сводка по партиям импорта (import batches)
- Фильтры: по confidence (high/medium/low), только с дублями
- Карточки с:
  - Confidence level (цветовая индикация)
  - Связанный moderation status
  - Decision notes block
  - Warnings
  - Duplication hints

## Расширение

1. Добавить API (Server Actions)
2. Расширить статусы (rejected, archived)
3. История изменений
4. Роли модераторов
5. Bulk approve/defer по фильтру
6. Real-time matching engine для дубликатов
7. AI-categorization для confidence
