import { describe, expect, it } from "vitest";
import { analyticsEnabled } from "./analytics";

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
