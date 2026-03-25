import { TimeOfDay } from "@/lib/types";

export function getTimeOfDay(now: Date = new Date()): TimeOfDay {
  const hour = now.getHours();

  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "day";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export const heroScenes: Record<TimeOfDay, { title: string; subtitle: string; gradient: string; accent: string; cardTitle: string; cardDescription: string }>
  = {
    morning: {
      title: "Утренний чай для спокойного начала дня",
      subtitle: "Светлые сорта, мягкий вкус и чистый ритм без спешки.",
      gradient: "from-[#f7f1e3] via-[#e8f2ed] to-[#f5d77f]/40",
      accent: "bg-brand-leaf",
      cardTitle: "Утренний режим",
      cardDescription: "Утром витрина остается светлой и свежей: больше воздуха, легкости и мягких вкусов.",
    },
    day: {
      title: "Дневная пауза для ясной головы",
      subtitle: "Зеленый чай, улуны и спокойный вкус для середины дня.",
      gradient: "from-[#e8f2ed] via-[#f8f8f6] to-[#d9e8df]",
      accent: "bg-brand-ink",
      cardTitle: "Дневной режим",
      cardDescription: "Днем витрина собранная и чистая: без шума, с акцентом на ясность, вкус и короткую передышку.",
    },
    evening: {
      title: "Вечернее чаепитие без спешки",
      subtitle: "Более глубокие вкусы, мягкое тепло и время для длинного послевкусия.",
      gradient: "from-[#f0d27a]/55 via-[#e5e8e3] to-[#c8d9cd]",
      accent: "bg-brand-amber",
      cardTitle: "Вечерний режим",
      cardDescription: "Вечером витрина становится чуть теплее и мягче, сохраняя чистоту и спокойный ритм.",
    },
    night: {
      title: "Ночной чай для тишины и отдыха",
      subtitle: "Травяные и мягкие вечерние купажи, чтобы расслабиться и спокойно завершить день.",
      gradient: "from-[#0f2d22] via-[#1f5f46] to-[#0c1b14]",
      accent: "bg-brand-gold",
      cardTitle: "Ночной режим",
      cardDescription: "Ночью витрина становится тише и мягче: меньше шума, больше воздуха, отдыха и спокойного вкуса.",
    },
  };
