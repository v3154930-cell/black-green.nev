# Black Green New

Next.js storefront for Black Green tea shop.

## Getting Started

```bash
npm run dev
```

Open http://localhost:3000

## Routes

### Storefront
- / - Main page with 13 content blocks
- /catalog - Product catalog
- /catalog/[category] - Category page
- /product/[slug] - Product detail
- /about - About
- /contacts - Contacts
- /delivery - Delivery info
- /news - News listing
- /news/[slug] - News article
- /reviews - Customer reviews

### Admin
- /admin - Dashboard overview
- /admin/moderation - Content moderation queue
- /admin/content - Content drafts management

## Commands

```bash
npm run dev    # Development server
npm run build  # Production build
npm run lint   # ESLint check
npm run start  # Start production server
```

## Status

**Development** - Mock data in use

## Tech Stack

- Next.js 16.2.0
- TypeScript
- Tailwind CSS 3.4
- React 19

## Documentation

See docs/ folder for project summary, architectural decisions, and roadmap.
