export type TimeOfDay = "morning" | "day" | "evening" | "night";

export type CategorySlug =
  | "tea"
  | "tea-drinks"
  | "teaware"
  | "gifts";

export type TeaKind =
  | "puer"
  | "oolong"
  | "green"
  | "red"
  | "white"
  | "jasmine"
  | "japanese"
  | "world";

export type TeaDrinkKind =
  | "herbal"
  | "fruit"
  | "floral"
  | "tea-blend"
  | "seasonal";

export type TeawareKind =
  | "teapot"
  | "gaiwan"
  | "cup"
  | "pitcher"
  | "caddy"
  | "tray"
  | "accessory"
  | "set";

export type GiftKind =
  | "assorted"
  | "tea-focused"
  | "with-teaware"
  | "seasonal"
  | "packaging"
  | "sleeve";

// ========== MVP PRICE LAYER ==========

// Тип единицы товара
export type UnitType = "weight" | "pack" | "piece";

// Базовая структура цены
export type PriceInfo = {
  /** Себестоимость (закупочная цена) */
  costPrice: number;
  /** Рекомендованная цена (автонаценка) */
  suggestedPrice: number;
  /** Ручной override (если задан — используется вместо suggested) */
  manualOverride?: number;
  /** Заблокирован ли ручной override */
  isLocked?: boolean;
};

// Упаковка
export type Packaging = {
  /** Тип единицы */
  unitType: UnitType;
  /** Опции веса (только для weight) */
  weightOptions?: number[];
  /** Вес по умолчанию в граммах (только для weight) */
  defaultWeight?: number;
  /** Лимит веса (напр. 250 г — типичная максимальная фасовка) */
  maxWeight?: number;
  /** Лимит количества (для pack/piece) */
  maxQuantity?: number;
};

// Полная ценовая модель товара
export type PriceConfig = {
  price: PriceInfo;
  packaging: Packaging;
};

// Guardrails: результат проверки
export type PriceGuardResult = {
  isValid: boolean;
  warnings: string[];
  errors: string[];
};

// =======================================

export type ProductBase = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  type: "tea" | "teaware" | "gift";
  category: CategorySlug;
  image: string;
  inStock: boolean;
  badges?: string[];
  price: PriceConfig;
};

export type TeaProduct = ProductBase & {
  type: "tea";
  teaKind: TeaKind;
  flavor: string;
  aroma: string;
  brew: string;
  fits: string;
  characteristics: string[];
};

export type TeawareProduct = ProductBase & {
  type: "teaware";
  teawareKind: TeawareKind;
  material: string;
  purpose: string;
  care: string;
};

export type GiftProduct = ProductBase & {
  type: "gift";
  giftKind: GiftKind;
  composition: string[];
  packaging: string;
  forWhom: string;
};

export type Product = TeaProduct | TeawareProduct | GiftProduct;

export type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
};

export type ReviewItem = {
  id: string;
  author: string;
  rating: number;
  text: string;
  productSlug?: string;
};

// MVP: упрощённая модель модерации
// Статусы: new → review → published
// Действия: approve, send_to_review, hide, defer
export type ModerationStatus = "new" | "review" | "published";

export type ModerationAction = "approve" | "send_to_review" | "hide" | "defer";

export type AdminModerationCard = {
  id: string;
  vendor: string;
  proposedName: string;
  type: Product["type"];
  category: CategorySlug;
  /** Цена для отображения (старое поле, для совместимости) */
  price: number;
  /** Pricing layer: собирается из PriceConfig */
  priceConfig?: PriceConfig;
  stock: string;
  photoSource: string;
  confidence: string;
  comment: string;
  image: string;
  status: ModerationStatus;
  updatedAt: string; // ISO date для сортировки
};

// ========== SUPPLIER IMPORT LAYER ==========

// Confidence level для входящих товаров
export type ConfidenceLevel = "high" | "medium" | "low";

// Входящий товар от поставщика (MVP - типы и моки)
export type SupplierImportItem = {
  // Идентификация поставщика
  supplierName: string;
  supplierSku: string; // Артикул поставщика / vendor code
  
  // Названия
  rawTitle: string; // Оригинальное название от поставщика
  normalizedTitle: string; // Нормализованное название (MVP - для отображения)
  
  // Категоризация (MVP - предложенные системой)
  suggestedCategory: CategorySlug;
  suggestedType: Product["type"];
  
  // Упаковка
  unitType: UnitType;
  
  // Ценообразование
  costPrice: number;
  
  // Наличие
  stock: number; // Количество на складе (0 = нет)
  stockStatus: "in-stock" | "out-of-stock" | "expected";
  
  // Изображение
  imageSource: string;
  
  // Confidence score (0-1)
  confidence: number;
  confidenceLevel: ConfidenceLevel;
  
  // Warnings / notes от системы
  warnings: string[];
  notes: string[];
  
  // Связь с модерацией
  moderationId?: string; // Связанная карточка модерации
  moderationStatus?: ModerationStatus;
  
  // Decision notes (почему приняты решения)
  decisionNotes: DecisionNote[];
  
  // Deduplication hints
  duplicationHints: DuplicationHint[];
  
  // Метаданные импорта
  importedAt: string;
  importBatchId: string;
};

// Decision note - пояснение к решению системы
export type DecisionNote = {
  field: string;
  reason: string;
  confidence: ConfidenceLevel;
};

// Deduplication hint - признак возможного дубликата
export type DuplicationHint = {
  type: "slug-match" | "title-similarity" | "supplier-sku-match";
  matchedProductSlug?: string;
  matchedProductTitle?: string;
  similarity?: number; // 0-1 для title-similarity
  severity: "high" | "medium" | "low";
};

// Batch импорта (для UI)
export type ImportBatch = {
  id: string;
  supplierName: string;
  importedAt: string;
  totalItems: number;
  newItems: number;
  reviewItems: number;
  publishedItems: number;
  status: "pending" | "processed" | "partial";
};

// =======================================

export type AdminContentDraft = {
  id: string;
  kind: "news" | "review-reply";
  title: string;
  summary: string;
  status: "draft" | "needs-review" | "needs-fix";
};
