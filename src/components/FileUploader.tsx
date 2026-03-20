"use client";

import { useState } from "react";

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
  };

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
