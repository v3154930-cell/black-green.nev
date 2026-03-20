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

## Расширение

1. Добавить API (Server Actions)
2. Расширить статусы (rejected, archived)
3. История изменений
4. Роли модераторов
5. Bulk approve/defer по фильтру
