import { useState } from "react";
import { Button } from "@/components/ui/button";
import { assistAnswer } from "./contribution";
import { MarkedAnswer, candidateText } from "./contribution-card";
import { MIN_APPLICATION_ANSWER_LENGTH, type AssistantRecord } from "./model";

/**
 * Optional local writing assistant (variant C). It proposes an opening and a closing sentence
 * and keeps every sentence the candidate wrote, including their own-contribution sentence.
 * Nothing changes until the candidate chooses "Użyj propozycji".
 */
export function ApplicationAssistant({
  answer,
  jobTitle,
  assistant,
  disabled,
  onUse,
}: {
  answer: string;
  jobTitle: string;
  assistant?: AssistantRecord;
  disabled?: boolean;
  onUse: (record: AssistantRecord) => void;
}) {
  const [proposal, setProposal] = useState<AssistantRecord | null>(null);
  const ownText = candidateText(answer, assistant);
  const tooShort = ownText.trim().length < MIN_APPLICATION_ANSWER_LENGTH;
  return (
    <section
      className="application-form-section application-assistant"
      aria-labelledby="application-assistant-title"
    >
      <h3 id="application-assistant-title">Asystent pisania (opcjonalnie)</h3>
      <p className="application-help" id="application-assistant-help">
        Asystent dopisze wstęp i zakończenie. Nie usuwa ani nie zmienia zdań, w których opisujesz
        swój własny wkład. Zdania od asystenta pracodawca zobaczy jako oznaczone.
      </p>
      <div className="application-actions">
        <Button
          type="button"
          variant="outline"
          disabled={disabled || tooShort}
          aria-describedby="application-assistant-help"
          onClick={() => setProposal({ ownText, proposal: assistAnswer(ownText, jobTitle) })}
        >
          Popraw z asystentem
        </Button>
      </div>
      {proposal && (
        <div className="assistant-proposal" aria-labelledby="assistant-proposal-title">
          <h4 id="assistant-proposal-title">Propozycja asystenta</h4>
          <p>
            <MarkedAnswer text={proposal.proposal} assistant={proposal} />
          </p>
          <p className="application-help">Wyszarzone zdania dopisał asystent.</p>
          <div className="application-actions">
            <Button
              type="button"
              disabled={disabled}
              onClick={() => {
                onUse(proposal);
                setProposal(null);
              }}
            >
              Użyj propozycji
            </Button>
            <Button type="button" variant="ghost" onClick={() => setProposal(null)}>
              Odrzuć
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
