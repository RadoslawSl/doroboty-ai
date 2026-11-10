import { describe, expect, it } from "vitest";
import {
  ASSISTANT_CLOSING,
  ASSISTANT_OPENING,
  assistAnswer,
  classifySentence,
  findContribution,
  markAssistantSentences,
  splitSentences,
} from "./contribution";

// Sentence list of the E0 rule (synthetic AIPH 3 data).
const own = [
  "Wprowadziłem zmianę w pracy zespołu i sprawdzałem, jak ludzie z niej korzystają.",
  "Odpowiadałem za przejście od prototypu do codziennej pracy.",
  "Utrzymywałem komponent przetwarzania i przygotowałem scenariusze ewaluacji.",
  "Zarządzałem kolejnością inicjatyw w zatwierdzonym budżecie.",
  "Uzgadniałem priorytety i kryteria decyzji ze sponsorem.",
  "Zmieniłem konkretny krok procesu z właścicielem operacji.",
  "Miałem mandat do ustalenia zakresu pierwszego wdrożenia.",
  "Prowadziłem uzgodnienia między właścicielami zespołów i decyzję o ograniczeniu zakresu.",
  "Odpowiadałem za integrację modelu i analizę błędów.",
  "Sam przygotowałem moduł wyszukiwania oraz porównanie wyników na danych testowych; warstwę interfejsu robił zespół.",
  "Mój zakres obejmował kod indeksowania i zestaw testów.",
  "Prowadziłem obserwacje procesu, rozmowy z użytkownikami i wdrożenie w jednym zespole.",
];
const preparation = [
  "Zbierałem uwagi do prototypu i porządkowałem przykłady.",
  "Przygotowywałem prompty i prezentację; implementację usługi wykonał drugi zespół.",
  "Koordynowałem kalendarz warsztatów i zbierałem pomysły.",
  "Prowadziłem prezentację planu.",
  "Zrobiłem przegląd narzędzi i rekomendację.",
  "Przygotowywałem materiały do spotkań.",
  "Zrobiłem demonstrację rozwiązania na własnych danych.",
  "Pisałem instrukcje do prototypu.",
  "Prowadziłem demo dla użytkowników.",
  "Uczestniczyłem w warsztatach i tworzyłem przykładowe prompty.",
  "Sprawdzałem gotowe odpowiedzi i opisywałem przypadki.",
  "Przygotowałem opis możliwych zastosowań i prezentację dla zespołu.",
];

describe("contribution rule", () => {
  it.each(own)("labels own contribution: %s", (sentence) => {
    expect(classifySentence(sentence)).toBe("own");
  });
  it.each(preparation)("labels preparation: %s", (sentence) => {
    expect(classifySentence(sentence)).toBe("preparation");
  });
  it("prefers an own-contribution sentence over preparation", () => {
    const text = `Chodzi o projekt katalogu produktów. ${preparation[0]} ${own[8]} Mogę omówić przykład.`;
    expect(findContribution(text)).toEqual({ kind: "own", sentence: own[8] });
  });
  it("falls back to preparation, then to no example", () => {
    expect(findContribution(`Chodzi o katalog. ${preparation[3]}`).kind).toBe("preparation");
    expect(findContribution("Interesuje mnie praca z danymi. Lubię nowe wyzwania.")).toEqual({
      kind: "none",
      sentence: null,
    });
  });
  it("splits sentences and normalizes whitespace", () => {
    expect(splitSentences("  Pierwsze zdanie.\n\nDrugie!  Trzecie?")).toEqual([
      "Pierwsze zdanie.",
      "Drugie!",
      "Trzecie?",
    ]);
  });
});

describe("assistant (variant C)", () => {
  const ownText = `Chodzi o projekt obsługi zgłoszeń. ${own[1]} ${preparation[0]}`;
  it("keeps every candidate sentence verbatim, including own contribution", () => {
    const proposal = assistAnswer(ownText, "AI Product Manager");
    for (const sentence of splitSentences(ownText)) expect(proposal).toContain(sentence);
    expect(findContribution(proposal)).toEqual({ kind: "own", sentence: own[1] });
  });
  it("does not stack opening and closing when run again", () => {
    const once = assistAnswer(ownText, "AI Product Manager");
    expect(assistAnswer(once, "AI Product Manager")).toBe(once);
  });
  it("marks only sentences added by the assistant", () => {
    const proposal = assistAnswer(ownText, "AI Product Manager");
    const marked = markAssistantSentences(proposal, { ownText, proposal });
    expect(marked.filter((x) => x.fromAssistant).map((x) => x.text)).toEqual([
      ASSISTANT_OPENING("AI Product Manager"),
      ASSISTANT_CLOSING,
    ]);
    expect(markAssistantSentences(proposal).some((x) => x.fromAssistant)).toBe(false);
  });
});
