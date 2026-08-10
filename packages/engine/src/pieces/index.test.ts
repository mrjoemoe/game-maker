import { describe, expect, it } from "vitest";
import { movePiece } from "./index.js";

describe("pieces", () => {
  const grid = { width: 3, height: 3 };
  const pieces = [
    { id: "p1", typeId: "token", position: { x: 0, y: 0 } },
  ];

  it("moves a piece to an in-bounds destination", () => {
    const next = movePiece(pieces, "p1", { x: 2, y: 1 }, grid);
    expect(next[0].position).toEqual({ x: 2, y: 1 });
  });

  it("rejects an out-of-bounds move and leaves positions unchanged when caught", () => {
    expect(() => movePiece(pieces, "p1", { x: 9, y: 0 }, grid)).toThrow(
      /out of bounds/,
    );
    expect(pieces[0].position).toEqual({ x: 0, y: 0 });
  });
});
