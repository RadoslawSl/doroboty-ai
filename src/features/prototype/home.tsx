import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { JobCard } from "@/features/jobs/job-card";
import { usePrototype } from "./store";
import { publishedJobs } from "./model";
import { cn } from "@/lib/utils";
import { CategoryRobot } from "./category-robots";
import { TrustedCompanies } from "./trusted-companies";

import peopleArt from "../../../docs/design-system/agent-kit/assets/people.png";

const categories = [
  {
    slug: "build",
    label: "Build",
    description: "Tworzysz modele, systemy i produkty wykorzystujące AI.",
  },
  {
    slug: "apply",
    label: "Apply",
    description: "Używasz AI, żeby lepiej wykonywać swoją właściwą pracę.",
  },
  {
    slug: "lead",
    label: "Lead",
    description: "Prowadzisz zmianę, decyzje i zespoły w świecie AI.",
  },
] as const;

export default function HomePage() {
  const { state } = usePrototype();
  const published = publishedJobs(state);
  const latestJobs = published.slice(0, 4);
  const trustedCompanies = [
    ...new Map(published.map((job) => [job.company.id, job.company])).values(),
  ].sort((a, b) => a.name.localeCompare(b.name, "pl"));

  return (
    <>
      <section className="home-intro bg-muted/25 shadow-[var(--gui-divider-bottom-shadow)]">
        <div className="mx-auto grid max-w-[1360px] gap-12 px-5 py-16 lg:grid-cols-[1.3fr_0.7fr] lg:px-8 lg:py-24">
          <div>
            <Badge variant="secondary" className="px-3 py-1 text-sm">
              Dobra robota. Z AI w środku.
            </Badge>
            <h1 className="mt-6 max-w-4xl text-5xl leading-[var(--gui-leading-xxl)] font-semibold tracking-[var(--gui-tracking-xs)] sm:text-6xl lg:text-7xl">
              Praca dla ludzi, którzy dowożą z AI.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Wyselekcjonowane role, w których AI jest częścią odpowiedzialności, decyzji i wyniku
              pracy — nie dopiskiem w employer brandingu.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/oferty" className={buttonVariants({ size: "lg" })}>
                Zobacz oferty <ArrowRight />
              </Link>
              <Link
                to="/metodologia"
                className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
              >
                Jak wybieramy role
              </Link>
            </div>
          </div>
          <img className="people-art" src={peopleArt} alt="Dwie osoby pracujące razem z laptopem" />
        </div>
      </section>

      <section className="mx-auto max-w-[1360px] px-5 py-16 lg:px-8 lg:py-20">
        <p className="text-base font-medium tracking-[var(--gui-tracking-xl)] text-muted-foreground">
          Trzy sposoby pracy z AI
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[var(--gui-tracking-s)] sm:text-4xl">
          Build. Apply. Lead.
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {categories.map((category) => (
            <article key={category.slug} className="prototype-panel category-card">
              <div className="category-card-head">
                <CategoryRobot slug={category.slug} />
                <h3 className="text-xl font-semibold">{category.label}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {category.description}
              </p>
              <Link
                className="mt-6 inline-flex items-center gap-2 text-lg font-semibold text-[var(--gui-link)] hover:underline"
                to={`/oferty?category=${category.slug}`}
              >
                Przeglądaj role <ArrowRight className="size-5" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-muted/25 shadow-[var(--gui-divider-top-shadow)]">
        <div className="mx-auto max-w-[1360px] px-5 py-16 lg:px-8 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-base font-medium tracking-[var(--gui-tracking-xl)] text-muted-foreground">
                Aktualne role
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[var(--gui-tracking-s)] sm:text-4xl">
                Najnowsze oferty
              </h2>
            </div>
            <Link
              className="inline-flex items-center gap-2 text-base font-medium text-[var(--gui-link)] hover:underline"
              to="/oferty"
            >
              Wszystkie oferty <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-8 pp-job-list">
            {latestJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="trusted-heading" className="shadow-[var(--gui-divider-top-shadow)]">
        <div className="mx-auto max-w-[1360px] px-5 py-16 lg:px-8 lg:py-20">
          <p className="text-base font-medium tracking-[var(--gui-tracking-xl)] text-muted-foreground">
            Pracodawcy na DoRoboty.ai
          </p>
          <h2
            id="trusted-heading"
            className="mt-3 text-3xl font-semibold tracking-[var(--gui-tracking-s)] sm:text-4xl"
          >
            Zaufali nam
          </h2>
          <TrustedCompanies companies={trustedCompanies} />
        </div>
      </section>
    </>
  );
}
