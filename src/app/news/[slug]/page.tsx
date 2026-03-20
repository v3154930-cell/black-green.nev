import { notFound } from "next/navigation";
import { news } from "@/lib/data";

export default function NewsDetailsPage({ params }: { params: { slug: string } }) {
  const item = news.find((n) => n.slug === params.slug);
  if (!item) return notFound();

  return (
    <div className="py-8 space-y-4">
      <div className="eyebrow">Новости</div>
      <h1 className="text-3xl font-semibold text-[var(--text-primary)]">{item.title}</h1>
      <div className="text-sm text-[var(--text-muted)]">{item.date}</div>
      <div className="card-surface p-5 space-y-3">
        <p className="text-[var(--text-secondary)]">{item.excerpt}</p>
        <p className="text-[var(--text-muted)]">Подробный текст появится позже. Сейчас — моковая карточка новости.</p>
      </div>
    </div>
  );
}

