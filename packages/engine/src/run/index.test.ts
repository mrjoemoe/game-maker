import { describe, expect, it } from "vitest";
import { applyDamage, collectItem, createRunState, markWon } from "./index.js";

describe("run", () => {
  it("creates an initial playing run", () => {
    const run = createRunState({ maxHp: 50 });
    expect(run).toEqual({
      status: "playing",
      hp: 50,
      maxHp: 50,
      inventory: [],
      attempts: 1,
      bump: null,
    });
  });

  it("applies damage and marks lost at zero HP", () => {
    let run = createRunState({ maxHp: 10 });
    run = applyDamage(run, 4);
    expect(run.hp).toBe(6);
    expect(run.status).toBe("playing");
    run = applyDamage(run, 10);
    expect(run.hp).toBe(0);
    expect(run.status).toBe("lost");
  });

  it("collects unique items", () => {
    let run = createRunState({ maxHp: 10 });
    run = collectItem(run, "sword");
    run = collectItem(run, "sword");
    expect(run.inventory).toEqual(["sword"]);
  });

  it("marks won only while playing", () => {
    const playing = createRunState({ maxHp: 10 });
    expect(markWon(playing).status).toBe("won");
    const lost = applyDamage(playing, 10);
    expect(markWon(lost).status).toBe("lost");
  });
});
