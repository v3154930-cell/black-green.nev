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

## UI

- Фильтр по статусу
- Карточки с деталями (vendor, price, comment)
- Кнопки действий (контекстные)

## Файлы

- `src/lib/types.ts` — типы
- `src/lib/data.ts` — моки
- `src/app/admin/moderation/page.tsx` — UI

## Расширение

1. Добавить API (Server Actions)
2. Расширить статусы (rejected, archived)
3. История изменений
4. Роли модераторов
