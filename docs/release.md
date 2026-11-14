# Release and recovery runbook

This prototype is a static site. The planned host is GitHub Pages at
`https://radoslawsl.github.io/doroboty-ai/`, used by a few E1 test participants who receive the
link from the facilitator. There is no server or database: everything a participant types stays in
their own browser (localStorage). An outage means a session is moved or run locally; no data or
money is lost.

Status: the publishing workflow `.github/workflows/pages.yml` exists but has not run on GitHub
yet. Until the first successful publication, the "Publish" and "Roll back" sections describe the
intended procedure, not a tested one.

## Publish

1. One-time setting: repository Settings → Pages → Build and deployment → Source: GitHub Actions.
2. Merge the change into `main`. Every push to `main` runs `pages.yml`: `npm ci`, Playwright
   Chromium, the full `./scripts/verify` gate (which builds `dist/`), then deploys `dist/` to the
   `github-pages` environment. If the gate fails, nothing is published.
3. The workflow can also be started by hand: Actions → "Publish to GitHub Pages" → Run workflow.
4. Note the deployed commit (shown on the workflow run) and run the smoke check below.

## Smoke check after each publication

Open the site in a private browser window and confirm, in about five minutes:

1. Home page loads with the illustration and Build / Apply / Lead cards.
2. `#/oferty` lists offers and company logos are visible (no initials-only fallbacks everywhere).
3. A direct link such as `#/oferty/ai-product-manager` opens the offer after a full reload.
4. Choose a candidate persona (Anna or Marek) in `#/auth/sign-in`.
5. Apply to an offer and submit the application.
6. Switch to an employer persona (Karolina or Tomasz) and open the candidate list; the new
   application is there and a decision can be recorded.
7. A candidate CV opens as a PDF.
8. `#/app/settings` → reset restores the starting scenario.
9. The browser console (F12) shows no red errors.

Any failure: do not invite participants to this version; roll back or use the local fallback.

## Roll back to the previous working version

- Preferred: revert the faulty commit on `main` (`git revert <commit>`) and push. The publishing
  workflow redeploys the previous content.
- Faster: in the repository's Actions tab, open the last successful "Publish to GitHub Pages"
  run for a known good commit and choose "Re-run all jobs". It rebuilds and redeploys that commit.
- Rolling back code does not touch participants' saved data, because it lives only in their
  browsers. If a release changed the saved-data format (`doroboty.prototype.v1`), ask participants
  to use Settings → reset or a private window.

## Recovery before a test session

The facilitator opens the link 30 minutes before every E1 session. If the site does not work:

1. Check https://www.githubstatus.com (Pages) and the latest workflow run in the Actions tab.
2. If the latest release is at fault, roll back as described above.
3. If it cannot be fixed in time, run the prototype locally and share the screen:
   `npm ci`, `npm run build`, `npm run preview`, then open http://127.0.0.1:3001.
4. If neither works, reschedule the session.

## Capturing errors during a session

The app intentionally has no analytics or remote error logging. To capture a problem:

- Note the screen (hash URL), the persona and the step the participant was taking.
- Open the browser console (F12 → Console) and copy only the red error message. Do not copy
  application text typed by the participant.
- Publishing errors appear as failed runs in the repository's Actions tab; GitHub can email them
  (Settings → Notifications → Actions).

## Data handling for E1 sessions

Rule agreed with the project owner on 2026-11-14 and added to the E1 session script (super-brain
`3-Projects/doroboty-ai/supersprint/tydzien-2-powtorka/experiments/e1-session-script.md`):

- Do not enter real data. The facilitator asks participants in the welcome not to type real
  personal data or confidential company information; personas, applications and CVs are
  synthetic.
- Reset after every session. Data stays in the browser until removed. After saving the session
  results, the facilitator clears the state before the next participant: "Nowa sesja" in the E1
  prototype, and in this app `#/app/settings` → "Resetuj scenariusz" (or close the private
  window). The facilitator confirms the start screen is empty.
