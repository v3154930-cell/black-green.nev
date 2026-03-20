import Link from "next/link";
import { reviews } from "@/lib/data";

export default function ReviewsPage() {
  return (
    <div className="py-8 space-y-6">
      <div className="space-y-2">
        <div className="eyebrow">Отзывы</div>
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Отзывы покупателей</h1>
        <p className="text-[var(--text-secondary)]">Живой контентный слой. На старте — моковые данные и пустые состояния.</p>
      </div>

      {reviews.length === 0 ? (
        <div className="surface-subtle p-4 text-[var(--text-secondary)]">Отзывов пока нет.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {reviews.map((review) => (
            <div key={review.id} className="card-surface p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-[var(--text-primary)]">{review.author}</div>
                <div className="text-sm text-[var(--text-secondary)]">★ {review.rating}</div>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">{review.text}</p>
              {review.productSlug ? (
                <Link href={`/product/${review.productSlug}`} className="text-sm link-underline text-[var(--text-primary)]">
                  К товару
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

