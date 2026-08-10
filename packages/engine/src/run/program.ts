import type { Direction } from "../grid/directions.js";

/** What the hero does on a tile before moving. */
export type ProgramAction =
  | { kind: "none" }
  | { kind: "takeFromMage"; itemId: string }
  | { kind: "buyFromShop"; itemId: string }
  | { kind: "useItem"; itemId: string }
  | { kind: "extract" }
  | { kind: "travelToPortal"; portalId: number };

/** One committed plan step: action, then orthogonal move. */
export type ProgramStep = {
  action: ProgramAction;
  move: Direction;
};

/** Coin cost for each shop purchase. */
export const SHOP_ITEM_COST = 3;

/** Portal ids used by Goblin Woods travel actions. */
export const PORTAL_IDS = [1, 2, 3, 4] as const;

export function programActionLabel(action: ProgramAction, itemLabel?: string): string {
  switch (action.kind) {
    case "none":
      return "No action";
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
