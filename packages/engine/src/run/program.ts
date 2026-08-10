import type { Direction } from "../grid/directions.js";

/** What the hero does on a tile before moving. */
export type ProgramAction =
  | { kind: "none" }
  | { kind: "takeFromMage"; itemId: string }
  | { kind: "useItem"; itemId: string };

/** One committed plan step: action, then orthogonal move. */
export type ProgramStep = {
  action: ProgramAction;
  move: Direction;
};

export function programActionLabel(action: ProgramAction, itemLabel?: string): string {
  switch (action.kind) {
    case "none":
      return "No action";
    case "takeFromMage":
      return `Take ${itemLabel ?? action.itemId} from Mage`;
    case "useItem":
      return `Use ${itemLabel ?? action.itemId}`;
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}
