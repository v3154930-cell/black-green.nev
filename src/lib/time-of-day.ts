import { TimeOfDay } from "@/lib/types";

export function getTimeOfDay(now: Date = new Date()): TimeOfDay {
  const hour = now.getHours();

  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "day";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export const heroScenes: Record<TimeOfDay, { title: string; subtitle: string; gradient: string; accent: string }>
  = {
    morning: {
      title: "Мягкое утро с чаями Black Green",
      subtitle: "Японские, жасминовые и лёгкие улунные сборы для спокойного старта дня.",
      gradient: "from-[#f7f1e3] via-[#e8f2ed] to-[#f5d77f]/40",
      accent: "bg-brand-leaf",
    },
    day: {
      title: "День — время яркого вкуса",
      subtitle: "Зелёные, красные и фруктовые напитки для чистой энергии без суеты.",
      gradient: "from-[#e8f2ed] via-[#f8f8f6] to-[#d9e8df]",
      accent: "bg-brand-ink",
    },
    evening: {
      title: "Вечер с глубокими настоями",
      subtitle: "Пуэры и улунные связки для размеренного ритуала и тепла.",
      gradient: "from-[#f0d27a]/55 via-[#e5e8e3] to-[#c8d9cd]",
      accent: "bg-brand-amber",
    },
    night: {
      title: "Ночь — тихая мастерская вкуса",
      subtitle: "Травяные и безкофеиновые купажи, чтобы замедлиться и отдохнуть.",
      gradient: "from-[#0f2d22] via-[#1f5f46] to-[#0c1b14]",
      accent: "bg-brand-gold",
    },
  };
