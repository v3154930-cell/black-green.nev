# Admin MVP

Текущее состояние админ-панели после Sprint 2 refinement.

## Структура

```
/admin              — Главная панель
/admin/moderation   — Модерация товаров
/admin/content      — Контент Журнала
```

## /admin — Главная страница

**Summary-блоки:**
- На модерации: кол-во new + review
- Опубликованные: товаров в каталоге
- Контент Журнала: черновики, на проверке, правки
- Требует проверки: позиции с низкой наценкой (<30%)

**Навигация:**
- Карточки-ссылки на разделы

## /admin/moderation

**Статистика:**
- Новые, На проверке, Опубликовано, Всего

**Фильтры:**
- По статусу (new/review/published/all)

**Bulk-логика:**
- Выбор отдельных карточек
- Выбрать все
- Bulk approve

**Карточка товара:**
- Чекбокс для выбора
- Статус с цветовой индикацией
- Тип товара
- Название (proposedName)
- Поставщик, категория, наличие, уверенность
- **Pricing block** (см. ниже)
- Комментарий
- Дата обновления
- Кнопки действий (контекстные)

### Pricing Block в модерации

Компактный блок с ценообразованием:

```
ЦЕНООБРАЗОВАНИЕ
Тип: Вес (г)
Себестоимость: 2800 ₽
Рекомендованная: 4800 ₽
Итоговая: 4800 ₽
Наценка: 71% ✓

⚠️ Ручная корректировка: 1600 ₽ (заблокирована)
```

**Индикация:**
- Зелёная наценка ≥30%
- Жёлтая 20-29%
- Красная <20%

## /admin/content

**Статистика:**
- Черновики, На проверке, Нужны правки, Опубликовано

**Фильтры:**
- По статусу (draft/needs-review/needs-fix/published/all)

**Список материалов:**
- Статус с цветом
- Тип (новость/ответ на отзыв)
- Заголовок
- Краткое описание
- Дата
- Быстрые действия:
  - Опубликовать (для needs-review)
  - На проверку (для draft)
  - Редактировать (для needs-fix)
  - Просмотр (для published)

## Типы данных

```typescript
// Модерация
type AdminModerationCard = {
  id: string;
  vendor: string;
  proposedName: string;
  type: Product["type"];
  category: CategorySlug;
  price: number;           // Legacy
  priceConfig?: PriceConfig; // Pricing layer
  stock: string;
  confidence: string;
  comment: string;
  image: string;
  status: ModerationStatus;
  updatedAt: string;
};

// Контент
type AdminContentDraft = {
  id: string;
  kind: "news" | "review-reply";
  title: string;
  summary: string;
  status: "draft" | "needs-review" | "needs-fix";
};
```

## Моки

Данные в `src/lib/data.ts`:
- `adminModeration` — 5 карточек с разными статусами
- `adminContentDrafts` — 2 черновика
- `news` — опубликованные новости

## Ограничения MVP

- ❌ Нет реального API (моки)
- ❌ Нет сохранения действий
- ❌ Нет истории изменений
- ❌ Нет ролей/прав доступа
- ❌ Нет валидации при сохранении

## Следующие шаги

1. Подключить реальное API
2. Добавить Server Actions
3. Валидация данных при approve
4. История модерации
5. Уведомления (email/Telegram)
