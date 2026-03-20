"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, Mic } from "lucide-react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onVoiceClick?: () => void; // Future: voice input handler
  isVoiceSupported?: boolean;
};

/**
 * SearchInput - компонент поисковой строки
 * 
 * MVP-версия: текстовый ввод
 * Архитектура подготовлена для voice input:
 * - onVoiceClick callback для активации голоса
 * - isVoiceSupported для проверки поддержки Web Speech API
 */
export function SearchInput({
  value,
  onChange,
  placeholder = "Поиск по каталогу...",
  onVoiceClick,
  isVoiceSupported = false,
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = useCallback(() => {
    onChange("");
  }, [onChange]);

  // Обработка клавиши Escape для очистки
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && value) {
        handleClear();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [value, handleClear]);

  return (
    <div
      className={`
        relative flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200
        ${isFocused 
          ? "border-[var(--leaf)] bg-white shadow-sm" 
          : "border-[#e4e9e6] bg-white hover:border-[#d1dcd6]"
        }
      `}
    >
      {/* Search Icon */}
      <Search 
        className={`w-5 h-5 transition-colors ${isFocused ? "text-[var(--leaf)]" : "text-[var(--text-muted)]"}`} 
      />

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-base"
        aria-label="Поиск по каталогу"
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={handleClear}
          className="p-1 rounded-full hover:bg-[var(--bg-subtle)] transition-colors"
          aria-label="Очистить поиск"
          type="button"
        >
          <X className="w-4 h-4 text-[var(--text-muted)]" />
        </button>
      )}

      {/* Voice button - подготовлено для future voice input */}
      {isVoiceSupported && (
        <button
          onClick={onVoiceClick}
          className="p-2 rounded-full hover:bg-[var(--bg-subtle)] transition-colors text-[var(--text-muted)] hover:text-[var(--leaf)]"
          aria-label="Голосовой поиск"
          type="button"
        >
          <Mic className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
