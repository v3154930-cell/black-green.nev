"use client";

import { useState } from "react";
import Link from "next/link";
import { adminContentDrafts, news } from "@/lib/data";

// Статусы контента
type ContentStatus = "draft" | "needs-review" | "needs-fix" | "published";

const statusLabels: Record<ContentStatus, string> = {
  draft: "Черновик",
  "needs-review": "На проверке",
  "needs-fix": "Нужны правки",
  published: "Опубликовано",
};

const statusColors: Record<ContentStatus, string> = {
  draft: "bg-gray-100 text-gray-700",
  "needs-review": "bg-amber-100 text-amber-700",
  "needs-fix": "bg-red-100 text-red-700",
  published: "bg-green-100 text-green-700",
};

const kindLabels: Record<string, string> = {
  news: "Новость",
  "review-reply": "Ответ на отзыв",
};

// Объединяем черновики и опубликованные новости
const allContent = [
  ...adminContentDrafts.map(d => ({ ...d, date: "2026-03-20" })),
  ...news.map(n => ({ id: n.slug, kind: "news" as const, title: n.title, summary: n.excerpt, status: "published" as ContentStatus, date: n.date })),
];

const contentStats = {
  draft: allContent.filter((d) => d.status === "draft").length,
  needsReview: allContent.filter((d) => d.status === "needs-review").length,
  needsFix: allContent.filter((d) => d.status === "needs-fix").length,
  published: allContent.filter((d) => d.status === "published").length,
};

export default function AdminContentPage() {
  // Фильтр по статусу
  const [filter, setFilter] = useState<ContentStatus | "all">("all");

  const filteredContent = filter === "all" 
    ? allContent 
    : allContent.filter((item) => item.status === filter);

  // Демо: действие
  const handleAction = (action: string, id: string) => {
    console.log(`[${action}] for content ${id}`);
    alert(`${action}: ${id}`);
  };

  return (
    <div className="py-8 space-y-6">
      <div className="space-y-2">
        <div className="eyebrow">Админка</div>
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Контент Журнала</h1>
        <p className="text-[var(--text-secondary)]">
          Управление материалами Журнала: новости, ответы на отзывы.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-4">
        <div 
          onClick={() => setFilter("draft")}
          className={`card-surface p-4 rounded-xl border cursor-pointer hover:border-brand-leaf transition-colors ${
            filter === "draft" ? "border-brand-leaf" : "border-[#e4e9e6]"
          }`}
        >
          <div className="text-sm text-[var(--text-muted)]">Черновики</div>
          <div className="text-2xl font-semibold text-[var(--text-primary)]">{contentStats.draft}</div>
        </div>
        <div 
          onClick={() => setFilter("needs-review")}
          className={`card-surface p-4 rounded-xl border cursor-pointer hover:border-brand-leaf transition-colors ${
            filter === "needs-review" ? "border-brand-leaf" : "border-[#e4e9e6]"
          }`}
        >
          <div className="text-sm text-[var(--text-muted)]">На проверке</div>
          <div className="text-2xl font-semibold text-[var(--text-primary)]">{contentStats.needsReview}</div>
        </div>
        <div 
          onClick={() => setFilter("needs-fix")}
          className={`card-surface p-4 rounded-xl border cursor-pointer hover:border-brand-leaf transition-colors ${
            filter === "needs-fix" ? "border-brand-leaf" : "border-[#e4e9e6]"
          }`}
        >
          <div className="text-sm text-[var(--text-muted)]">Нужны правки</div>
          <div className="text-2xl font-semibold text-[var(--text-primary)]">{contentStats.needsFix}</div>
        </div>
        <div 
          onClick={() => setFilter("published")}
          className={`card-surface p-4 rounded-xl border cursor-pointer hover:border-brand-leaf transition-colors ${
            filter === "published" ? "border-brand-leaf" : "border-[#e4e9e6]"
          }`}
        >
          <div className="text-sm text-[var(--text-muted)]">Опубликовано</div>
          <div className="text-2xl font-semibold text-[var(--text-primary)]">{contentStats.published}</div>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-sm ${
            filter === "all" 
              ? "bg-brand-ink text-white" 
              : "bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
          }`}
        >
          Все
        </button>
        {(Object.keys(statusLabels) as ContentStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-sm ${
              filter === status 
                ? "bg-brand-ink text-white" 
                : "bg-[var(--bg-subtle)] text-[var(--text-secondary)]"
            }`}
          >
            {statusLabels[status]}
          </button>
        ))}
      </div>

      {/* Content List */}
      <div className="card-surface p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-base font-semibold text-[var(--text-primary)]">Материалы</div>
            <p className="text-sm text-[var(--text-secondary)]">Список всех материалов Журнала</p>
          </div>
        </div>

        {filteredContent.length === 0 ? (
          <div className="text-[var(--text-muted)]">Нет материалов в этом статусе.</div>
        ) : (
          <div className="divide-y divide-[#e4e9e6]">
            {filteredContent.map((item) => (
              <div key={item.id} className="py-3 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded ${statusColors[item.status]}`}>
                      {statusLabels[item.status]}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {kindLabels[item.kind] || item.kind}
                    </span>
                  </div>
                  <div className="text-base font-semibold text-[var(--text-primary)] truncate">
                    {item.title}
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                    {item.summary}
                  </p>
                  <div className="text-xs text-[var(--text-muted)] mt-1">
                    {new Date(item.date).toLocaleDateString('ru-RU', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
                
                {/* Quick actions */}
                <div className="flex flex-col gap-1">
                  {item.status === "published" ? (
                    <Link 
                      href={`/news/${item.id}`}
                      className="px-3 py-1 text-xs bg-[var(--bg-subtle)] text-[var(--text-secondary)] rounded-lg hover:bg-[#e4e9e6]"
                    >
                      Просмотр
                    </Link>
                  ) : (
                    <>
                      {item.status === "needs-review" && (
                        <button
                          onClick={() => handleAction("approve", item.id)}
                          className="px-3 py-1 text-xs bg-brand-leaf text-white rounded-lg"
                        >
                          Опубликовать
                        </button>
                      )}
                      {item.status === "draft" && (
                        <button
                          onClick={() => handleAction("send_to_review", item.id)}
                          className="px-3 py-1 text-xs bg-brand-ink text-white rounded-lg"
                        >
                          На проверку
                        </button>
                      )}
                      {item.status === "needs-fix" && (
                        <button
                          onClick={() => handleAction("edit", item.id)}
                          className="px-3 py-1 text-xs bg-amber-500 text-white rounded-lg"
                        >
                          Редактировать
                        </button>
                      )}
                      <button
                        onClick={() => handleAction("edit", item.id)}
                        className="px-3 py-1 text-xs border border-[#dfe5e1] text-[var(--text-secondary)] rounded-lg hover:bg-[#f5f7f6]"
                      >
                        Изменить
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4">
        <Link href="/admin" className="link-underline text-sm">
          ← Назад в админку
        </Link>
      </div>
    </div>
  );
}


