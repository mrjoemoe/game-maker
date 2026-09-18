import { describe, expect, it } from "vitest";
import { runKeyCommand } from "./runKeys.ts";

describe("runKeyCommand", () => {
  it("maps arrows to moves", () => {
    expect(runKeyCommand("ArrowRight", {})).toEqual({
      kind: "move",
      direction: "right",
    });
    expect(runKeyCommand("ArrowUp", {})).toEqual({
      kind: "move",
      direction: "up",
    });
  });

  it("maps Escape, D, and Enter", () => {
    expect(runKeyCommand("Escape", {})).toEqual({ kind: "clear" });
    expect(runKeyCommand("d", {})).toEqual({ kind: "debug" });
    expect(runKeyCommand("Enter", {})).toEqual({ kind: "run" });
  });

  it("ignores modified keys", () => {
    expect(runKeyCommand("ArrowRight", { ctrl: true })).toBeNull();
    expect(runKeyCommand("d", { meta: true })).toBeNull();
  });
});
