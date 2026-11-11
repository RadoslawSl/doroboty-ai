import { useState } from "react";
import { Link } from "react-router";
import { Pause, Play } from "lucide-react";
import { CompanyLogo } from "@/features/jobs/company-logo";
import type { Company } from "@/features/jobs/types";

type TrustedCompany = Pick<Company, "name" | "slug" | "logoUrl">;

/**
 * Demo showcase companies for the "Zaufali nam" carousel. Like all prototype data they are
 * fictional; the logos are the generated marks in public/company-logos.
 */
const showcaseCompanies: TrustedCompany[] = [
  ["Kobalt Labs", "demo-kobalt-labs"],
  ["Orbita Cloud", "demo-orbita-cloud"],
  ["Splot Data", "demo-splot-data"],
  ["Iskra Systems", "demo-iskra-systems"],
  ["Pryzmat Studio", "demo-pryzmat-studio"],
  ["Latarnia Digital", "demo-latarnia-digital"],
  ["Mewa Analytics", "demo-mewa-analytics"],
  ["Wektor AI", "demo-wektor-ai"],
  ["Tandem Software", "demo-tandem-software"],
  ["Zefir Design", "demo-zefir-design"],
].map(([name, slug]) => ({ name, slug, logoUrl: `/company-logos/${slug}-v1.png` }));

function TrustedCard({
  company,
  linked,
  hidden,
}: {
  company: TrustedCompany;
  linked: boolean;
  hidden: boolean;
}) {
  const content = (
    <>
      <CompanyLogo company={company} size="large" />
      <span className="trusted-name">{company.name}</span>
    </>
  );
  return linked ? (
    <Link
      className="prototype-panel trusted-card"
      to={`/firmy/${company.slug}`}
      tabIndex={hidden ? -1 : undefined}
    >
      {content}
    </Link>
  ) : (
    <div className="prototype-panel trusted-card">{content}</div>
  );
}

/** Companies with a published offer (linked to their page) followed by the demo showcase. */
export function TrustedCompanies({ companies }: { companies: TrustedCompany[] }) {
  const [paused, setPaused] = useState(false);
  const linkedSlugs = new Set(companies.map((company) => company.slug));
  const all = [
    ...companies,
    ...showcaseCompanies.filter((company) => !linkedSlugs.has(company.slug)),
  ];

  return (
    <div className="trusted-carousel" data-paused={paused || undefined}>
      <div className="trusted-viewport">
        <div className="trusted-track">
          {[false, true].map((hidden) => (
            <ul key={String(hidden)} className="trusted-list" aria-hidden={hidden || undefined}>
              {all.map((company) => (
                <li key={company.slug}>
                  <TrustedCard
                    company={company}
                    linked={linkedSlugs.has(company.slug)}
                    hidden={hidden}
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="trusted-toggle"
        aria-pressed={paused}
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
        {paused ? "Wznów przewijanie" : "Zatrzymaj przewijanie"}
      </button>
    </div>
  );
}
