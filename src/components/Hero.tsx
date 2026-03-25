import { getTimeOfDay, heroScenes } from "@/lib/time-of-day";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { FallbackImage } from "./FallbackImage";

type HeroProps = {
  highlightImage?: string;
};

const heroImages = {
  morning: "/images/hero/01-hero-morning.png",
  day: "/images/hero/02-hero-day.png",
  evening: "/images/hero/03-hero-evening.png",
  night: "/images/hero/04-hero-night.png",
};

const timeIcons = {
  morning: "/images/icons/time-of-day/01-morning.png",
  day: "/images/icons/time-of-day/02-day.png",
  evening: "/images/icons/time-of-day/03-evening.png",
  night: "/images/icons/time-of-day/04-night.png",
};

const catalogGif = "/images/hero/catalog-sage-tea.gif";
const newsGif = "/images/hero/tea-news-sage.gif";

const greetings = {
  morning: "Доброе утро",
  day: "Хорошего дня",
  evening: "Добрый вечер",
  night: "Спокойной ночи",
};

export function Hero({ highlightImage }: HeroProps) {
  const timeOfDay = getTimeOfDay();
  const hero = heroScenes[timeOfDay];
  const heroImage = heroImages[timeOfDay];
  const timeIcon = timeIcons[timeOfDay];
  const greeting = greetings[timeOfDay];

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-[#e1e7e3] bg-gradient-to-br shadow-soft p-6 sm:p-8 lg:p-10"
      style={{ backgroundImage: undefined }}
    >
      <div className={cn("absolute inset-0 -z-10 opacity-70", `bg-gradient-to-br ${hero.gradient}`)} aria-hidden />
      <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-[var(--text-primary)]">
            {hero.title}
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl">{hero.subtitle}</p>
          <div className="flex flex-wrap gap-6 pt-2">
            <div className="relative group">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-ink px-4 py-2 text-white shadow-soft hover:translate-y-[-1px] transition-transform"
              >
                Перейти в каталог
              </Link>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 h-52 rounded-lg overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border-2 border-[#0f2d22]">
                <Image src={catalogGif} alt="" fill className="object-cover" unoptimized />
              </div>
            </div>
            <div className="relative group">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-ink px-4 py-2 text-white shadow-soft hover:translate-y-[-1px] transition-transform"
              >
                Чайные новости
              </Link>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 h-52 rounded-lg overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 border-2 border-[#0f2d22]">
                <Image src={newsGif} alt="" fill className="object-cover" unoptimized />
              </div>
            </div>
          </div>
        </div>
        <div className="surface-subtle p-4 sm:p-5 lg:w-96 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-[var(--bg-card)] border border-[#dfe5e1] flex items-center justify-center shrink-0">
              <Image
                src={timeIcon}
                alt=""
                width={40}
                height={40}
                className="h-full w-full object-cover scale-[1.35] -translate-x-1.5"
              />
            </div>
            <div>
              <div className="text-base font-semibold text-[var(--text-primary)]">{greeting}</div>
            </div>
          </div>
          <div className="relative h-40 w-full bg-[var(--bg-subtle)] rounded-lg overflow-hidden">
            <FallbackImage src={heroImage} alt="Hero highlight" fill className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
