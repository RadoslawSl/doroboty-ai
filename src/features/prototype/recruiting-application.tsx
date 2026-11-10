import { useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ApplicationRecord } from "./application-record";
import { ContributionCard, MarkedAnswer } from "./contribution-card";
import { nextStages, stageLabels, type Application } from "./model";
import { usePrototype } from "./store";

export function RecruitingApplication({ application }: { application: Application }) {
  const { state, run } = usePrototype();
  const [note, setNote] = useState("");
  const [comparing, setComparing] = useState(false);
  const assistant = application.assistant;
  const [announcement, setAnnouncement] = useState("");
  const statusRef = useRef<HTMLSpanElement>(null);
  const pendingFocus = useRef(false);
  const company = state.companies.find((item) => item.id === application.companyId);
  const availableStages = nextStages[application.stage];

  useLayoutEffect(() => {
    if (pendingFocus.current) {
      statusRef.current?.focus();
      pendingFocus.current = false;
    }
  }, [application.stage]);

  return (
    <>
      <ApplicationRecord
        application={application}
        companyName={company?.name ?? ""}
        audience="employer"
        history={application.events}
        statusRef={statusRef}
        lead={<ContributionCard answer={application.answer} assistant={assistant} />}
        answerContent={
          <>
            <h3>Przesłana aplikacja</h3>
            {assistant ? (
              <>
                <p className="record-caption">
                  Kandydat użył asystenta. Wyszarzone zdania dopisał asystent.
                </p>
                <p>
                  <MarkedAnswer text={application.answer} assistant={assistant} />
                </p>
                <div className="record-actions">
                  <Button
                    variant="outline"
                    aria-expanded={comparing}
                    onClick={() => setComparing((value) => !value)}
                  >
                    {comparing ? "Ukryj tekst kandydata" : "Porównaj z tekstem kandydata"}
                  </Button>
                </div>
                {comparing && (
                  <section
                    id="candidate-own-text"
                    className="candidate-own-text"
                    aria-labelledby="candidate-own-text-title"
                  >
                    <h4 id="candidate-own-text-title">Tekst napisany przez kandydata</h4>
                    <p>{assistant.ownText}</p>
                  </section>
                )}
              </>
            ) : (
              <p>{application.answer}</p>
            )}
          </>
        }
        footer={
          availableStages.length > 0 ? (
            <>
              <p className="record-caption">Notatka zapisze się w historii po zmianie etapu.</p>
              <div className="record-actions">
                {availableStages.map((stage) => (
                  <Button
                    key={stage}
                    variant={stage === "rejected" ? "outline" : "default"}
                    onClick={() => {
                      if (run({ type: "stage", applicationId: application.id, stage, note })) {
                        setNote("");
                        setAnnouncement(`Zapisano etap: ${stageLabels[stage]}.`);
                        pendingFocus.current = true;
                      }
                    }}
                  >
                    {stageLabels[stage]}
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <p className="record-caption">
              {stageLabels[application.stage]}. Brak kolejnych działań w tym procesie.
            </p>
          )
        }
      >
        {availableStages.length > 0 ? (
          <>
            <h3>
              <label htmlFor="recruiting-note">Notatka rekrutacyjna</label>
            </h3>
            <p className="record-caption" id="recruiting-note-hint">
              Widoczna tylko pracodawcy w tym scenariuszu.
            </p>
            <Textarea
              id="recruiting-note"
              aria-label="Notatka rekrutacyjna (widoczna pracodawcy)"
              aria-describedby="recruiting-note-hint"
              maxLength={12000}
              rows={4}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Co warto sprawdzić w rozmowie?"
            />
          </>
        ) : null}
      </ApplicationRecord>
      <p role="status" className="sr-only">
        {announcement}
      </p>
    </>
  );
}
