import { contributionLabels, findContribution, markAssistantSentences } from "./contribution";
import type { AssistantRecord } from "./model";

/** Sent answer split into sentences; assistant sentences are muted and named for screen readers. */
export function MarkedAnswer({ text, assistant }: { text: string; assistant?: AssistantRecord }) {
  const sentences = markAssistantSentences(text, assistant);
  return (
    <>
      {sentences.map((sentence, index) => (
        <span key={index}>
          {index > 0 && " "}
          {sentence.fromAssistant ? (
            <span className="assistant-sentence">
              <span className="sr-only">Zdanie od asystenta: </span>
              {sentence.text}
            </span>
          ) : (
            sentence.text
          )}
        </span>
      ))}
    </>
  );
}

/** Candidate-written sentences of the sent answer (variant C: the card reads the sent version). */
export function candidateText(text: string, assistant?: AssistantRecord) {
  return markAssistantSentences(text, assistant)
    .filter((sentence) => !sentence.fromAssistant)
    .map((sentence) => sentence.text)
    .join(" ");
}

/** "Co kandydat zrobił sam" card shown at the top of every employer application view. */
export function ContributionCard({
  answer,
  assistant,
}: {
  answer: string;
  assistant?: AssistantRecord;
}) {
  const finding = findContribution(candidateText(answer, assistant));
  return (
    <section className="contribution-card" aria-labelledby="contribution-title">
      <h2 id="contribution-title">Co kandydat zrobił sam</h2>
      {finding.sentence ? (
        <blockquote className="contribution-quote">„{finding.sentence}”</blockquote>
      ) : (
        <p className="contribution-quote contribution-empty">
          W odpowiedzi nie ma zdania o konkretnej pracy kandydata.
        </p>
      )}
      <p className="contribution-label" data-kind={finding.kind}>
        {contributionLabels[finding.kind]}
      </p>
      <p className="record-caption">
        Zdanie wybrane regułą prototypu z tekstu napisanego przez kandydata. To nie jest ocena
        kandydata - warto dopytać o nie na rozmowie.
      </p>
    </section>
  );
}
