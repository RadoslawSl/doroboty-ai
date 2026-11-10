/**
 * Prototype rule for the "Co kandydat zrobił sam" card (discovery decision A, test E1).
 * It is a keyword rule derived from the E0 sentence list, not an AI model and not an
 * assessment of the candidate. It only picks one sentence and labels its kind.
 */

export type ContributionKind = "own" | "preparation" | "none";

export const contributionLabels: Record<ContributionKind, string> = {
  own: "Opisuje własny wkład w działające rozwiązanie",
  preparation: "Opisuje przygotowanie lub udział, nie własne wdrożenie",
  none: "Brak konkretnego przykładu",
};

export function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?…])\s+(?=[^\s])/u)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

// Preparation, presentation, workshops and demos (E0 "przygotowanie lub udział").
const preparation =
  /(przygotow\p{L}*\s+(prompt|prezentacj|materiał|opis|przykład)|prezentacj|warsztat|\bdemo\b|demonstracj|uczestniczył|zbierał\p{L}*\s|koordynował|przegląd narzędzi|rekomendacj|pisał\p{L}*\s+instrukcj|sprawdzał\p{L}*\s+gotowe|implementacj\p{L}*\s+(usługi\s+)?wykonał|wykonał\p{L}*\s+(drugi|inny)\s+zesp)/iu;

// First-person ownership of a working solution or a decision mandate (E0 "własny wkład").
const ownership =
  /^(sam\p{L}?\s|samodzielnie\s|mój zakres|moja część|moim zadaniem było|odpowiadał\p{L}*\s+za|wprowadził\p{L}*|wdrożył\p{L}*|zbudował\p{L}*|zaimplementował\p{L}*|napisał\p{L}*\s+(kod|moduł|usług|integracj|skrypt)|utrzymywał\p{L}*|zmienił\p{L}*|miał\p{L}*\s+mandat|zarządzał\p{L}*|uzgadniał\p{L}*|(po|prze)?prowadził\p{L}*\s.*wdroż|(po)?prowadził\p{L}*\s.*decyzj|zaprojektował\p{L}*\s.*wdroż)/iu;
// Strong first-person implementation verbs later in the sentence ("... i wdrożyłam automatyzację").
const implementation = /(^|\s)(wdrożył|zbudował|zaimplementował)\p{L}*\s/iu;

export function classifySentence(sentence: string): ContributionKind {
  if (preparation.test(sentence)) return "preparation";
  if (ownership.test(sentence.trim()) || implementation.test(sentence)) return "own";
  return "none";
}

export type ContributionFinding = { kind: ContributionKind; sentence: string | null };

/** Picks the first own-contribution sentence, otherwise the first preparation sentence. */
export function findContribution(text: string): ContributionFinding {
  const sentences = splitSentences(text);
  const kinds = sentences.map((sentence) => ({ sentence, kind: classifySentence(sentence) }));
  const found =
    kinds.find((item) => item.kind === "own") ?? kinds.find((item) => item.kind === "preparation");
  return found ? found : { kind: "none", sentence: null };
}

export const ASSISTANT_OPENING = (jobTitle: string) =>
  `Aplikuję na stanowisko ${jobTitle}, bo w tej roli AI jest częścią odpowiedzialności za wynik pracy.`;
export const ASSISTANT_CLOSING =
  "Chętnie omówię na rozmowie szczegóły tego projektu, swoją rolę i ograniczenia rozwiązania.";

/**
 * Local, deterministic writing assistant (no network, no model). Variant C: it may add an
 * opening and a closing sentence, but it never removes or rewrites a sentence in which the
 * candidate describes their own contribution - every candidate sentence is kept verbatim.
 */
export function assistAnswer(ownText: string, jobTitle: string): string {
  const opening = ASSISTANT_OPENING(jobTitle);
  const sentences = splitSentences(ownText).filter(
    (sentence) => sentence !== opening && sentence !== ASSISTANT_CLOSING,
  );
  return [opening, ...sentences, ASSISTANT_CLOSING].join(" ");
}

export type MarkedSentence = { text: string; fromAssistant: boolean };

/** Marks sent sentences that came from the assistant proposal and not from the candidate. */
export function markAssistantSentences(
  sent: string,
  assistant?: { ownText: string; proposal: string },
): MarkedSentence[] {
  const sentences = splitSentences(sent);
  if (!assistant) return sentences.map((text) => ({ text, fromAssistant: false }));
  const own = new Set(splitSentences(assistant.ownText));
  const proposal = new Set(splitSentences(assistant.proposal));
  return sentences.map((text) => ({ text, fromAssistant: proposal.has(text) && !own.has(text) }));
}
