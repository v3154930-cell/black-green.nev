"use client";

import { useState } from "react";
import type { ColumnMapping } from "@/lib/types";

// Метки полей для маппинга
const mappingFieldLabels: Record<keyof ColumnMapping, string> = {
  supplierSku: "Артикул поставщика (SKU)",
  rawTitle: "Название товара",
  costPrice: "Себестоимость",
  stock: "Остаток",
  imageSource: "Изображение",
  categoryHint: "Категория",
  typeHint: "Тип товара",
};

interface CsvParseResult {
  columns: string[];
  rows: string[][];
  totalRows: number;
  error?: string;
}

function parseCsv(text: string): CsvParseResult {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
  
  if (lines.length === 0) {
    return { columns: [], rows: [], totalRows: 0, error: "Файл пустой" };
  }

  // Simple CSV parsing (basic, handles commas in quotes minimally)
  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const columns = parseLine(lines[0]);
  const rows = lines.slice(1, 6).map(parseLine); // First 5 data rows for preview
  
  return {
    columns,
    rows,
    totalRows: lines.length - 1, // minus header
  };
}

export function FileUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<CsvParseResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    supplierSku: null,
    rawTitle: null,
    costPrice: null,
    stock: null,
    imageSource: null,
    categoryHint: null,
    typeHint: null,
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setParseResult(null);

    try {
      const text = await file.text();
      const result = parseCsv(text);
      
      if (result.error) {
        setParseResult(result);
      } else if (result.columns.length === 0) {
        setParseResult({ ...result, error: "Не удалось определить колонки в файле" });
      } else {
        setParseResult(result);
      }
    } catch {
      setParseResult({ columns: [], rows: [], totalRows: 0, error: "Не удалось прочитать файл" });
    } finally {
      setSelectedFile(file);
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleReset = () => {
    setSelectedFile(null);
    setParseResult(null);
    setColumnMapping({
      supplierSku: null,
      rawTitle: null,
      costPrice: null,
      stock: null,
      imageSource: null,
      categoryHint: null,
      typeHint: null,
    });
  };

  // Обработчик изменения маппинга
  const handleMappingChange = (field: keyof ColumnMapping, csvColumn: string | null) => {
    setColumnMapping(prev => ({
      ...prev,
      [field]: csvColumn,
    }));
  };

  // Подсчёт количества сопоставленных полей
  const mappedCount = Object.values(columnMapping).filter(v => v !== null).length;
  const totalFields = Object.keys(columnMapping).length;

  // Show file info + preview
  if (selectedFile && parseResult) {
    return (
      <div className="space-y-4">
        {/* File info */}
        <div className="surface-subtle p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <div className="font-medium text-[var(--text-primary)]">{selectedFile.name}</div>
                <div className="text-sm text-[var(--text-muted)]">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type || 'text/csv'}
                </div>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-sm border border-[#dfe5e1] rounded-lg hover:bg-[var(--bg-subtle)]"
            >
              Загрузить другой
            </button>
          </div>
        </div>

        {/* Error state */}
        {parseResult.error ? (
          <div className="surface-subtle p-4 rounded-lg border-2 border-red-200 bg-red-50">
            <div className="text-red-700 font-medium">Ошибка</div>
            <div className="text-sm text-red-600">{parseResult.error}</div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="surface-subtle p-3 rounded-lg">
                <div className="text-xs text-[var(--text-muted)]">Всего строк</div>
                <div className="text-xl font-semibold text-[var(--text-primary)]">{parseResult.totalRows}</div>
              </div>
              <div className="surface-subtle p-3 rounded-lg">
                <div className="text-xs text-[var(--text-muted)]">Колонок</div>
                <div className="text-xl font-semibold text-[var(--text-primary)]">{parseResult.columns.length}</div>
              </div>
            </div>

            {/* Columns list */}
            <div className="surface-subtle p-4 rounded-lg">
              <h4 className="text-sm font-medium text-[var(--text-primary)] mb-2">
                Найденные колонки
              </h4>
              <div className="flex flex-wrap gap-2">
                {parseResult.columns.map((col, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs bg-[var(--bg-subtle)] text-[var(--text-secondary)] rounded"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>

            {/* Preview table */}
            {parseResult.rows.length > 0 && (
              <div className="surface-subtle p-4 rounded-lg">
                <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">
                  Предпросмотр (первые {parseResult.rows.length} строк)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#e4e9e6]">
                        <th className="px-2 py-1.5 text-left text-[var(--text-muted)] font-medium">#</th>
                        {parseResult.columns.map((col, idx) => (
                          <th key={idx} className="px-2 py-1.5 text-left text-[var(--text-muted)] font-medium">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {parseResult.rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="border-b border-[#e4e9e6]">
                          <td className="px-2 py-1.5 text-[var(--text-muted)]">{rowIdx + 1}</td>
                          {row.map((cell, cellIdx) => (
                            <td key={cellIdx} className="px-2 py-1.5 text-[var(--text-secondary)] max-w-[200px] truncate">
                              {cell || '—'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Column Mapping Block */}
            {parseResult.columns.length > 0 && (
              <div className="space-y-4">
                <div className="surface-subtle p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-[var(--text-primary)]">
                      Сопоставление колонок
                    </h4>
                    <span className="text-xs text-[var(--text-muted)]">
                      {mappedCount} / {totalFields} полей
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(Object.keys(mappingFieldLabels) as Array<keyof ColumnMapping>).map((field) => (
                      <div key={field} className="flex items-center gap-2">
                        <label className="text-xs text-[var(--text-secondary)] w-28 shrink-0">
                          {mappingFieldLabels[field]}
                        </label>
                        <select
                          value={columnMapping[field] || ""}
                          onChange={(e) => handleMappingChange(field, e.target.value || null)}
                          className="flex-1 px-2 py-1.5 text-xs border border-[#dfe5e1] rounded-lg bg-white text-[var(--text-primary)]"
                        >
                          <option value="">— Не выбрано —</option>
                          {parseResult.columns.map((col) => (
                            <option key={col} value={col}>
                              {col}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mapped Data Preview */}
                {mappedCount > 0 && parseResult.rows.length > 0 && (
                  <div className="surface-subtle p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-[var(--text-primary)] mb-3">
                      Предпросмотр данных после маппинга
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-[#e4e9e6]">
                            <th className="px-2 py-1.5 text-left text-[var(--text-muted)] font-medium">#</th>
                            {(Object.keys(mappingFieldLabels) as Array<keyof ColumnMapping>).map((field) => (
                              <th 
                                key={field} 
                                className={`px-2 py-1.5 text-left font-medium ${
                                  columnMapping[field] 
                                    ? "text-brand-leaf bg-brand-leaf/5" 
                                    : "text-[var(--text-muted)]"
                                }`}
                              >
                                {mappingFieldLabels[field]}
                                {columnMapping[field] && (
                                  <span className="ml-1 text-[10px] opacity-70">
                                    ← {columnMapping[field]}
                                  </span>
                                )}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {parseResult.rows.map((row, rowIdx) => (
                            <tr key={rowIdx} className="border-b border-[#e4e9e6]">
                              <td className="px-2 py-1.5 text-[var(--text-muted)]">{rowIdx + 1}</td>
                              {(Object.keys(mappingFieldLabels) as Array<keyof ColumnMapping>).map((field) => {
                                const mappedCol = columnMapping[field];
                                const value = mappedCol ? row[parseResult.columns.indexOf(mappedCol)] : null;
                                const isEmpty = !value || value.trim() === "";
                                return (
                                  <td 
                                    key={field} 
                                    className={`px-2 py-1.5 max-w-[150px] truncate ${
                                      columnMapping[field]
                                        ? isEmpty
                                          ? "text-red-500 bg-red-50/50"
                                          : "text-[var(--text-primary)]"
                                        : "text-[var(--text-muted)] italic"
                                    }`}
                                  >
                                    {columnMapping[field] 
                                      ? (isEmpty ? "— пусто —" : value)
                                      : "—"
                                    }
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-2 text-xs text-[var(--text-muted)]">
                      Красным выделены поля с пустыми значениями после маппинга
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // Upload state
  return (
    <div className="space-y-4">
      <div className="surface-subtle p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          Загрузка файла поставщика
        </h3>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          Загрузите файл с каталогом товаров для импорта
        </p>

        <label className="block">
          <div className="border-2 border-dashed border-[#dfe5e1] rounded-lg p-8 text-center cursor-pointer hover:border-brand-leaf transition-colors">
            {isLoading ? (
              <>
                <div className="text-4xl mb-2">⏳</div>
                <div className="text-[var(--text-primary)] font-medium mb-1">
                  Загрузка...
                </div>
              </>
            ) : (
              <>
                <div className="text-4xl mb-2">📁</div>
                <div className="text-[var(--text-primary)] font-medium mb-1">
                  Выберите файл
                </div>
                <div className="text-sm text-[var(--text-muted)]">
                  Перетащите файл или нажмите для выбора
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-3">
                  Поддерживается: CSV
                </div>
              </>
            )}
          </div>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={isLoading}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
