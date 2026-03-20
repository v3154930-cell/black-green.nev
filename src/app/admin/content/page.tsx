import Link from "next/link";
import { adminContentDrafts } from "@/lib/data";

export default function AdminContentPage() {
  const stats = [
    { label: "Черновики", value: adminContentDrafts.filter((d) => d.status === "draft").length },
    { label: "Нужна проверка", value: adminContentDrafts.filter((d) => d.status === "needs-review").length },
    { label: "Нужны правки", value: adminContentDrafts.filter((d) => d.status === "needs-fix").length },
  ];

  return (
    <div className="py-8 space-y-6">
      <div className="space-y-2">
        <div className="eyebrow">Админка</div>
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Контент</h1>
        <p className="text-[var(--text-secondary)]">
          Черновики новостей и ответов на отзывы. Без реальной логики — только макет.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="card-surface p-4 space-y-1">
            <div className="text-sm text-[var(--text-muted)]">{s.label}</div>
            <div className="text-2xl font-semibold text-[var(--text-primary)]">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="card-surface p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-base font-semibold text-[var(--text-primary)]">Черновики контента</div>
            <p className="text-sm text-[var(--text-secondary)]">Короткий список черновиков и статусов.</p>
          </div>
          <Link href="/admin" className="link-underline text-sm">
            Назад в админку
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {adminContentDrafts.map((d) => (
            <div key={d.id} className="surface-subtle p-3 rounded-lg border border-[#e4e9e6] space-y-2">
              <div className="text-xs text-[var(--text-muted)]">{d.kind === "news" ? "Новость" : "Ответ"}</div>
              <div className="text-base font-semibold text-[var(--text-primary)]">{d.title}</div>
              <p className="text-sm text-[var(--text-secondary)]">{d.summary}</p>
              <div className="text-xs text-[var(--text-muted)]">Статус: {d.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
