import { describe, expect, it } from "vitest";
import { pathForTab, tabFromPath, normalizePath } from "./playtestRoute.ts";

describe("playtestRoute", () => {
  it("normalizes and maps play/rulebook paths", () => {
    expect(normalizePath("/")).toBe("/");
    expect(normalizePath("/play/")).toBe("/play");
    expect(tabFromPath("/rulebook", true)).toBe("rulebook");
    expect(tabFromPath("/rulebook", false)).toBe("play");
    expect(tabFromPath("/", true)).toBe("play");
    expect(tabFromPath("/play", true)).toBe("play");
    expect(tabFromPath("/unknown", true)).toBe("play");
    expect(pathForTab("play")).toBe("/play");
    expect(pathForTab("rulebook")).toBe("/rulebook");
  });
});
