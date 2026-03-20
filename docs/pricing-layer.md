# Pricing Layer

Базовая модель ценообразования.

## Типы

```typescript
type UnitType = "weight" | "pack" | "piece";

type PriceInfo = {
  costPrice: number;        // Себестоимость
  suggestedPrice: number;   // Рекомендованная
  manualOverride?: number;  // Ручная правка
  isLocked?: boolean;       // Заблокировано
};

type Packaging = {
  unitType: UnitType;
  weightOptions?: number[];  // Для weight
  defaultWeight?: number;   // Для weight
  maxWeight?: number;        // Лимит веса
  maxQuantity?: number;      // Лимит количества
};

type PriceConfig = {
  price: PriceInfo;
  packaging: Packaging;
};
```

## Helpers

| Функция | Назначение |
|---------|-----------|
| `getDisplayPrice()` | override → suggested |
| `getMargin()` | Наценка в % |
| `validatePrice()` | Guardrails |
| `getUnitLabel()` | г/уп/шт |
| `getPricePerUnit()` | Цена за единицу (за 100г) |

## Guardrails

- Цена ≥ себестоимость
- Минимальная наценка: 30%
- Предупреждение при наценке > 300%

## Интеграция с Admin

### В модерации

Карточки товаров на модерации показывают pricing block:

```typescript
type AdminModerationCard = {
  // ...
  priceConfig?: PriceConfig; // Опционально для совместимости
};
```

### Price Summary Block

В карточке отображается:
- Тип единицы (Вес/Упаковка/Штука)
- Себестоимость
- Рекомендованная цена
- Итоговая цена
- Ручная корректировка (если есть)
- Наценка с индикацией:
  - Зелёная ≥30%
  - Жёлтая 20-29%
  - Красная <20%
- Warnings/Errors от validatePrice()

## Файлы

- `src/lib/types.ts` — типы
- `src/lib/pricing.ts` — helpers
- `src/lib/data.ts` — моки
- `src/app/admin/moderation/page.tsx` — UI с pricing

## Расширение

1. Автонаценка по категориям
2. Валюты
3. Скидки (percent/absolute)
4. История изменений
5. Аналитика по наценкам
