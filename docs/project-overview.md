# Project Overview

## Текущее состояние

- **Build**: ✅ успешно
- **Lint**: ⚠️ 1 warning (Link imported but unused в moderation)
- **Next.js**: 16.2.0
- **TypeScript**: ✅

## Структура

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Главная (MVP freeze)
│   ├── catalog/           # Каталог товаров
│   ├── product/[slug]/    # Карточка товара
│   ├── admin/             # Admin skeleton
│   │   ├── moderation/    # Модерация (new→review→published)
│   │   └── content/       # Контент (drafts)
│   └── ...pages
├── components/            # UI компоненты
│   ├── FallbackImage.tsx # Safe image loading
│   └── ...
└── lib/
    ├── types.ts           # TypeScript definitions
    ├── pricing.ts         # Price helpers
    └── data.ts            # Mock data
```

## Риски

- **Изображения**: папка `public/images` отсутствует, используется fallback `/images/placeholder.svg`
- **Моки**: данные в `data.ts` — для демо, не для прода

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- ESLint
