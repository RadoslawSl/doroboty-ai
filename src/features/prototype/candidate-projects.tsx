import { useState, type FormEvent } from "react";
import { FolderKanban, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormSelect } from "@/components/ui/form-select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePrototype } from "./store";
import { involvementLabels, MAX_PROJECTS, type Project } from "./model";
import { Field } from "./workspace";

/** Read-only project list (profile preview). */
export function ProjectList({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;
  return (
    <ul className="project-list">
      {projects.map((project) => (
        <li key={project.id} className="project-item">
          <ProjectBody project={project} />
        </li>
      ))}
    </ul>
  );
}

function ProjectBody({ project }: { project: Project }) {
  return (
    <>
      <h3>{project.name}</h3>
      <p className="project-meta">
        <span className="project-involvement" data-involvement={project.involvement}>
          {involvementLabels[project.involvement]}
        </span>
        {project.period && <span>{project.period}</span>}
      </p>
      <dl className="project-facts">
        <div>
          <dt>Zakres obowiązków</dt>
          <dd>{project.responsibilities}</dd>
        </div>
        <div>
          <dt>Rezultat</dt>
          <dd>{project.result}</dd>
        </div>
      </dl>
    </>
  );
}

function ProjectForm({
  project,
  onSave,
  onCancel,
}: {
  project?: Project;
  onSave: (project: Project) => boolean;
  onCancel: () => void;
}) {
  const [involvement, setInvolvement] = useState<Project["involvement"]>(
    project?.involvement ?? "own",
  );
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const period = String(data.get("period") ?? "").trim();
    onSave({
      id: project?.id ?? crypto.randomUUID(),
      name: String(data.get("name") ?? ""),
      involvement,
      period: period || undefined,
      responsibilities: String(data.get("responsibilities") ?? ""),
      result: String(data.get("result") ?? ""),
    });
  }
  return (
    <form className="project-form prototype-form" onSubmit={submit}>
      <h3>{project ? "Edytuj projekt" : "Nowy projekt"}</h3>
      <div className="project-form-row">
        <Field label="Nazwa projektu">
          <Input name="name" required maxLength={200} defaultValue={project?.name} />
        </Field>
        <Field label="Okres (opcjonalnie)">
          <Input
            name="period"
            maxLength={100}
            placeholder="np. 03–09.2025"
            defaultValue={project?.period}
          />
        </Field>
      </div>
      <Field label="Twój udział">
        <FormSelect
          name="involvement"
          ariaLabel="Twój udział"
          value={involvement}
          onValueChange={(value) => (value === "own" || value === "co") && setInvolvement(value)}
          options={Object.entries(involvementLabels).map(([value, label]) => ({ value, label }))}
        />
      </Field>
      <Field label="Zakres obowiązków — co zrobiłeś(-aś) sam(a)?">
        <Textarea
          name="responsibilities"
          required
          maxLength={4000}
          defaultValue={project?.responsibilities}
          placeholder="Np. zaprojektowałam integrację modelu z systemem zgłoszeń i odpowiadałam za testy."
        />
      </Field>
      <Field label="Rezultat — co się zmieniło dzięki tej pracy?">
        <Textarea
          name="result"
          required
          maxLength={4000}
          defaultValue={project?.result}
          placeholder="Liczba, link albo opis, np. czas obsługi zgłoszenia spadł z 2 dni do 4 godzin."
        />
      </Field>
      <div className="flex flex-wrap gap-3">
        <Button type="submit">{project ? "Zapisz zmiany" : "Dodaj projekt"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Anuluj
        </Button>
      </div>
    </form>
  );
}

/** Editable project section on the candidate profile page. */
export function ProjectsEditor({ projects }: { projects: Project[] }) {
  const { run } = usePrototype();
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [message, setMessage] = useState("");

  function save(next: Project[], done: string) {
    if (!run({ type: "projects", value: next })) return false;
    setEditing(null);
    setMessage(done);
    return true;
  }

  return (
    <section className="prototype-panel mt-6" aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="mb-2 flex items-center gap-2">
        <FolderKanban className="size-5" aria-hidden="true" />
        Projekty
      </h2>
      <p className="mb-5 text-muted-foreground">
        Opisz projekty, które zrealizowałeś(-aś) samodzielnie lub współrealizowałeś(-aś) w zespole:
        za co odpowiadałeś(-aś) i jaki był rezultat. Pracodawca zobaczy, co zrobiłeś(-aś) sam(a).
      </p>
      {projects.length > 0 && (
        <ul className="project-list">
          {projects.map((project) => (
            <li key={project.id} className="project-item">
              {editing === project.id ? (
                <ProjectForm
                  project={project}
                  onCancel={() => setEditing(null)}
                  onSave={(updated) =>
                    save(
                      projects.map((item) => (item.id === updated.id ? updated : item)),
                      "Projekt został zapisany.",
                    )
                  }
                />
              ) : (
                <>
                  <ProjectBody project={project} />
                  <div className="project-actions">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setMessage("");
                        setEditing(project.id);
                      }}
                    >
                      <Pencil aria-hidden="true" /> Edytuj
                      <span className="sr-only">: {project.name}</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        save(
                          projects.filter((item) => item.id !== project.id),
                          `Usunięto projekt „${project.name}”.`,
                        )
                      }
                    >
                      <Trash2 aria-hidden="true" /> Usuń
                      <span className="sr-only">: {project.name}</span>
                    </Button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      {editing === "new" ? (
        <ProjectForm
          onCancel={() => setEditing(null)}
          onSave={(created) => save([...projects, created], "Projekt został dodany.")}
        />
      ) : (
        <Button
          type="button"
          variant={projects.length ? "outline" : "default"}
          disabled={projects.length >= MAX_PROJECTS || editing !== null}
          onClick={() => {
            setMessage("");
            setEditing("new");
          }}
        >
          <Plus aria-hidden="true" /> Dodaj projekt
        </Button>
      )}
      {projects.length >= MAX_PROJECTS && (
        <p className="record-caption mt-3">Możesz dodać do {MAX_PROJECTS} projektów.</p>
      )}
      {message && (
        <p role="status" className="mt-3">
          {message}
        </p>
      )}
    </section>
  );
}
