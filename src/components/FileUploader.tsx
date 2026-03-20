"use client";

import { useState } from "react";

export function FileUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (selectedFile) {
    return (
      <div className="space-y-4">
        <div className="surface-subtle p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
            Выбранный файл
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <div className="font-medium text-[var(--text-primary)]">{selectedFile.name}</div>
                <div className="text-sm text-[var(--text-muted)]">
                  {formatFileSize(selectedFile.size)} • {selectedFile.type || 'unknown type'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          </div>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
