import Link from "next/link";
import { news } from "@/lib/data";

export default function NewsPage() {
  return (
    <div className="py-8 space-y-6">
      <div className="space-y-2">
        <div className="eyebrow">Новости</div>
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Новости и обновления</h1>
        <p className="text-[var(--text-secondary)]">Контентный слой: черновики, публикации, короткие дайджесты.</p>
      </div>

      {news.length === 0 ? (
        <div className="surface-subtle p-4 text-[var(--text-secondary)]">Новостей пока нет.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {news.map((item) => (
            <Link key={item.slug} href={`/news/${item.slug}`} className="card-surface p-4 space-y-2">
              <div className="text-sm text-[var(--text-muted)]">{item.date}</div>
              <div className="text-lg font-semibold text-[var(--text-primary)]">{item.title}</div>
              <p className="text-sm text-[var(--text-secondary)]">{item.excerpt}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

