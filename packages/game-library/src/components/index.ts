import { createCatalog } from "../catalog.js";
import { boardsMeadowV1, piecesMeadowV1 } from "./boards/meadow-v1.js";
import { boardsQuietGlade, piecesQuietGlade } from "./boards/quiet-glade.js";
import { boardsGoblinWoods } from "./boards/goblin-woods.js";
import { coreTileBoard } from "./core/tile-board.js";
import {
  itemsCharm,
  itemsKnife,
  itemsMachete,
  itemsMakeshiftBridge,
  itemsRopeBridge,
  itemsShield,
  itemsSledgehammer,
  itemsSneak,
  itemsSpear,
  itemsSword,
} from "./items/goblin-woods.js";
import { rulesProgrammedRun } from "./rules/programmed-run.js";

export const ALL_COMPONENTS = [
  coreTileBoard,
  boardsMeadowV1,
  piecesMeadowV1,
  boardsQuietGlade,
  piecesQuietGlade,
  rulesProgrammedRun,
  itemsSword,
  itemsShield,
  itemsMakeshiftBridge,
  itemsRopeBridge,
  itemsMachete,
  itemsKnife,
  itemsSpear,
  itemsCharm,
  itemsSneak,
  itemsSledgehammer,
  boardsGoblinWoods,
];

export function createDefaultCatalog() {
  return createCatalog(ALL_COMPONENTS);
}
