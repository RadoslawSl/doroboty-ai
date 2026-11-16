import { FileText } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import people from "./data/people.json" with { type: "json" };

// These scenario assets are immutable; revisions require new versioned files.
const candidateFiles = new Map([
  ["candidate-anna", "anna-kowalska-cv-v1.pdf"],
  ["candidate-marek", "marek-nowak-cv-v1.pdf"],
]);

export function CvAttachment({
  candidateId,
  fallbackText,
  layout = "stack",
  preview = false,
  contextLabel = "CV z momentu aplikowania",
}: {
  candidateId: string;
  fallbackText: string;
  layout?: "stack" | "row";
  preview?: boolean;
  contextLabel?: string;
}) {
  const filename = candidateFiles.get(candidateId);
  const source = people.find((person) => person.id === candidateId);
  // An imported custom CV must not be presented as a different prepared PDF.
  if (!filename || source?.cv !== fallbackText)
    return preview || layout === "row" ? (
      <div className="cv-attachment" data-private>
        <div className="cv-file-row">
          <FileText aria-hidden="true" size={24} />
          <div className="cv-file-description">
            <strong>Zapisana treść CV</strong>
            <span>{contextLabel}</span>
          </div>
        </div>
        <p className="cv-text whitespace-pre-wrap text-sm leading-relaxed">{fallbackText}</p>
      </div>
    ) : (
      <p className="whitespace-pre-wrap text-sm leading-relaxed" data-private>
        {fallbackText}
      </p>
    );
  const href = `${import.meta.env.BASE_URL}cv/${filename}`;
  return (
    <div className="cv-attachment" data-private>
      <div className={layout === "row" ? "cv-file-row" : "space-y-4"}>
        {layout === "row" ? (
          <>
            <FileText aria-hidden="true" size={24} />
            <div className="cv-file-description">
              <strong>{filename}</strong>
              <span>{contextLabel} · PDF</span>
            </div>
          </>
        ) : (
          <p className="break-all text-sm text-muted-foreground">{filename} · PDF</p>
        )}
        <div className="flex flex-wrap gap-3">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Otwórz CV (PDF)<span className="sr-only"> w nowej karcie</span>
          </a>
          <a
            href={href}
            download={filename}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Pobierz CV (PDF)
          </a>
        </div>
      </div>
      {preview && (
        <iframe
          className="cv-preview ph-no-capture"
          title="Podgląd CV (PDF)"
          src={`${href}#view=FitH`}
        />
      )}
    </div>
  );
}
