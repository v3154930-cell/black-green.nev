import { getTimeOfDay, heroScenes } from "@/lib/time-of-day";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FallbackImage } from "./FallbackImage";

type HeroProps = {
  highlightImage?: string;
};

export function Hero({ highlightImage = "/images/hero-tea.jpg" }: HeroProps) {
  const timeOfDay = getTimeOfDay();
  const hero = heroScenes[timeOfDay];

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-[#e1e7e3] bg-gradient-to-br shadow-soft p-6 sm:p-8 lg:p-10"
      style={{ backgroundImage: undefined }}
    >
      <div className={cn("absolute inset-0 -z-10 opacity-70", `bg-gradient-to-br ${hero.gradient}`)} aria-hidden />
      <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4 max-w-2xl">
          <div className="eyebrow">
            {timeOfDay === "morning"
              ? "Утро"
              : timeOfDay === "day"
              ? "День"
              : timeOfDay === "evening"
              ? "Вечер"
              : "Ночь"}
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-[var(--text-primary)]">
            {hero.title}
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl">{hero.subtitle}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-ink px-4 py-2 text-white shadow-soft hover:translate-y-[-1px] transition-transform"
            >
              Перейти в каталог
            </Link>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 rounded-xl border border-[#dfe5e1] bg-white px-4 py-2 text-[var(--text-primary)] hover:border-brand-leaf"
            >
              Журнал
            </Link>
          </div>
        </div>
        <div className="surface-subtle p-4 sm:p-5 lg:w-96 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[var(--bg-card)] border border-[#dfe5e1] flex items-center justify-center text-brand-leaf font-semibold">
              {timeOfDay === "morning" ? "AM" : timeOfDay === "day" ? "PM" : timeOfDay === "evening" ? "EV" : "NT"}
            </div>
            <div>
              <div className="text-sm text-[var(--text-muted)]">Режим времени суток</div>
              <div className="text-base font-semibold text-[var(--text-primary)]">{timeOfDay}</div>
            </div>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Hero обновляется под время суток: утро, день, вечер, ночь. Витрина остаётся спокойной и чистой.
          </p>
          <div className="relative h-40 w-full bg-[var(--bg-subtle)] rounded-lg overflow-hidden">
            <FallbackImage src={highlightImage} alt="Hero highlight" fill className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

