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

## Guardrails

- Цена ≥ себестоимость
- Минимальная наценка: 30%
- Предупреждение при наценке > 300%

## Файлы

- `src/lib/types.ts` — типы
- `src/lib/pricing.ts` — helpers
- `src/lib/data.ts` — моки

## Расширение

1. Автонаценка по категориям
2. Валюты
3. Скидки (percent/absolute)
4. История изменений
