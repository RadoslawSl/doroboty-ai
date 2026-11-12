import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormSelect } from "@/components/ui/form-select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Field } from "./workspace";

export const contactTopics = {
  oferta: "Chcę opublikować ofertę",
  rekrutacja: "Potrzebuję pomocy w rekrutacji roli AI",
  team: "Interesuje mnie plan Team",
  kandydat: "Mam pytanie jako kandydat",
  inne: "Inna sprawa",
} as const;
type ContactTopic = keyof typeof contactTopics;

function isTopic(value: string | null): value is ContactTopic {
  return value !== null && Object.hasOwn(contactTopics, value);
}

/** Homepage call to action for employers, placed after "Zaufali nam". */
export function EmployerCta() {
  return (
    <section aria-labelledby="cta-heading" className="px-5 pb-16 lg:px-8 lg:pb-20">
      <div className="cta-panel mx-auto max-w-[1360px]">
        <div>
          <p className="cta-eyebrow">Dla firm</p>
          <h2 id="cta-heading">Szukasz osoby, która dowiezie wynik z AI?</h2>
          <p className="cta-lead">
            Opublikuj ofertę, w której AI jest częścią odpowiedzialności, nie hasłem w opisie.
            Pokażemy ją ludziom, którzy już coś z AI zbudowali, wdrożyli albo poprowadzili.
          </p>
        </div>
        <div className="cta-actions">
          <Link
            className={buttonVariants({ size: "lg" })}
            to="/auth/sign-in?audience=employer&next=/app/oferty/nowa"
          >
            Opublikuj ofertę <ArrowRight />
          </Link>
          <Link
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), "cta-secondary")}
            to="/kontakt?temat=rekrutacja"
          >
            Porozmawiajmy
          </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * Prototype contact form. Validates in the browser and shows a confirmation; nothing is sent
 * or stored (see the privacy page), so the success message says so plainly.
 */
export function ContactPage() {
  const [params] = useSearchParams();
  const initialTopic = params.get("temat");
  const [topic, setTopic] = useState<ContactTopic>(isTopic(initialTopic) ? initialTopic : "oferta");
  const [consent, setConsent] = useState(false);
  const [consentInvalid, setConsentInvalid] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) {
      setConsentInvalid(true);
      return;
    }
    const data = new FormData(event.currentTarget);
    setSentTo(String(data.get("email") ?? ""));
  }

  return (
    <section className="prototype-section contact-page">
      <div className="contact-intro">
        <p className="cta-eyebrow">Kontakt</p>
        <h1>Napisz do nas</h1>
        <p className="mt-5 text-muted-foreground">
          Chcesz opublikować ofertę, potrzebujesz pomocy przy rekrutacji roli AI albo masz pytanie o
          portal? Odpowiadamy w ciągu dwóch dni roboczych.
        </p>
        <ul className="contact-points">
          <li>Pomagamy opisać rolę tak, żeby było jasne, za co odpowiada AI, a za co człowiek.</li>
          <li>Podpowiadamy, o co zapytać kandydata, żeby sprawdzić jego własny wkład.</li>
          <li>Nie wysyłamy newslettera bez Twojej zgody.</li>
        </ul>
      </div>

      {sentTo !== null ? (
        <div className="prototype-panel contact-form contact-success" role="status">
          <CheckCircle2 aria-hidden="true" className="size-8" />
          <h2>Dziękujemy, wiadomość gotowa</h2>
          <p>
            W prawdziwym portalu odpowiedź przyszłaby na adres <strong>{sentTo}</strong>. To
            prototyp: formularz niczego nie wysyła ani nie zapisuje.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSentTo(null);
                setConsent(false);
              }}
            >
              Napisz kolejną wiadomość
            </Button>
            <Link className={buttonVariants({ variant: "ghost" })} to="/oferty">
              Zobacz oferty
            </Link>
          </div>
        </div>
      ) : (
        <form className="prototype-panel prototype-form contact-form" onSubmit={submit}>
          <div className="contact-row">
            <Field label="Imię i nazwisko">
              <Input name="name" required maxLength={120} autoComplete="name" />
            </Field>
            <Field label="E-mail">
              <Input name="email" type="email" required maxLength={200} autoComplete="email" />
            </Field>
          </div>
          <div className="contact-row">
            <Field label="Firma (opcjonalnie)">
              <Input name="company" maxLength={200} autoComplete="organization" />
            </Field>
            <Field label="Temat">
              <FormSelect
                name="topic"
                ariaLabel="Temat"
                value={topic}
                onValueChange={(value) => isTopic(value) && setTopic(value)}
                options={Object.entries(contactTopics).map(([value, label]) => ({ value, label }))}
              />
            </Field>
          </div>
          <Field label="Wiadomość">
            <Textarea
              name="message"
              required
              minLength={20}
              maxLength={4000}
              placeholder="Opisz krótko, czego szukasz lub z czym możemy pomóc."
            />
          </Field>
          <label className="contact-consent">
            <Checkbox
              checked={consent}
              onCheckedChange={(value) => {
                setConsent(value);
                if (value) setConsentInvalid(false);
              }}
              aria-invalid={consentInvalid || undefined}
              aria-describedby={consentInvalid ? "contact-consent-error" : undefined}
              aria-label="Zgoda na kontakt w sprawie wiadomości"
            />
            <span>
              Zgadzam się na kontakt w sprawie tej wiadomości. Szczegóły w{" "}
              <Link className="text-[var(--gui-link)] underline" to="/polityka-prywatnosci">
                polityce prywatności
              </Link>
              .
            </span>
          </label>
          {consentInvalid && (
            <p id="contact-consent-error" role="alert" className="contact-error">
              Zaznacz zgodę, żebyśmy mogli odpowiedzieć.
            </p>
          )}
          <div>
            <Button type="submit" size="lg">
              Wyślij wiadomość <ArrowRight />
            </Button>
          </div>
          <p className="record-caption">
            Prototyp: nie wpisuj prawdziwych danych. Formularz niczego nie wysyła.
          </p>
        </form>
      )}
    </section>
  );
}
