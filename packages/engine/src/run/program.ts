import type { Direction } from "../grid/directions.js";
import { directionLabel } from "../grid/directions.js";

/** One atomic programmed action (moves included). */
export type ProgramAction =
  | { kind: "move"; direction: Direction }
  | { kind: "takeFromMage"; itemId: string }
  | { kind: "buyFromShop"; itemId: string }
  | { kind: "useItem"; itemId: string }
  | { kind: "extract" }
  | { kind: "travelToPortal"; portalId: number };

/** Alias: each program slot is one atomic action. */
export type ProgramStep = ProgramAction;

/** Coin cost for each shop purchase. */
export const SHOP_ITEM_COST = 3;

/** Portal ids used by Goblin Woods travel actions. */
export const PORTAL_IDS = [1, 2, 3, 4] as const;

export function programActionLabel(
  action: ProgramAction,
  itemLabel?: string,
): string {
  switch (action.kind) {
    case "move":
      return directionLabel(action.direction);
    case "takeFromMage":
      return `Take ${itemLabel ?? action.itemId} from Mage`;
    case "buyFromShop":
      return `Buy ${itemLabel ?? action.itemId} (${SHOP_ITEM_COST}🪙)`;
    case "useItem":
      return `Use ${itemLabel ?? action.itemId}`;
    case "extract":
      return "Extract";
    case "travelToPortal":
      return `Travel to Portal ${action.portalId}`;
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}
