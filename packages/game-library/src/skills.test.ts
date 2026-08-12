import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../../..");

function read(rel: string): string {
  return readFileSync(resolve(root, rel), "utf8");
}

describe("skill workflow drift guards", () => {
  it("requires variant-from-library composition guidance", () => {
    const skill = read(".cursor/skills/variant-from-library/SKILL.md");
    expect(skill).toMatch(/catalog search/);
    expect(skill).toMatch(/defineVariant/);
    expect(skill).not.toMatch(/Copy `prototypes\/meadow-v1`/);
  });

  it("redirects prototype-from-template away from copying", () => {
    const skill = read(".cursor/skills/prototype-from-template/SKILL.md");
    expect(skill).toMatch(/DEPRECATED|deprecated/i);
    expect(skill).toMatch(/variant-from-library/);
    expect(skill).toMatch(/Do not copy/i);
  });

  it("fast-track requires component disposition and affected checks", () => {
    const skill = read(".cursor/skills/openspec-fasttrack/SKILL.md");
    expect(skill).toMatch(/variant-local/);
    expect(skill).toMatch(/game:check/);
    expect(skill).toMatch(/game-component-library/);
  });

  it("AGENT.md teaches component vs variant decision tree", () => {
    const agent = read("AGENT.md");
    expect(agent).toMatch(/Decision tree/);
    expect(agent).toMatch(/game-library/);
    expect(agent).toMatch(/canonical component/);
  });
});
