import type { PriceConfig, PriceGuardResult, UnitType } from "./types";

/**
 * Получить итоговую цену для отображения
 * Приоритет: manualOverride → suggestedPrice
 */
export function getDisplayPrice(priceConfig: PriceConfig): number {
  return priceConfig.price.manualOverride ?? priceConfig.price.suggestedPrice;
}

/**
 * Получить наценку в процентах
 */
export function getMargin(priceConfig: PriceConfig): number {
  const cost = priceConfig.price.costPrice;
  const display = getDisplayPrice(priceConfig);
  if (cost <= 0) return 0;
  return Math.round(((display - cost) / cost) * 100);
}

/**
 * Проверить цену на аномалии (guardrails)
 * - Цена не может быть ниже себестоимости
 * - Наценка не может быть отрицательной
 * - Рекомендуется наценка минимум 30%
 */
export function validatePrice(priceConfig: PriceConfig): PriceGuardResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  const display = getDisplayPrice(priceConfig);
  const cost = priceConfig.price.costPrice;
  const margin = getMargin(priceConfig);

  // Ошибки
  if (display < cost) {
    errors.push(`Цена ${display}₽ ниже себестоимости ${cost}₽`);
  }

  if (cost <= 0) {
    errors.push("Себестоимость должна быть больше 0");
  }

  // Предупреждения
  if (margin < 30 && margin >= 0) {
    warnings.push(`Наценка ${margin}% ниже рекомендованных 30%`);
  }

  if (margin > 300) {
    warnings.push(`Наценка ${margin}% очень высокая — стоит пересмотреть`);
  }

  // Проверка упаковки
  const { packaging } = priceConfig;
  if (packaging.unitType === "weight") {
    if (!packaging.weightOptions || packaging.weightOptions.length === 0) {
      warnings.push("Весовой товар должен иметь weightOptions");
    }
    if (!packaging.defaultWeight) {
      warnings.push("Весовой товар должен иметь defaultWeight");
    }
  }

  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
}

/**
 * Получить метку единицы измерения
 */
export function getUnitLabel(unitType: UnitType): string {
  switch (unitType) {
    case "weight":
      return "г";
    case "pack":
      return "уп";
    case "piece":
      return "шт";
  }
}


