import { AdminContentDraft, AdminModerationCard, CsvRow, ImportBatch, NewsItem, Product, RawImportRow, ReviewItem, SupplierImportItem, ValidationResult, ColumnMapping, EligibilityResult, RejectReason, ReviewReason, EligibleImportRow, BatchEligibilityStats } from "@/lib/types";

// ========================================
// FILE INTAKE HELPERS (Sprint 4)
// ========================================

// Мок CSV данные для preview
export const mockCsvData: CsvRow[] = [
  { "SKU": "YC-PUER-2019-100", "Название": "Shou Puer Tea 2019 Linzhang", "Цена": "2800", "Остаток": "50", "Картинка": "/images/puer.jpg", "Категория": "tea", "Тип": "weight" },
  { "SKU": "TAS-GAIWAN-120-W", "Название": "Gaiwan White Ceramic 120ml", "Цена": "850", "Остаток": "0", "Картинка": "/images/gaiwan.jpg", "Категория": "teaware", "Тип": "piece" },
  { "SKU": "FG-DHP-CLASSIC-50", "Название": "Da Hong Pao Classic 2024", "Цена": "1800", "Остаток": "30", "Картинка": "/images/dahongpao.jpg", "Категория": "tea", "Тип": "weight" },
  { "SKU": "GM-GREEN-LU-50", "Название": "Green Tea Lu Shan", "Цена": "520", "Остаток": "100", "Картинка": "/images/green.jpg", "Категория": "", "Тип": "weight" },
  { "SKU": "CP-BOWL-WHITE-150", "Название": "", "Цена": "1200", "Остаток": "25", "Картинка": "/images/bowl.jpg", "Категория": "teaware", "Тип": "piece" },
  { "SKU": "", "Название": "White Clay Bowl 150ml", "Цена": "-100", "Остаток": "25", "Картинка": "", "Категория": "teaware", "Тип": "piece" },
];

// Мок колонок
export const mockCsvColumns = ["SKU", "Название", "Цена", "Остаток", "Картинка", "Категория", "Тип"];

// Дефолтный маппинг
export const defaultMapping: ColumnMapping = {
  supplierSku: "SKU",
  rawTitle: "Название",
  costPrice: "Цена",
  stock: "Остаток",
  imageSource: "Картинка",
  categoryHint: "Категория",
  typeHint: "Тип",
};

