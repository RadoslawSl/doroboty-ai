/**
 * Anonymous browser analytics (PostHog Cloud EU) for published builds only.
 *
 * - Runs only in production builds served from a non-local host, so `npm run dev`,
 *   `npm run preview` and the Playwright journeys on 127.0.0.1 make no external requests.
 * - The project key is PostHog's public ingestion key (designed to ship in frontend code).
 * - Memory persistence: no cookies or localStorage; each page load is a new anonymous visitor.
 * - Autocapture records clicks and element labels, never values typed into form fields.
 * - Session recording and person profiles are off.
 */
export const POSTHOG_KEY = "phc_uC7UuJw2uc9phs4L6pwWNmpoibUJ6TygggYBXsMvhdum";
export const POSTHOG_HOST = "https://eu.i.posthog.com";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

export function analyticsEnabled(hostname: string, production: boolean): boolean {
  if (!production) return false;
  const host = hostname.toLowerCase();
  return !(LOCAL_HOSTS.has(host) || host.endsWith(".localhost") || host === "");
}

/** Calls `onChange` once per URL change (including the hash) from push/replace/back/forward. */
export function trackUrlChanges(onChange: () => void, win: Window = window): void {
  let last = win.location.href;
  const check = () => {
    const current = win.location.href;
    if (current === last) return;
    last = current;
    onChange();
  };
  for (const method of ["pushState", "replaceState"] as const) {
    const original = win.history[method].bind(win.history);
    win.history[method] = (...args: Parameters<History["pushState"]>) => {
      original(...args);
      check();
    };
  }
  win.addEventListener("popstate", check);
  win.addEventListener("hashchange", check);
}

export async function initAnalytics(): Promise<void> {
  if (!analyticsEnabled(window.location.hostname, import.meta.env.PROD)) return;
  try {
    const { default: posthog } = await import("posthog-js");
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      persistence: "memory",
      person_profiles: "identified_only",
      // PostHog's own history tracking ignores the hash, and the app uses hash routes,
      // so only the first page view comes from PostHog; route changes are captured below.
      capture_pageview: true,
      autocapture: true,
      disable_session_recording: true,
      disable_surveys: true,
    });
    trackUrlChanges(() => posthog.capture("$pageview"));
  } catch {
    // Analytics must never break the prototype.
  }
}
