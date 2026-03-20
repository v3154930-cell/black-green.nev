import Link from "next/link";
import { ReviewItem } from "@/lib/types";

type Props = {
  review: ReviewItem;
};

export function ReviewCard({ review }: Props) {
  return (
    <div className="card-surface p-4 space-y-2">
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
  );
}

