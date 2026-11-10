# Contribution card and variant C assistant

Slug: `contribution-card`
Created: 2026-11-10

## Goal

Help the employer check before the interview how much the candidate did themselves (discovery decision A, test E1), and keep the candidate's own-contribution sentence when a writing assistant is used (variant C).

## Context

Discovery (course vault, decision 2026-11-03): in the June data the assistant removed the own-contribution sentence for 69% of candidates who wrote one, while that sentence separated interview outcomes (39.5% vs 13.6% continued). The current app had no candidate assistant (CAN-12 removed), so the human chose to reintroduce a local assistant that demonstrates variant C.

## Plan

- [x] Review application form, record view, model and tests
- [x] Keyword rule (`contribution.ts`) validated on the 24 E0 sentences
- [x] Local assistant in the application form, optional `assistant` record in schema (version 1 compatible)
- [x] Employer card, muted assistant sentences and „Porównaj z tekstem kandydata”
- [x] Unit tests and one browser journey with axe check
- [x] Browser journeys pass (35/35); `./scripts/verify` still blocked by CRLF-only checks, see handoff

## Acceptance Criteria

- [x] Every employer application view shows the card with a quote and one of three neutral labels, or the no-example label.
- [x] The assistant never removes or rewrites a candidate sentence; its sentences are visibly and accessibly marked for the employer.
- [x] Legacy data without the record still loads and shows the plain answer; legacy notes/generated text stay hidden.
- [x] Mobile (375px) and desktop (1440px) without horizontal scroll, checked in the browser.

## Files / Areas

- `src/features/prototype/contribution.ts`, `contribution.test.ts`, `contribution-card.tsx`, `application-assistant.tsx`
- `src/features/prototype/model.ts`, `workspace.tsx`, `application-record.tsx`, `recruiting-application.tsx`
- `src/app/records.css`, `src/app/application.css`, `tests/e2e/prototype.spec.ts`, `FEATURES.md`

## Risks

- The rule is a keyword heuristic tuned on synthetic E0 sentences; free text can be mislabeled. The card says it is not an assessment.
- Blind labelling by a second person (E1 prerequisite) is still pending.
- Showing the candidate's own text to the employer is part of the decided design; candidates are told assistant sentences will be marked.

## Handoff Notes

Verification on 2026-11-10 (Windows checkout, `core.autocrlf=true`, Node 24.20.0), run step by step instead of `./scripts/verify`:

- Passed: `npm run lint`, `npm run typecheck`, `npm test` (57 unit tests, incl. 30 new rule/assistant tests), `npm run build` (existing large-chunk warning).
- Not run: `npx playwright test` - Playwright Chromium headless shell is not installed on this machine (not installed automatically per repo rules). The new journey `assistant keeps the own-contribution sentence and the employer card shows it` is therefore unexecuted.
- Failing for a pre-existing reason unrelated to this change: `format:check` (142 files), `design-system:check` (`.nvmrc` hash) and `verify:packet` (baseline CSV) all compare CRLF working-copy files. Touched files were formatted with Prettier; content diffs stay minimal.
- Manual browser check on the running dev server (127.0.0.1:3001): seeded employer view, full candidate flow (write answer → assistant proposal → use → submit) and the resulting employer card; 375px and 1440px without horizontal scroll; no console errors; own sentences ink, assistant sentences muted + dotted.

Later human-requested changes before commit: card background #126B9E with white text and italic quote; brand accent #ff90e8 replaced by #b3245a (white text, #9a1e4d hover) across the app.

Follow-up on 2026-11-10 after installing Playwright Chromium (`npx playwright install chromium`, at the human's request): `npm run build` + `npx playwright test` - 35 passed. Three journeys first failed because of this change and were fixed: the legacy draft test now includes the new „Popraw z asystentem” button in the keyboard order, and the employer compare button uses its own `record-compare` class so terminal stages still render no `.record-actions`. Note: browser tests run against the built `dist/`, so rebuild before rerunning.
