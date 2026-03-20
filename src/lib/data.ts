import { AdminContentDraft, AdminModerationCard, NewsItem, Product, ReviewItem } from "@/lib/types";

export const categories = [
  {
    slug: "tea",
    title: "Чай",
    description: "Пуэр, улун, зелёный, красный, белый, жасминовый, японский, редкие регионы.",
    image: "/images/cat-tea.jpg",
  },
  {
    slug: "tea-drinks",
    title: "Чайные напитки",
    description: "Травяные, фруктовые, цветочные и сезонные безкофеиновые сборы.",
    image: "/images/cat-drinks.jpg",
  },
  {
    slug: "teaware",
    title: "Чайная посуда",
    description: "Чайники, гайвани, пиалы, чабани, чайницы и аккуратные наборы.",
    image: "/images/cat-teaware.jpg",
  },
  {
    slug: "gifts",
    title: "Подарки",
    description: "Готовые наборы, шуберы, упаковка и связки с посудой.",
    image: "/images/cat-gifts.jpg",
  },
];

export const products: Product[] = [
  {
    id: "puer-amber",
    slug: "shou-puer-amber",
    title: "Шу пуэр «Тёплый янтарь»",
    subtitle: "Глубокий вкус какао и кедровой коры",
    description: "Мягкий выдержанный шу пуэр с кремовой текстурой и чистым послевкусием.",
    type: "tea",
    category: "tea",
    teaKind: "puer",
    flavor: "Какао, чернослив, ель",
    aroma: "Древесный, сладковатый",
    brew: "95°C, 7–9 г на 120 мл, 10–12 проливов",
    fits: "Вечерний ритуал, спокойные встречи",
    characteristics: ["Выдержанный", "Плотное тело", "Низкая терпкость"],
    image: "/images/products/puer-amber.jpg",
    inStock: true,
    price: {
      supplierPrice: { perKg: 5200 },
      packaging: { gramsOptions: [50, 100, 250], defaultGrams: 100, unitLabel: "г" },
      sitePrice: { suggested: 820, overridden: 870 },
    },
  },
  {
    id: "oolong-nectar",
    slug: "oolong-nectar",
    title: "Улун «Нектаровый склон»",
    subtitle: "Цветочный профиль с медовой нотой",
    description: "Тайваньский высокогорный улун с чистым, прозрачным настоем и долгим сладким послевкусием.",
    type: "tea",
    category: "tea",
    teaKind: "oolong",
    flavor: "Орхидея, мёд, персик",
    aroma: "Цветочный, мёд",
    brew: "92°C, 6–7 г на 120 мл, 8–10 проливов",
    fits: "Дневной чай, подарочные сетки",
    characteristics: ["Высокогорный", "Сладкое послевкусие", "Низкая терпкость"],
    image: "/images/products/oolong-nectar.jpg",
    inStock: true,
    price: {
      supplierPrice: { perKg: 7800 },
      packaging: { gramsOptions: [50, 100], defaultGrams: 50, unitLabel: "г" },
      sitePrice: { suggested: 1150 },
    },
  },
  {
    id: "teapot-clay",
    slug: "teapot-zisha-soft",
    title: "Глиняный чайник Zisha 180 мл",
    subtitle: "Ручная работа, средний обжиг",
    description: "Стабильно держит температуру, раскрывает улуны и пуэры без лишней терпкости.",
    type: "teaware",
    category: "teaware",
    teawareKind: "teapot",
    material: "Циша, средний обжиг",
    purpose: "Улуны, шу и шэн пуэры",
    care: "Промывать горячей водой, не использовать моющие средства",
    image: "/images/products/teapot-zisha.jpg",
    inStock: true,
    price: {
      supplierPrice: { perUnit: 5200 },
      packaging: { unitLabel: "шт" },
      sitePrice: { suggested: 8900, overridden: 9200, locked: true },
    },
  },
  {
    id: "gift-warm",
    slug: "gift-warm-evening",
    title: "Подарок «Тёплый вечер»",
    subtitle: "Шу пуэр, травяной сбор и пара пиал",
    description: "Готовый сет с фирменной шубер-упаковкой и открыткой.",
    type: "gift",
    category: "gifts",
    giftKind: "with-teaware",
    composition: ["Шу пуэр 100 г", "Травяной сбор 50 г", "Пиалы 2 шт", "Открытка"],
    packaging: "Шубер с жёлтой текстурой и лентой",
    forWhom: "Тёплый подарок друзьям и партнёрам",
    image: "/images/products/gift-warm.jpg",
    inStock: false,
    price: {
      supplierPrice: { perPack: 2400 },
      packaging: { unitLabel: "сет" },
      sitePrice: { suggested: 4200 },
    },
  },
];

export const news: NewsItem[] = [
  {
    slug: "harvest-oolongs",
    title: "Свежий завоз высокогорных улунов",
    excerpt: "Добавили четыре позиции с мягким жаром и чистым цветочным профилем.",
    date: "2026-03-18",
  },
  {
    slug: "gift-line",
    title: "Обновили подарочные наборы к весеннему сезону",
    excerpt: "Шуберы с фирменной текстурой, новые связки с посудой и открытками.",
    date: "2026-03-10",
  },
];

export const reviews: ReviewItem[] = [
  {
    id: "r1",
    author: "Анна",
    rating: 5,
    text: "Пуэр «Тёплый янтарь» — мягкий и чистый вкус, без землистости. Упаковка аккуратная.",
    productSlug: "shou-puer-amber",
  },
  {
    id: "r2",
    author: "Дмитрий",
    rating: 4,
    text: "Глиняный чайник прогрели — улуны звучат ярче. Доставка в тот же день по Москве.",
  },
];

export const adminModeration: AdminModerationCard[] = [
  {
    id: "m1",
    vendor: "Yunnan Craft",
    proposedName: "Шу пуэр Линцан 2019",
    type: "tea",
    category: "tea",
    price: 4800,
    stock: "Есть на складе поставщика",
    photoSource: "Поставщик",
    confidence: "0.82",
    comment: "Нужен нейминг более тёплый и понятный",
    image: "/images/moderation/puer.jpg",
    queue: "review",
  },
  {
    id: "m2",
    vendor: "Local Studio",
    proposedName: "Пиалы белая глина",
    type: "teaware",
    category: "teaware",
    price: 1400,
    stock: "Ожидается",
    photoSource: "Дизайнер",
    confidence: "0.74",
    comment: "Проверить объём и фото в реальном освещении",
    image: "/images/moderation/bowls.jpg",
    queue: "incoming",
  },
];

export const adminContentDrafts: AdminContentDraft[] = [
  {
    id: "d1",
    kind: "news",
    title: "Черновик: весенний гид по подаркам",
    summary: "Подборка наборов с шуберами и мягкой упаковкой.",
    status: "draft",
  },
  {
    id: "d2",
    kind: "review-reply",
    title: "Ответ на отзыв Анна / пуэр",
    summary: "Поблагодарить, уточнить по доставке, предложить дегустацию улунов.",
    status: "needs-review",
  },
];
