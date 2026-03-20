"use client";

import { useState, useMemo } from "react";
import { Product, CategorySlug } from "@/lib/types";
import { searchProducts, checkVoiceSupport } from "@/lib/search";
import { SearchInput } from "./SearchInput";
import { SearchResults } from "./SearchResults";

type CatalogSearchProps = {
  products: Product[];
  initialCategory?: CategorySlug;
};

/**
 * CatalogSearch - обёртка для поиска в каталоге
 * 
 * Client component для управления состоянием поиска
 * Подготовлен для voice input
 */
export function CatalogSearch({ products, initialCategory }: CatalogSearchProps) {
  const [query, setQuery] = useState("");
  
  // Проверка поддержки voice input
  const isVoiceSupported = useMemo(() => checkVoiceSupport(), []);

  // Фильтрация товаров
  const filteredProducts = useMemo(() => {
    if (!query) {
      // Если нет поиска, показываем все товары категории
      if (initialCategory) {
        return products.filter((p) => p.category === initialCategory);
      }
      return products;
    }
    
    // Применяем поиск
    const results = searchProducts(products, query);
    
    // Если указана категория, дополнительно фильтруем
    if (initialCategory) {
      return results.filter((p) => p.category === initialCategory);
    }
    
    return results;
  }, [products, query, initialCategory]);

  // Очистка поиска
  const handleClearSearch = () => {
    setQuery("");
  };

  // Обработчик для voice input (future)
  const handleVoiceClick = () => {
    // TODO: Реализовать voice input
    // Web Speech API будет использовать тот же setQuery
    console.log("Voice input not implemented yet");
  };

  return (
    <div className="space-y-6">
      {/* Поисковая строка */}
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Поиск по каталогу: чай, пуэр, гайван..."
        onVoiceClick={handleVoiceClick}
        isVoiceSupported={isVoiceSupported}
      />

      {/* Результаты поиска */}
      <SearchResults
        products={filteredProducts}
        query={query}
        onClearSearch={handleClearSearch}
      />
    </div>
  );
}
