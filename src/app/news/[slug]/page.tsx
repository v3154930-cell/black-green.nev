import { notFound } from "next/navigation";
import Link from "next/link";
import { news } from "@/lib/data";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default async function NewsDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = news.find((n) => n.slug === slug);
  if (!item) return notFound();

  return (
    <div className="py-8 space-y-6">
      <Breadcrumbs items={[
        { label: "Журнал", href: "/news" },
        { label: item.title },
      ]} />
      
      <Link 
        href="/news" 
        className="inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-brand-leaf transition-colors"
      >
        ← Все публикации
      </Link>
      
      <div className="space-y-4">
        <div className="eyebrow">Журнал</div>
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">{item.title}</h1>
        <div className="text-sm text-[var(--text-muted)]">{item.date}</div>
        <div className="card-surface p-5 space-y-3">
          <p className="text-[var(--text-secondary)]">{item.excerpt}</p>
          <p className="text-[var(--text-muted)]">Подробный текст появится позже. Сейчас — моковая карточка новости.</p>
        </div>
      </div>
    </div>
  );
}

