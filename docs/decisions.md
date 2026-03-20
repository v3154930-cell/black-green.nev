# Architectural Decisions

## Design System

### Color Palette
- Primary: #1f5f46 (leaf green)
- Ink: #0f2d22 (dark green)
- Background: #f8f8f6 (warm off-white)
- Accent: #f5d77f (amber gold)

### Typography
- Geist Sans for body
- Custom eyebrow styles for section labels

### Layout
- Framed layout on XL screens (desktop only)
- Central content area with heritage texture background
- Mobile-first responsive design

### Components
- Cards: White background, subtle shadows
- Buttons: Rounded corners (12px), green primary
- Links: Underline animation on hover

## Tech Decisions

### Tailwind v3
Using v3.4 with PostCSS for stability

### No External UI Library
Custom components for full design control

### Static Data
Using mock data in src/lib/data.ts for development
