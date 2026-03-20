import Link from "next/link";
import { NewsItem } from "@/lib/types";

type Props = {
  item: NewsItem;
};

export function NewsCard({ item }: Props) {
  return (
    <Link href={`/news/${item.slug}`} className="card-surface p-4 space-y-2">
      <div className="text-sm text-[var(--text-muted)]">{item.date}</div>
      <div className="text-lg font-semibold text-[var(--text-primary)]">{item.title}</div>
      <p className="text-sm text-[var(--text-secondary)]">{item.excerpt}</p>
    </Link>
  );
}