// Валидация одной строки
export function validateRow(row: CsvRow, mapping: ColumnMapping): ValidationResult {
  const errors: ValidationResult["errors"] = [];
  const warnings: ValidationResult["warnings"] = [];

  const sku = row[mapping.supplierSku || ""] || "";
  const title = row[mapping.rawTitle || ""] || "";
  const priceStr = row[mapping.costPrice || ""] || "";
  const stockStr = row[mapping.stock || ""] || "0";
  const category = row[mapping.categoryHint || ""] || "";
  const unitType = row[mapping.typeHint || ""] || "";

  // Errors
  if (!sku.trim()) {
    errors.push({ field: "supplierSku", message: "Отсутствует SKU" });
  }

  if (!title.trim()) {
    errors.push({ field: "rawTitle", message: "Отсутствует название" });
  }

  if (!priceStr.trim()) {
    errors.push({ field: "costPrice", message: "Отсутствует цена" });
  } else {
    const price = parseFloat(priceStr);
    if (isNaN(price) || price < 0) {
      errors.push({ field: "costPrice", message: "Некорректная цена" });
    }
  }

  // Warnings
  if (!category.trim()) {
    warnings.push({ field: "category", message: "Не указана категория" });
  }

  if (!unitType.trim()) {
    warnings.push({ field: "unitType", message: "Не указан тип единицы" });
  }

  if (!row[mapping.imageSource || ""]?.trim()) {
    warnings.push({ field: "imageSource", message: "Нет изображения" });
  }

  // Check for negative stock
  const stock = parseInt(stockStr, 10);
  if (!isNaN(stock) && stock < 0) {
    warnings.push({ field: "stock", message: "Отрицательный остаток" });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Применение маппинга к строкам
export function applyMapping(rows: CsvRow[], mapping: ColumnMapping): RawImportRow[] {
  return rows.map((data, index) => {
    const validation = validateRow(data, mapping);

    return {
      rowIndex: index + 1,
      data,
      mapping,
      validation,
      supplierSku: data[mapping.supplierSku || ""] || undefined,
      rawTitle: data[mapping.rawTitle || ""] || undefined,
      costPrice: parseFloat(data[mapping.costPrice || ""] || "0"),
      stock: parseInt(data[mapping.stock || ""] || "0", 10),
      imageSource: data[mapping.imageSource || ""] || undefined,
    };
  });
}



// ========================================
// ELIGIBILITY GATE (Sprint 5)
// ========================================

// Ключевые слова для hard reject
const REJECT_KEYWORDS: Record<RejectReason, string[]> = {
  coffee: ["coffee", "кофе", "espresso", "капучино", "латте", "beans", "зёрна"],
  mate: ["mate", "мате", "мать", "yerba", "йерба"],
  packaging_no_core: ["пакет", "пакетик", "без", "обычная упаковка", "simple bag", " одноразов", "салфетк", "полотенце"],
  outside_core_category: ["печенье", "конфет", "шоколад", "вода", "сок", "пиво", "алкоголь", "сигарет", "мыло", "косметик"],
  invalid_row: ["test", "test", "xxx", "test"], // мусорные строки
  ambiguous: [], // заполняется динамически
};

// Ключевые слова для core ассортимента
const CORE_KEYWORDS = [
  // Чай
  "puer", "пуэр", "улун", "oolong", "green tea", "красный чай", "белый чай", "жасмин", "shou", "shen", "da hong pao", "тигуанинь",
  // Чайные напитки
  "herbal", "травяной", "fruit", "фруктовый", "rooibos", "ройбуш", "hibiscus", "каркаде",
  // Чайная посуда
  "gaiwan", "гайван", "teapot", "чайник", "cup", "пиала", "pitcher", "чабан", "caddy", "чайниц", "tray", "поднос", "teaware", "посуда",
  // Подарки
  "gift", "подарок", "набор", "сет", "шубер", "подарочн", "упаковка", "sleeve",
];

// Категории ядра
export const CORE_CATEGORIES: Record<string, string[]> = {
  tea: ["tea", "чай", "puer", "пуэр", "улун", "oolong", "green", "красный", "белый", "shou", "shen"],
  "tea-drinks": ["tea-drinks", "травяной", "herbal", "fruit", "rooibos", "ройбуш"],
  teaware: ["teaware", "gaiwan", "чайник", "пиала", "гайван", "чабан", "pitcher", "caddy"],
  gifts: ["gift", "подарок", "набор", "шубер", "упаковка"],
};

// Определение eligibility для строки
export function checkEligibility(row: RawImportRow): { result: EligibilityResult; reason?: RejectReason | ReviewReason } {
  const title = (row.rawTitle || "").toLowerCase();
  const category = (row.data[row.mapping.categoryHint || ""] || "").toLowerCase();
  const sku = (row.supplierSku || "").
 toLowerCase();

  // Сначала проверяем hard reject правила
  // 1. Кофе
  if (REJECT_KEYWORDS.coffee.some(kw => title.includes(kw) || sku.includes(kw))) {
    return { result: "hard_reject", reason: "coffee" };
  }

  // 2. Мате (матэ)
  if (REJECT_KEYWORDS.mate.some(kw => title.includes(kw))) {
    return { result: "hard_reject", reason: "mate" };
  }

  // 3. Нецелевая упаковка
  if (REJECT_KEYWORDS.packaging_no_core.some(kw => title.includes(kw))) {
    return { result: "hard_reject", reason: "packaging_no_core" };
  }

  // 4. Явно не в ассортименте
  if (REJECT_KEYWORDS.outside_core_category.some(kw => title.includes(kw))) {
    return { result: "hard_reject", reason: "outside_core_category" };
  }

  // 5. Мусорные строки (пустые или тестовые)
  if (!title.trim() || REJECT_KEYWORDS.invalid_row.some(kw => title.includes(kw))) {
    return { result: "hard_reject", reason: "invalid_row" };
  }

  // Проверяем, относится ли к core ассортименту
  const isCoreTitle = CORE_KEYWORDS.some(kw => title.includes(kw.toLowerCase()));
  const isCoreCategory = Object.values(CORE_CATEGORIES).some(arr => 
    arr.some(kw => category.includes(kw.toLowerCase()))
  );

  // Не в ядре
  if (!isCoreTitle && !isCoreCategory) {
    return { result: "hard_reject", reason: "outside_core_category" };
  }

  // Теперь проверяем soft_review условия
  // Неочевидная категория
  if (isCoreTitle && !isCoreCategory && title.trim()) {
    return { result: "soft_review", reason: "unclear_category" };
  }

  // Спорный тип товара (есть ключевые слова но неоднозначно)
  const ambiguousCount = CORE_KEYWORDS.filter(kw => title.includes(kw.toLowerCase())).length;
  if (ambiguousCount > 2) {
    return { result: "soft_review", reason: "ambiguous_type" };
  }

  // Низкая уверенность из-за warnings
  if (row.validation.warnings.length > 2) {
    return { result: "soft_review", reason: "low_confidence" };
  }

  // PASS - всё ок
  return { result: "pass" };
}

// Применение eligibility gate к строкам
export function applyEligibilityGate(rows: RawImportRow[]): EligibleImportRow[] {
  return rows.map(row => {
    const { result, reason } = checkEligibility(row);
    
    const eligibleRow: EligibleImportRow = {
      ...row,
      eligibility: result,
      rejectReason: result === "hard_reject" ? (reason as RejectReason) : undefined,
      reviewReason: result === "soft_review" ? (reason as ReviewReason) : undefined,
    };

    // Создаём SupplierImportItem только для pass и soft_review
    if (result !== "hard_reject" && row.validation.isValid) {
      // Здесь мог бы быть transform в SupplierImportItem
      // Для MVP оставляем заглушку
      eligibleRow.supplierImportItem = {
        supplierName: "", // будет заполнено из контекста
        supplierSku: row.supplierSku || "",
        rawTitle: row.rawTitle || "",
        normalizedTitle: row.rawTitle || "", // MVP: просто копируем
        suggestedCategory: "tea", // будет определено позже
        suggestedType: "tea", // дефолт
        unitType: "weight", // дефолт
        costPrice: row.costPrice || 0,
        stock: row.stock || 0,
        stockStatus: row.stock && row.stock > 0 ? "in-stock" : "out-of-stock",
        imageSource: row.imageSource || "",
        confidence: row.validation.isValid ? 0.8 : 0.5,
        confidenceLevel: row.validation.isValid ? "high" : "medium",
        warnings: row.validation.warnings.map(w => w.message),
        notes: [],
        decisionNotes: [],
        duplicationHints: [],
        importedAt: new Date().toISOString(),
        importBatchId: "",
      };
    }

    return eligibleRow;
  });
}

// Подсчёт статистики eligibility
export function getEligibilityStats(rows: EligibleImportRow[]): BatchEligibilityStats {
  const stats: BatchEligibilityStats = {
    total: rows.length,
    pass: 0,
    softReview: 0,
    hardReject: 0,
    rejectReasons: { coffee: 0, mate: 0, packaging_no_core: 0, outside_core_category: 0, invalid_row: 0, ambiguous: 0 },
    reviewReasons: { unclear_category: 0, ambiguous_type: 0, low_confidence: 0 },
  };

  rows.forEach(row => {
    if (row.eligibility === "pass") stats.pass++;
    else if (row.eligibility === "soft_review") {
      stats.softReview++;
      if (row.reviewReason) stats.reviewReasons[row.reviewReason]++;
    }
    else if (row.eligibility === "hard_reject") {
      stats.hardReject++;
      if (row.rejectReason) stats.rejectReasons[row.rejectReason]++;
    }
  });

  return stats;
}

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
      price: { costPrice: 520, suggestedPrice: 820, manualOverride: 870 },
      packaging: { unitType: "weight", weightOptions: [50, 100, 250], defaultWeight: 100 },
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
      price: { costPrice: 390, suggestedPrice: 1150 },
      packaging: { unitType: "weight", weightOptions: [50, 100], defaultWeight: 50 },
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
      price: { costPrice: 5200, suggestedPrice: 8900, manualOverride: 9200, isLocked: true },
      packaging: { unitType: "piece", maxQuantity: 1 },
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
      price: { costPrice: 2400, suggestedPrice: 4200 },
      packaging: { unitType: "pack", maxQuantity: 1 },
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

// MVP модерация: new → review → published
export const adminModeration: AdminModerationCard[] = [
  {
    id: "m1",
    vendor: "Yunnan Craft",
    proposedName: "Шу пуэр Линцан 2019",
    type: "tea",
    category: "tea",
    price: 4800,
    priceConfig: {
      price: { costPrice: 2800, suggestedPrice: 4800 },
      packaging: { unitType: "weight", weightOptions: [50, 100, 250], defaultWeight: 100 },
    },
    stock: "Есть на складе поставщика",
    photoSource: "Поставщик",
    confidence: "0.82",
    comment: "Нужен нейминг более тёплый и понятный",
    image: "/images/moderation/puer.jpg",
    status: "new",
    updatedAt: "2026-03-20T10:00:00Z",
  },
  {
    id: "m2",
    vendor: "Local Studio",
    proposedName: "Пиалы белая глина",
    type: "teaware",
    category: "teaware",
    price: 1400,
    priceConfig: {
      price: { costPrice: 850, suggestedPrice: 1400, manualOverride: 1600 },
      packaging: { unitType: "piece", maxQuantity: 1 },
    },
    stock: "Ожидается",
    photoSource: "Дизайнер",
    confidence: "0.74",
    comment: "Проверить объём и фото в реальном освещении",
    image: "/images/moderation/bowls.jpg",
    status: "review",
    updatedAt: "2026-03-19T14:30:00Z",
  },
  {
    id: "m3",
    vendor: "Fujian Gardens",
    proposedName: "Да Хун Пао классический",
    type: "tea",
    category: "tea",
    price: 3200,
    priceConfig: {
      price: { costPrice: 1800, suggestedPrice: 3200 },
      packaging: { unitType: "weight", weightOptions: [25, 50, 100], defaultWeight: 50 },
    },
    stock: "В наличии",
    photoSource: "Поставщик",
    confidence: "0.91",
    comment: "Отличное качество, проверенный поставщик",
    image: "/images/moderation/dahongpao.jpg",
    status: "published",
    updatedAt: "2026-03-15T09:00:00Z",
  },
  {
    id: "m4",
    vendor: "Tea Craft",
    proposedName: "Зелёный чай Лу Шань",
    type: "tea",
    category: "tea",
    price: 890,
    priceConfig: {
      price: { costPrice: 520, suggestedPrice: 890 },
      packaging: { unitType: "weight", weightOptions: [50, 100], defaultWeight: 50 },
    },
    stock: "В наличии",
    photoSource: "Поставщик",
    confidence: "0.67",
    comment: "Требует дегустации, фото не очень",
    image: "/images/moderation/green.jpg",
    status: "new",
    updatedAt: "2026-03-20T11:30:00Z",
  },
  {
    id: "m5",
    vendor: "Ceramic Art",
    proposedName: "Гайвань белая 120мл",
    type: "teaware",
    category: "teaware",
    price: 1200,
    priceConfig: {
      price: { costPrice: 600, suggestedPrice: 1200 },
      packaging: { unitType: "piece", maxQuantity: 1 },
    },
    stock: "В наличии",
    photoSource: "Дизайнер",
    confidence: "0.88",
    comment: "Хорошая геометрия, ровный обжиг",
    image: "/images/moderation/gaiwan.jpg",
    status: "review",
    updatedAt: "2026-03-18T16:00:00Z",
  },
];

// ========================================
// SUPPLIER IMPORT (Sprint 3)
// MVP Supplier Import: входящие товары от поставщиков
export const supplierImports: SupplierImportItem[] = [
  {
    supplierName: "Yunnan Craft",
    supplierSku: "YC-PUER-2019-100",
    rawTitle: "Shou Puer Tea 2019 Linzhang",
    normalizedTitle: "Шу пуэр Линцан 2019",
    suggestedCategory: "tea",
    suggestedType: "tea",
    unitType: "weight",
    costPrice: 2800,
    stock: 50,
    stockStatus: "in-stock",
    imageSource: "/images/moderation/puer.jpg",
    confidence: 0.82,
    confidenceLevel: "high",
    warnings: [],
    notes: ["Проверенный поставщик", "Высокое качество сырья"],
    moderationId: "m1",
    moderationStatus: "new",
    decisionNotes: [
      { field: "category", reason: "Тип чая: шу пуэр → категория 'tea'", confidence: "high" },
      { field: "unitType", reason: "Чай на вес → weight", confidence: "high" },
      { field: "confidence", reason: "Проверенный поставщик + точное совпадение типа", confidence: "high" },
    ],
    duplicationHints: [],
    importedAt: "2026-03-20T10:00:00Z",
    importBatchId: "batch-001",
  },
  {
    supplierName: "Tea Art Studio",
    supplierSku: "TAS-GAIWAN-120-W",
    rawTitle: "Gaiwan White Ceramic 120ml",
    normalizedTitle: "Гайвань белая 120мл",
    suggestedCategory: "teaware",
    suggestedType: "teaware",
    unitType: "piece",
    costPrice: 850,
    stock: 0,
    stockStatus: "expected",
    imageSource: "/images/moderation/gaiwan.jpg",
    confidence: 0.74,
    confidenceLevel: "medium",
    warnings: ["Нет фото в реальном освещении", "Требует проверки объёма"],
    notes: [],
    moderationId: "m5",
    moderationStatus: "review",
    decisionNotes: [
      { field: "category", reason: "Гайвань → категория 'teaware'", confidence: "high" },
      { field: "unitType", reason: "Штучный товар → piece", confidence: "high" },
      { field: "confidence", reason: "Средняя уверенность из-за отсутствия фото", confidence: "medium" },
      { field: "warnings", reason: "Нет фото в реальном освещении", confidence: "medium" },
    ],
    duplicationHints: [
      {
        type: "title-similarity",
        matchedProductTitle: "Гайвань белая 120мл",
        similarity: 0.95,
        severity: "high",
      },
    ],
    importedAt: "2026-03-18T16:00:00Z",
    importBatchId: "batch-001",
  },
  {
    supplierName: "Fujian Gardens",
    supplierSku: "FG-DHP-CLASSIC-50",
    rawTitle: "Da Hong Pao Classic 2024",
    normalizedTitle: "Да Хун Пао классический",
    suggestedCategory: "tea",
    suggestedType: "tea",
    unitType: "weight",
    costPrice: 1800,
    stock: 30,
    stockStatus: "in-stock",
    imageSource: "/images/moderation/dahongpao.jpg",
    confidence: 0.91,
    confidenceLevel: "high",
    warnings: [],
    notes: ["Премиальный поставщик", "Проверенный продукт"],
    moderationId: "m3",
    moderationStatus: "published",
    decisionNotes: [
      { field: "category", reason: "Да Хун Пао → категория 'tea'", confidence: "high" },
      { field: "unitType", reason: "Чай на вес → weight", confidence: "high" },
      { field: "confidence", reason: "Премиальный поставщик, точное совпадение", confidence: "high" },
    ],
    duplicationHints: [],
    importedAt: "2026-03-15T09:00:00Z",
    importBatchId: "batch-001",
  },
  {
    supplierName: "Green Mountain",
    supplierSku: "GM-GREEN-LU-50",
    rawTitle: "Green Tea Lu Shan",
    normalizedTitle: "Зелёный чай Лу Шань",
    suggestedCategory: "tea",
    suggestedType: "tea",
    unitType: "weight",
    costPrice: 520,
    stock: 100,
    stockStatus: "in-stock",
    imageSource: "/images/moderation/green.jpg",
    confidence: 0.67,
    confidenceLevel: "low",
    warnings: ["Требует дегустации","Фото низкого качества"],
    notes: [],
    moderationId: "m4",
    moderationStatus: "new",
    decisionNotes: [
      { field: "category", reason: "Зелёный чай → категория 'tea'", confidence: "high" },
      { field: "unitType", reason: "Чай на вес → weight", confidence: "high" },
      { field: "confidence", reason: "Низкая уверенность: требуется дегустация, фото низкого качества", confidence: "low" },
      { field: "warnings", reason: "Требует дегустации перед публикацией", confidence: "high" },
    ],
    duplicationHints: [],
    importedAt: "2026-03-20T11:30:00Z",
    importBatchId: "batch-002",
  },
  {
    supplierName: "Ceramic Plus",
    supplierSku: "CP-BOWL-WHITE-150",
    rawTitle: "White Clay Bowl 150ml",
    normalizedTitle: "Пиала белая глина 150мл",
    suggestedCategory: "teaware",
    suggestedType: "teaware",
    unitType: "piece",
    costPrice: 1200,
    stock: 25,
    stockStatus: "in-stock",
    imageSource: "/images/moderation/bowls.jpg",
    confidence: 0.55,
    confidenceLevel: "low",
    warnings: ["Возможный дубль существующего товара"],
    notes: [],
    decisionNotes: [
      { field: "category", reason: "Пиала → категория 'teaware'", confidence: "high" },
      { field: "unitType", reason: "Штучный товар → piece", confidence: "high" },
      { field: "confidence", reason: "Возможный дубль → снижена уверенность", confidence: "low" },
      { field: "warnings", reason: "Возможный дубль: 'Пиала белая глина' уже существует", confidence: "high" },
    ],
    duplicationHints: [
      {
        type: "slug-match",
        matchedProductSlug: "bowl-white-clay",
        matchedProductTitle: "Пиала белая глина",
        severity: "high",
      },
      {
        type: "title-similarity",
        matchedProductTitle: "Пиала белая глина 180 мл",
        similarity: 0.88,
        severity: "medium",
      },
    ],
    importedAt: "2026-03-20T14:00:00Z",
    importBatchId: "batch-002",
  },
];

// Batch импорта (MVP - для UI)
export const importBatches: ImportBatch[] = [
  {
    id: "batch-001",
    supplierName: "Yunnan Craft",
    importedAt: "2026-03-20T10:00:00Z",
    totalItems: 3,
    newItems: 1,
    reviewItems: 1,
    publishedItems: 1,
    status: "processed",
  },
  {
    id: "batch-002",
    supplierName: "Green Mountain",
    importedAt: "2026-03-20T11:30:00Z",
    totalItems: 2,
    newItems: 1,
    reviewItems: 0,
    publishedItems: 0,
    status: "pending",
  },
];

export const adminContentDrafts: AdminContentDraft[] = [
  {
    id: "d1",
    kind: "news",
    title: "Черновик: весеннее руководство по подаркам",
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
