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

export type PriceNormalization = {
  supplierPrice: {
    perKg?: number;
    perPack?: number;
    perUnit?: number;
  };
  packaging: {
    gramsOptions?: number[]; // для весового чая
    defaultGrams?: number;
    unitLabel?: string;
  };
  sitePrice: {
    suggested: number;
    overridden?: number;
    locked?: boolean;
  };
};

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
  price: PriceNormalization;
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

export type AdminModerationCard = {
  id: string;
  vendor: string;
  proposedName: string;
  type: Product["type"];
  category: CategorySlug;
  price: number;
  stock: string;
  photoSource: string;
  confidence: string;
  comment: string;
  image: string;
  queue: "ready" | "review" | "incoming" | "rework" | "hidden";
};

export type AdminContentDraft = {
  id: string;
  kind: "news" | "review-reply";
  title: string;
  summary: string;
  status: "draft" | "needs-review" | "needs-fix";
};
