import { describe, expect, it } from "vitest";
import { analyticsEnabled, trackUrlChanges } from "./analytics";

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
