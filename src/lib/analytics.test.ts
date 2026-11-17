import { beforeEach, describe, expect, it } from "vitest";
import {
  PRIVATE_SELECTOR,
  analyticsEnabled,
  connectTracking,
  posthogOptions,
  resetTracking,
  track,
  trackUrlChanges,
} from "./analytics";

describe("analyticsEnabled", () => {
  it("is off outside production builds", () => {
    expect(analyticsEnabled("doroboty-ai-rho.vercel.app", false)).toBe(false);
  });

  it("is off on local hosts", () => {
    for (const host of ["localhost", "127.0.0.1", "[::1]", "app.localhost", ""]) {
      expect(analyticsEnabled(host, true)).toBe(false);
    }
  });

  it("is on for published hosts", () => {
    expect(analyticsEnabled("robota-ai-radsli.vercel.app", true)).toBe(true);
    expect(analyticsEnabled("radoslawsl.github.io", true)).toBe(true);
  });
});

function fakeWindow() {
  const listeners: Record<string, () => void> = {};
  const location = { href: "https://example.test/#/" };
  const navigate = (url?: string | URL | null) => {
    if (url) location.href = new URL(String(url), location.href).href;
  };
  const history = {
    pushState: (_data: unknown, _unused: string, url?: string | URL | null) => navigate(url),
    replaceState: (_data: unknown, _unused: string, url?: string | URL | null) => navigate(url),
  };
  const win = {
    location,
    history,
    addEventListener: (type: string, fn: () => void) => (listeners[type] = fn),
  } as unknown as Window;
  return { win, location, listeners };
}

describe("trackUrlChanges", () => {
  it("reports hash route changes once each", () => {
    const { win, location, listeners } = fakeWindow();
    let count = 0;
    trackUrlChanges(() => count++, win);
    win.history.pushState(null, "", "#/oferty");
    win.history.replaceState(null, "", "#/oferty");
    win.history.pushState(null, "", "#/oferty/ai-product-manager");
    location.href = "https://example.test/#/oferty";
    listeners.popstate();
    listeners.hashchange();
    expect(count).toBe(3);
  });
});

describe("posthogOptions", () => {
  const options = posthogOptions();

  it("keeps private areas out of autocapture", () => {
    expect(options.autocapture.css_selector_ignorelist).toContain(PRIVATE_SELECTOR);
    expect(options.autocapture.capture_copied_text).toBe(false);
  });

  it("records sessions with inputs and private text masked", () => {
    expect(options.disable_session_recording).toBe(false);
    expect(options.session_recording.maskAllInputs).toBe(true);
    expect(options.session_recording.maskTextSelector).toBe(PRIVATE_SELECTOR);
    expect(options.session_recording.blockSelector).toContain("iframe");
    expect(options.enable_recording_console_log).toBe(false);
  });

  it("stores nothing in the browser", () => {
    expect(options.persistence).toBe("memory");
  });
});

describe("track", () => {
  beforeEach(() => resetTracking());

  it("sends events captured before PostHog loaded, in order", () => {
    const sent: Array<[string, Record<string, unknown>]> = [];
    track("contribution_card_viewed", { contribution_kind: "own" });
    track("candidate_invited", { contribution_kind: "none" });
    connectTracking((event, properties) => sent.push([event, properties]));
    track("compare_clicked", { open: true, contribution_kind: "preparation" });
    expect(sent).toEqual([
      ["contribution_card_viewed", { contribution_kind: "own" }],
      ["candidate_invited", { contribution_kind: "none" }],
      ["compare_clicked", { open: true, contribution_kind: "preparation" }],
    ]);
  });

  it("drops events where analytics is off", () => {
    track("candidate_invited", { contribution_kind: "own" });
    connectTracking(null);
    track("candidate_invited", { contribution_kind: "own" });
    const sent: string[] = [];
    connectTracking((event) => sent.push(event));
    expect(sent).toEqual([]);
  });

  it("never throws when the client fails", () => {
    connectTracking(() => {
      throw new Error("offline");
    });
    expect(() => track("candidate_invited", { contribution_kind: "own" })).not.toThrow();
  });
});
