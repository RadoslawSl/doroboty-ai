# PostHog browser analytics

## Intent and acceptance

Record anonymous page views and clicks from the published prototype in PostHog Cloud EU
(project 344018), so the team can see how E1 participants and visitors move through the app.

1. Add `posthog-js` (pinned) and initialize it from `src/main.tsx` through `src/lib/analytics.ts`.
2. Run only in production builds served from a non-local host. `npm run dev`, `npm run preview`
   and the Playwright journeys on 127.0.0.1 must still make no external requests.
3. Privacy defaults for E1 sessions: memory persistence (no cookies or localStorage), no person
   profiles, no session recording, autocapture of clicks only (no typed field values).
4. Update `FEATURES.md` (SYS-03, OPS-11) and `docs/release.md`.
5. After deployment, clicks on https://robota-ai-radsli.vercel.app/ appear as `$autocapture`
   events in PostHog.

Out of scope: custom business events, consent banner, session recording, error tracking.

## Validation

See the commit and the project log for what actually ran.
