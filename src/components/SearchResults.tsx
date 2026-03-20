import Link from "next/link";
import { Search, ArrowRight, X } from "lucide-react";
import { Product } from "@/lib/types";
import { getDisplayPrice } from "@/lib/pricing";

type SearchResultsProps = {
  products: Product[];
  query: string;
  onClearSearch: () => void;
};

/**
 * SearchResults - отображение результатов поиска
 * 
 * Включает:
 * - Список найденных товаров
 * - Пустую выдачу (empty state)
 */
export function SearchResults({ products, query, onClearSearch }: SearchResultsProps) {
  // Пустая выдача - нет результатов
  if (products.length === 0) {
    return (
      <EmptySearchState query={query} onClearSearch={onClearSearch} />
    );
  }

  // Есть результаты
  return (
    <div className="space-y-4">
      {/* Количество результатов */}
      <p className="text-sm text-[var(--text-muted)]">
        Найдено {products.length} {products.length === 1 ? "товар" : products.length < 5 ? "товара" : "товаров"}
        {query && <> по запросу «<span className="text-[var(--text-primary)]">{query}</span>»</>}
      </p>

      {/* Сетка товаров */}
      <div className="grid-cards">
        {products.map((product) => (
          <Link
            key={product.slug}
            href={`/product/${product.slug}`}
            className="card-surface p-4 space-y-3"
          >
            <div className="text-sm text-[var(--text-muted)]">{product.subtitle}</div>
            <div className="text-lg font-semibold text-[var(--text-primary)]">{product.title}</div>
            <div className="text-sm text-[var(--text-secondary)] line-clamp-2">
              {product.description}
            </div>
            <div className="text-sm text-[var(--text-muted)]">
              Цена: {getDisplayPrice(product.price)} ₽
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * EmptySearchState - пустая выдача поиска
 * Аккуратная, дружелюбная, без визуального шума
 */
function EmptySearchState({ query, onClearSearch }: { query: string; onClearSearch: () => void }) {
  return (
    <div className="py-16 px-4 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--bg-subtle)] mb-6">
        <Search className="w-8 h-8 text-[var(--text-muted)]" />
      </div>
      
      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
        Ничего не найдено
      </h3>
      
      <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-6">
        По запросу «{query}» мы не нашли товаров в каталоге.
        Попробуйте изменить запрос или перейдите в каталог.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={onClearSearch}
          className="btn-secondary inline-flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Очистить поиск
        </button>
        
        <Link href="/catalog" className="btn-primary inline-flex items-center gap-2">
          Перейти в каталог
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Подсказки по поиску */}
      <div className="mt-10 text-sm text-[var(--text-muted)]">
        <p className="mb-3">Можно искать:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="px-3 py-1 bg-[var(--bg-subtle)] rounded-full">по названию</span>
          <span className="px-3 py-1 bg-[var(--bg-subtle)] rounded-full">по категории</span>
          <span className="px-3 py-1 bg-[var(--bg-subtle)] rounded-full">по вкусу</span>
          <span className="px-3 py-1 bg-[var(--bg-subtle)] rounded-full">по характеристикам</span>
        </div>
      </div>
    </div>
  );
}
