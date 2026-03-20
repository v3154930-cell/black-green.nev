# Roadmap

## Phase 1: MVP Freeze ✅
- [x] Next.js skeleton
- [x] Tailwind setup
- [x] Storefront routes (главная, каталог, товар)
- [x] Admin skeleton (moderation, content)
- [x] Build verification
- [x] Fallback images
- [x] MVP pricing layer
- [x] MVP moderation model
- [x] Журнал как контентный слой
- [x] MAX как главный канал связи
- [x] 3:4 как стандарт изображения

## Phase 1.5: Search Layer & Usability ✅ (Sprint 1)
- [x] Базовый поиск по каталогу
- [x] Поиск по названию, категории, ключевым словам
- [x] Пустая выдача (empty state)
- [x] Подготовка под voice input
- [x] Активные состояния навигации (Header)
- [x] Улучшенная навигация категорий

## Phase 1.75: Admin MVP Refinement ✅ (Sprint 2)
- [x] Улучшенная главная /admin с summary-блоками
- [x] Модерация с фильтрами и bulk-логикой
- [x] Pricing layer в карточках модерации
- [x] Улучшенный /admin/content для Журнала
- [x] Docs: admin-mvp, moderation-model, pricing-layer

## Phase 1.9: Supplier Import + Moderation Workflow MVP ✅ (Sprint 3)
- [x] Supplier Import foundation (типы + моки)
  - supplierName, supplierSku, rawTitle, normalizedTitle
  - suggestedCategory, unitType, costPrice, stock
  - imageSource, confidence, warnings/notes
- [x] Import → moderation flow
  - Связь с moderation status (new/review/published)
  - Confidence levels (high/medium/low)
  - Items с низкой confidence → candidate for review
- [x] Basic deduplication hints
  - slug match, title similarity, supplier SKU match
  - Severity indicator (high/medium/low)
- [x] Decision notes block
  - Почему предложена категория
  - Почему выбран unit type
  - Почему есть warning
  - Почему confidence высокий/средний/низкий
- [x] Admin integration
  - Вкладка "Импорт поставщиков" в /admin/moderation
  - Import batches summary
  - Фильтры по confidence и дубликатам
- [x] Docs: supplier-import.md, updated moderation-model.md, admin-mvp.md

## Phase 2: Data & Content (следующая)
- [ ] Добавить реальные изображения в public/images
- [ ] Подключить базу данных (CMS/Directus/Supabase)
- [ ] Новости (полноценные)
- [ ] Отзывы (с ответами)

## Phase 3: Commerce
- [ ] Cart functionality
- [ ] Checkout flow
- [ ] Payment integration
- [ ] Order management

## Phase 4: Admin
- [ ] Product CRUD
- [ ] Order management
- [ ] Analytics dashboard
- [ ] Расширенная модерация

## Phase 5: User Features
- [ ] User accounts
- [ ] Order history
- [ ] Wishlists

## Future
- Voice input для поиска (архитектура готова)
- Telegram bot integration
- Push notifications
- Mobile app
