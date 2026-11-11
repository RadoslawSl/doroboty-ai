const criteria = [
  ["AI zmienia pracę", "Technologia wpływa na odpowiedzialność, decyzje lub rezultat stanowiska."],
  [
    "Wynik da się zobaczyć",
    "Opis roli wskazuje problem, odbiorcę i efekt, a nie samą listę narzędzi.",
  ],
  [
    "Człowiek zachowuje odpowiedzialność",
    "Automatyzacja wspiera decyzję; nie ukrywa jej autora ani konsekwencji.",
  ],
  [
    "Oferta daje konkret",
    "Pokazuje tryb pracy, poziom, formę współpracy i — kiedy to możliwe — wynagrodzenie.",
  ],
] as const;

export default function MethodologyPage() {
  return (
    <article className="mx-auto max-w-5xl px-5 py-14 lg:px-8 lg:py-20">
      <p className="text-base font-medium tracking-[var(--gui-tracking-xl)] text-muted-foreground">
        Nasze kryteria
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-[var(--gui-tracking-s)] sm:text-5xl">
        Nie każda praca z chatbotem jest pracą z AI.
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        DoRoboty.ai pokazuje role, w których AI jest częścią realnej odpowiedzialności i mierzalnego
        wyniku.
      </p>
      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {criteria.map(([title, body], index) => (
          <section key={title} className="rounded-xl bg-card p-6">
            <span className="text-sm font-medium text-muted-foreground">0{index + 1}</span>
            <h2 className="mt-3 text-xl font-semibold">{title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </section>
        ))}
      </div>
      <section className="mt-12 rounded-xl bg-muted/40 p-7">
        <h2 className="text-2xl font-semibold">Weryfikacja nie jest rekomendacją</h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Sprawdzamy źródło i kompletność informacji. Kandydat nadal powinien sam ocenić firmę,
          warunki i dopasowanie roli.
        </p>
      </section>
    </article>
  );
}
