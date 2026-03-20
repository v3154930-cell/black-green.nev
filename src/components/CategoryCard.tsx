import Image from "next/image";
import Link from "next/link";

type Props = {
  slug: string;
  title: string;
  description: string;
  image: string;
};

export function CategoryCard({ slug, title, description, image }: Props) {
  return (
    <Link href={`/catalog/${slug}`} className="card-surface overflow-hidden group">
      <div className="relative h-40 w-full bg-[var(--bg-subtle)]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4 space-y-2">
        <div className="text-lg font-semibold text-[var(--text-primary)]">{title}</div>
        <p className="text-sm text-[var(--text-muted)]">{description}</p>
      </div>
    </Link>
  );
}

