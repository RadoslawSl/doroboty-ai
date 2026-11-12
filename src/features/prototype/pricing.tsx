import { Link } from "react-router";
import { ArrowRight, Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Employer pricing (homepage, before the call to action). Prices follow the case data in
 * discovery/data/purchases.csv: single ad 1 620 zł net for 30 days, a pack of three ads
 * 3 630 zł net, and No Limit with a variable price (individual quote).
 */
const plans = [
  {
    id: "standard",
    name: "Standard",
    audience: "Jedna rola do obsadzenia",
    price: "1 620 zł",
    unit: "netto za ogłoszenie",
    features: [
      "1 ogłoszenie aktywne przez 30 dni",
      "Kategoria Build, Apply albo Lead",
      "Asystent AI do opisu oferty, który zatwierdzasz",
      "Karta „Co kandydat zrobił sam” w każdej aplikacji",
    ],
    cta: { label: "Wybierz Standard", to: "/auth/sign-in?audience=employer&next=/app/oferty/nowa" },
  },
  {
    id: "pro",
    name: "Pro",
    audience: "Kilka ról w jednym czasie",
    badge: "Najniższa cena za ogłoszenie",
    price: "3 630 zł",
    unit: "netto za 3 ogłoszenia",
    note: "1 210 zł za ogłoszenie — 1 230 zł mniej niż 3 × Standard",
    features: [
      "3 ogłoszenia do publikacji w ciągu 30 dni",
      "Wszystko, co w planie Standard",
      "Jedno miejsce na aplikacje ze wszystkich ofert",
    ],
    cta: { label: "Wybierz Pro", to: "/auth/sign-in?audience=employer&next=/app/oferty/nowa" },
    featured: true,
  },
  {
    id: "team",
    name: "Team",
    audience: "Stała rekrutacja w zespole",
    price: "Wycena indywidualna",
    unit: "za 30 dni dostępu",
    features: [
      "Bez limitu ogłoszeń przez 30 dni",
      "Wszystko, co w planie Pro",
      "Opiekun konta po stronie DoRoboty.ai",
    ],
    cta: { label: "Porozmawiajmy", to: "/kontakt?temat=team" },
  },
] as const;

export function PricingSection() {
  return (
    <section
      id="cennik"
      aria-labelledby="pricing-heading"
      className="shadow-[var(--gui-divider-top-shadow)]"
    >
      <div className="mx-auto max-w-[1360px] px-5 py-16 lg:px-8 lg:py-20">
        <p className="cta-eyebrow text-muted-foreground">Cennik dla firm</p>
        <h2
          id="pricing-heading"
          className="mt-3 text-3xl font-semibold tracking-[var(--gui-tracking-s)] sm:text-4xl"
        >
          Wybierz plan na swoją rekrutację
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Płacisz za publikację ofert. Kandydaci zakładają profil i aplikują bezpłatnie.{" "}
          <span className="whitespace-nowrap">Wszystkie ceny są podane netto.</span>
        </p>
        <ul className="pricing-grid mt-10">
          {plans.map((plan) => (
            <li key={plan.id}>
              <article
                className="prototype-panel pricing-card"
                data-featured={"featured" in plan || undefined}
                aria-labelledby={`plan-${plan.id}`}
              >
                {"badge" in plan && <p className="pricing-badge">{plan.badge}</p>}
                <h3 id={`plan-${plan.id}`} className="pricing-name">
                  {plan.name}
                </h3>
                <p className="pricing-audience">{plan.audience}</p>
                <p className="pricing-price" data-text={!/\d/.test(plan.price) || undefined}>
                  {plan.price}
                </p>
                <p className="pricing-unit">{plan.unit}</p>
                {"note" in plan && <p className="pricing-note">{plan.note}</p>}
                <ul className="pricing-features">
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  className={cn(
                    buttonVariants({
                      size: "lg",
                      variant: "featured" in plan ? "default" : "outline",
                    }),
                    "pricing-cta",
                  )}
                  to={plan.cta.to}
                >
                  {plan.cta.label} <ArrowRight />
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
