# Supplier Import Layer

MVP-слой для работы с входящими товарами от поставщиков.

## Назначение

- Подготовить базовую модель для импорта товаров от поставщиков
- Связать входящие товары с текущей системой модерации
- Автоматически определять возможные дубликаты
- Предоставить администратору контекст для принятия решений

**Важно:** Это MVP-слой на типах и моках, не полноценная интеграция с поставщиками.

## Типы данных

### SupplierImportItem

```typescript
type SupplierImportItem = {
  // Идентификация поставщика
  supplierName: string;
  supplierSku: string; // Артикул поставщика

  // Названия
  rawTitle: string; // Оригинальное название от поставщика
  normalizedTitle: string; // Нормализованное название

  // Категоризация
  suggestedCategory: CategorySlug;
  suggestedType: Product["type"];

  // Упаковка
  unitType: UnitType;

  // Ценообразование
  costPrice: number;

  // Наличие
  stock: number;
  stockStatus: "in-stock" | "out-of-stock" | "expected";

  // Изображение
  imageSource: string;

  // Confidence
  confidence: number; // 0-1
  confidenceLevel: ConfidenceLevel; // "high" | "medium" | "low"

  // Предупределения и заметки
  warnings: string[];
  notes: string[];

  // Связь с модерацией
  moderationId?: string;
  moderationStatus?: ModerationStatus;

  // Пояснения решений
  decisionNotes: DecisionNote[];

  // Признаки дубликата
  duplicationHints: DuplicationHint[];

  // Метаданные
  importedAt: string;
  importBatchId: string;
};
```

### ConfidenceLevel

```typescript
type ConfidenceLevel = "high" | "medium" | "low";
```

- **high** (≥0.8): Проверенный поставщик, точное совпадение типа товара
- **medium** (0.6-0.79): Недостаточно данных или частичное совпадение
- **low** (<0.6): Требуется ручная проверка, много warnings

### DecisionNote

```typescript
type DecisionNote = {
  field: string; // Поле, к которому относится решение
  reason: string; // Пояснение
  confidence: ConfidenceLevel; // Уверенность в этом решении
};
```

Примеры:
- `category`: "Тип чая: шу пуэр → категория 'tea'"
- `unitType`: "Чай на вес → weight"
- `confidence`: "Проверенный поставщик + точное совпадение типа"
- `warnings`: "Нет фото в реальном освещении"

### DuplicationHint

```typescript
type DuplicationHint = {
  type: "slug-match" | "title-similarity" | "supplier-sku-match";
  matchedProductSlug?: string;
  matchedProductTitle?: string;
  similarity?: number; // 0-1 для title-similarity
  severity: "high" | "medium" | "low";
};
```

Типы совпадений:
- **slug-match**: Точное совпадение slug (высокая вероятность дубликата)
- **title-similarity**: Похожее название (с процентом совпадения)
- **supplier-sku-match**: Совпадение SKU того же поставщика

### ImportBatch

```typescript
type ImportBatch = {
  id: string;
  supplierName: string;
  importedAt: string;
  totalItems: number;
  newItems: number;
  reviewItems: number;
  publishedItems: number;
  status: "pending" | "processed" | "partial";
};
```

## Import → Moderation Flow

```
1. Импорт товара от поставщика
        ↓
2. Анализ и нормализация данных
        ↓
3. Определение confidence level
        ↓
4. Проверка на дубликаты
        ↓
5. Создание SupplierImportItem
        ↓
6. Привязка к moderation (если нужно)
        ↓
7. Администратор:
   - Создать карточку модерации
   - Пропустить товар
```

### Правила связывания с модерацией

| Confidence | Warnings | Duplicates | Рекомендуемый статус |
|------------|----------|------------|---------------------|
| high       | нет      | нет        | new                 |
| high       | есть     | -          | new + warnings      |
| medium     | -        | -          | new (medium)        |
| low        | -        | -          | new (low)           |
| any        | -        | есть       | review              |

## UI: /admin/moderation

### Вкладка "Импорт поставщиков"

- **Статистика:** Всего, Нуждаются в проверке, Низкая уверенность, Возможные дубли
- **Партии:** Сводка по последним партиям импорта
- **Фильтры:**
  - По confidence (Все/Высокая/Средняя/Низкая)
  - Только с дублями

### Карточка импорта

```
[Высокая (0.82)] [Новое]

Шу пуэр Линцан 2019
Shou Puer Tea 2019 Linzhang

Поставщик: Yunnan Craft
SKU: YC-PUER-2019-100
Категория: tea
Тип: Вес
Себестоимость: 2800 ₽
Остаток: 50 шт

--- Decision Notes ---
category: Тип чая: шу пуэр → категория 'tea'
unitType: Чай на вес → weight
confidence: Проверенный поставщик + точное совпадение типа

[Создать карточку] [Пропустить]
```

## Файлы

- `src/lib/types.ts` — типы (SupplierImportItem, ConfidenceLevel, DecisionNote, DuplicationHint, ImportBatch)
- `src/lib/data.ts` — моки (supplierImports, importBatches)
- `src/app/admin/moderation/page.tsx` — UI с вкладкой импорта

## Ограничения MVP

- ❌ Нет реального импорта от поставщиков (только моки)
- ❌ Нет API для загрузки прайс-листов
- ❌ Нет автоматического определения категории (hardcoded rules)
- ❌ Нет real-time matching engine (только статические hints)
- ❌ Нет сохранения действий

## Следующие шаги

1. Добавить API для загрузки CSV/Excel от поставщиков
2. Реализовать правила категоризации (keyword-based)
3. Добавить fuzzy matching для title similarity
4. Интегрировать с реальными данными поставщиков
5. Добавить историю импортов
