export default function AboutPage() {
  return (
    <div className="py-8 space-y-4">
      <div className="eyebrow">О магазине</div>
      <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Black Green New</h1>
      <p className="text-[var(--text-secondary)] max-w-3xl">
        Современный нишевой магазин чая и чайной посуды. Мы бережно используем наследие Black-Green — жёлтую текстуру
        локально в подарочном контуре — и строим чистую управляемую витрину без ощущения маркетплейса.
      </p>
      <div className="surface-subtle p-4 rounded-xl space-y-2 max-w-3xl">
        <div className="text-base font-semibold text-[var(--text-primary)]">Визуальные принципы</div>
        <ul className="list-disc pl-5 text-sm text-[var(--text-secondary)] space-y-1">
          <li>Светлый спокойный интерфейс, без декоративного шума.</li>
          <li>Framed layout на десктопах, без подложки на мобильных.</li>
          <li>Единые карточки на белом фоне, аккуратные тени.</li>
        </ul>
      </div>
    </div>
  );
}

