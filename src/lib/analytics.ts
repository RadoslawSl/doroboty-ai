/**
 * Anonymous browser analytics and session replay (PostHog Cloud EU) for published builds only.
 *
 * - Runs only in production builds served from a non-local host, so `npm run dev`,
 *   `npm run preview` and the Playwright journeys on 127.0.0.1 make no external requests.
 * - The project key is PostHog's public ingestion key (designed to ship in frontend code).
 * - Memory persistence: no cookies or localStorage; each page load is a new anonymous visitor
 *   and a new replay session.
 *
 * Private data (see FEATURES.md SYS-03):
 * - Mark text that shows a person's data (name, headline, bio, answers, CV, projects, e-mail)
 *   with `data-private`. Inside links and buttons wrap it in `<bdi data-private>`, never a
 *   `<span>`: PostHog adds nested span text to a link's or button's `$el_text`.
 * - Autocapture ignores clicks on `[data-private]` and never records typed values.
 * - Session replay masks every input value and the text of `[data-private]`, and blocks
 *   iframes (CV preview) and file inputs. Console logs are not recorded.
 *
 * Product events (lever 1 of the North Star, see FEATURES.md SYS-03) go through `track` and
 * carry only enum/boolean properties - never names, answer text or record IDs.
 */
export const POSTHOG_KEY = "phc_uC7UuJw2uc9phs4L6pwWNmpoibUJ6TygggYBXsMvhdum";
export const POSTHOG_HOST = "https://eu.i.posthog.com";
export const PRIVATE_SELECTOR = "[data-private]";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

export function analyticsEnabled(hostname: string, production: boolean): boolean {
  if (!production) return false;
  const host = hostname.toLowerCase();
  return !(LOCAL_HOSTS.has(host) || host.endsWith(".localhost") || host === "");
}

export function posthogOptions() {
  return {
    api_host: POSTHOG_HOST,
    persistence: "memory" as const,
    person_profiles: "identified_only" as const,
    // PostHog's own history tracking ignores the hash, and the app uses hash routes,
    // so only the first page view comes from PostHog; route changes are captured below.
    capture_pageview: true,
    autocapture: {
      // Providing a list replaces PostHog's defaults, so they are repeated here.
      css_selector_ignorelist: [PRIVATE_SELECTOR, ".ph-no-autocapture", "[data-ph-no-autocapture]"],
      capture_copied_text: false,
    },
    disable_session_recording: false,
    enable_recording_console_log: false,
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: PRIVATE_SELECTOR,
      blockSelector: 'iframe, input[type="file"]',
    },
    disable_surveys: true,
  };
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

export type ContributionKindProperty = "own" | "preparation" | "none";

/** Product events and their (non-private) properties. */
export type ProductEvents = {
  /** Employer opened an application and saw the "Co kandydat zrobił sam" card. */
  contribution_card_viewed: { contribution_kind: ContributionKindProperty };
  /** Employer toggled "Porównaj z tekstem kandydata". */
  compare_clicked: { open: boolean; contribution_kind: ContributionKindProperty };
  /** Employer moved an application to "Zaproszenie na rozmowę". */
  candidate_invited: { contribution_kind: ContributionKindProperty };
};

type Capture = (event: string, properties: Record<string, unknown>) => void;

let capture: Capture | null = null;
let queue: Array<[string, Record<string, unknown>]> | null = [];
const QUEUE_LIMIT = 50;

/** Sends a product event once PostHog is ready; a no-op where analytics is off. */
export function track<E extends keyof ProductEvents>(event: E, properties: ProductEvents[E]): void {
  send(event, properties);
}

function send(event: string, properties: Record<string, unknown>): void {
  if (capture) {
    try {
      capture(event, properties);
    } catch {
      // Analytics must never break the prototype.
    }
  } else if (queue && queue.length < QUEUE_LIMIT) {
    queue.push([event, properties]);
  }
}

/** Connects `track` to a client (PostHog) and flushes events sent before it loaded. */
export function connectTracking(client: Capture | null): void {
  const pending = queue ?? [];
  queue = null;
  capture = client;
  if (client) for (const [event, properties] of pending) send(event, properties);
}

/** Test helper: back to the initial queueing, unconnected state. */
export function resetTracking(): void {
  capture = null;
  queue = [];
}

export async function initAnalytics(): Promise<void> {
  if (!analyticsEnabled(window.location.hostname, import.meta.env.PROD)) {
    connectTracking(null);
    return;
  }
  try {
    const { default: posthog } = await import("posthog-js");
    posthog.init(POSTHOG_KEY, posthogOptions());
    trackUrlChanges(() => posthog.capture("$pageview"));
    connectTracking((event, properties) => posthog.capture(event, properties));
  } catch {
    // Analytics must never break the prototype.
    connectTracking(null);
  }
}
