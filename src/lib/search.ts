import { Product, CategorySlug } from "./types";
import { categories } from "./data";

/**
 * Поисковый слой (Search Layer)
 * 
 * MVP-реализация: простой текстовый поиск по каталогу.
 * Архитектура подготовлена для будущего voice input.
 * 
 * Принципы:
 * - Поиск по названию товара, категории, ключевым словам из описания
 * - Простой, быстрый, без внешних зависимостей
 * - Легко расширяется (можно добавить voice через тот же интерфейс)
 */

export type SearchQuery = string;

/**
 * Нормализует строку поиска: lowerCase + trim
 */
function normalizeQuery(query: string): string {
  return query.trim().toLowerCase();
}

/**
 * Проверяет, содержится ли searchTerm в target строке
 */
function containsKeyword(target: string, searchTerm: string): boolean {
  return target.toLowerCase().includes(searchTerm);
}

/**
 * Основная функция поиска товаров
 * 
 * @param products - массив товаров для поиска
 * @param query - поисковый запрос
 * @returns отфильтрованный массив товаров
 */
export function searchProducts(products: Product[], query: SearchQuery): Product[] {
  const normalizedQuery = normalizeQuery(query);
  
  if (!normalizedQuery) {
    return products;
  }

  // Разбиваем запрос на отдельные слова для более гибкого поиска
  const keywords = normalizedQuery.split(/\s+/).filter(Boolean);

  return products.filter((product) => {
    // 1. Поиск по названию товара (высокий приоритет)
    const titleMatch = containsKeyword(product.title, normalizedQuery);
    if (titleMatch) return true;

    // 2. Поиск по подзаголовку
    if (product.subtitle && containsKeyword(product.subtitle, normalizedQuery)) {
      return true;
    }

    // 3. Поиск по категории
    const category = categories.find((c) => c.slug === product.category);
    if (category && containsKeyword(category.title, normalizedQuery)) {
      return true;
    }

    // 4. Поиск по ключевым словам из описания (базовые слова)
    // Берем первые 3-4 слова из описания как ключевые
    const descriptionWords = product.description
      .toLowerCase()
      .split(/\s+/)
      .slice(0, 10);
    
    // Проверяем каждое ключевое слово из запроса
    const descriptionMatch = keywords.some((keyword) =>
      descriptionWords.some((word) => word.includes(keyword) || keyword.includes(word))
    );
    if (descriptionMatch) return true;

    // 5. Для чая - дополнительный поиск по характеристикам
    if (product.type === "tea") {
      const teaProduct = product;
      const teaFields = [
        teaProduct.flavor,
        teaProduct.aroma,
        ...(teaProduct.characteristics || []),
      ];
      
      const teaMatch = teaFields.some((field) => 
        field && containsKeyword(field, normalizedQuery)
      );
      if (teaMatch) return true;
    }

    // 6. Для посуды - поиск по материалу и назначению
    if (product.type === "teaware") {
      const teawareProduct = product;
      const teawareFields = [teawareProduct.material, teawareProduct.purpose];
      
      const teawareMatch = teawareFields.some((field) => 
        field && containsKeyword(field, normalizedQuery)
      );
      if (teawareMatch) return true;
    }

    // 7. Для подарков - поиск по составу и получателю
    if (product.type === "gift") {
      const giftProduct = product;
      const giftFields = [
        ...(giftProduct.composition || []),
        giftProduct.forWhom,
      ];
      
      const giftMatch = giftFields.some((field) => 
        field && containsKeyword(field, normalizedQuery)
      );
      if (giftMatch) return true;
    }

    return false;
  });
}

/**
 * Фильтрация по категории с поддержкой поиска
 */
export function searchProductsInCategory(
  products: Product[], 
  query: SearchQuery, 
  category: CategorySlug
): Product[] {
  // Сначала фильтруем по категории
  const categoryProducts = products.filter((p) => p.category === category);
  
  // Затем применяем поиск
  return searchProducts(categoryProducts, query);
}

/**
 * Подготовка к voice input (future-ready интерфейс)
 * Эта функция принимает результат распознавания речи
 * и преобразует в поисковый запрос
 */
export function normalizeVoiceInput(voiceResult: string): SearchQuery {
  // Базовая нормализация: удаление лишних пробелов и знаков препинания
  return voiceResult
    .replace(/[^\w\sа-яёА-ЯЁ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Интерфейс для voice input (future)
 * Пока не реализовано, но архитектура готова
 */
export interface VoiceInputHandler {
  start: () => void;
  stop: () => void;
  onResult: (transcript: string) => void;
  onError: (error: string) => void;
  isSupported: boolean;
}

/**
 * Проверка поддержки Web Speech API (для будущего voice input)
 */
export function checkVoiceSupport(): boolean {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}
