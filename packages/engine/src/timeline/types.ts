export type SocietyKind = "culture" | "science" | "politics";
export type EventKind = "person" | "place" | "thing";
export type ResourceKind = "parts" | "minerals";
export type InventionKind = "education" | "infrastructure";

export type CardFamily =
  | "event"
  | "resource"
  | "invention"
  | "society"
  | "blueprint"
  | "random-draw"
  | "draw-blueprint";

export type CardPile = "omega" | "action" | "blueprint";

export type DeviceId =
  | "brancher"
  | "reverser"
  | "relocator"
  | "pruner"
  | "merger"
  | "rewriter"
  | "preserver"
  | "jumper";

export type TimelineCardDefinition = {
  id: string;
  label: string;
  family: CardFamily;
  eventKind?: EventKind;
  resourceKind?: ResourceKind;
  inventionKind?: InventionKind;
  inventionMultiplier?: number;
  societyKind?: SocietyKind;
  societyValue?: number;
  deviceId?: DeviceId;
  /** Extra copies in the matching pile. Defaults to 1. */
  copies?: number;
};

export type DeviceRequirements = {
  parts: number;
  minerals: number;
  crystals: number;
  culture: number;
  science: number;
  politics: number;
};

export type TimelineDeviceDefinition = {
  id: DeviceId;
  letter: string;
  label: string;
  summary: string;
  uses: number;
  requirements: DeviceRequirements;
};

export type ObjectiveSpec = {
  id: string;
  personId: string;
  placeId: string;
  thingId: string;
};

export type TimelineConfig = {
  debugMode?: boolean;
  /** Playtest player count. Timeline Game currently ships as 1-player. */
  playerCount?: number;
  jumpSteps?: number;
  maxPrimaryLength?: number;
  maxBranchLength?: number;
  maxPathLength?: number;
  maxBranches?: number;
  maxHand?: number;
  maxDevices?: number;
  cards: TimelineCardDefinition[];
  devices: TimelineDeviceDefinition[];
  objectives?: ObjectiveSpec[];
  seedCardIds?: string[];
  startingHand?: string[];
  startingResources?: { parts: number; minerals: number; crystals: number };
};

export type PlacedCard = {
  instanceId: string;
  cardId: string;
};

export type TimelineNode = {
  id: string;
  branchId: string;
  depth: number;
  parentIds: string[];
  childIds: string[];
  card: PlacedCard | null;
  revealed: boolean;
};

export type TimelineBranch = {
  id: string;
  index: number;
  label: string;
  headNodeId: string;
  rootNodeId: string;
  parentBranchId: string | null;
  forkNodeId: string | null;
  crystals: number;
  preserved: boolean;
  /** Set when this timeline merged into another branch’s head and no longer grows. */
  mergedIntoNodeId?: string;
};

export type BuiltDevice = {
  instanceId: string;
  deviceId: DeviceId;
  usesLeft: number;
};

export type PlayerObjective = ObjectiveSpec & {
  complete: boolean;
};

export type PlayerMat = {
  parts: number;
  minerals: number;
  crystals: number;
  devices: BuiltDevice[];
  blueprints: DeviceId[];
  objectives: PlayerObjective[];
  pendingClaimIds: string[];
  completedCount: number;
};

export type TimelineStatus = "playing" | "endOfTime" | "won";

export type TimelineState = {
  nodes: Record<string, TimelineNode>;
  branches: Record<string, TimelineBranch>;
  epochNodeId: string;
  primaryBranchId: string;
  travelerNodeId: string;
  hand: PlacedCard[];
  actionDeck: string[];
  omegaDeck: string[];
  blueprintDeck: string[];
  player: PlayerMat;
  debugMode: boolean;
  status: TimelineStatus;
  log: string[];
  nextId: number;
  rngSeed: number;
};

export type TimelineAction =
  | { type: "setDebugMode"; enabled: boolean }
  | { type: "moveTo"; nodeId: string }
  | { type: "stepForward" }
  | { type: "stepBack" }
  | { type: "draw" }
  | { type: "debugAddCard"; cardId: string }
  | {
      type: "debugSetResource";
      resource: "parts" | "minerals" | "crystals";
      delta: number;
    }
  | { type: "takeCrystal"; branchId: string }
  | { type: "playCard"; instanceId: string; atNodeId: string }
  | { type: "deviceBrancher"; fromNodeId: string; instanceId: string }
  | { type: "deviceReverser"; toNodeId: string }
  | { type: "deviceRelocator"; branchId: string; newParentNodeId: string }
  | { type: "devicePruner"; branchId: string }
  | { type: "deviceMerger"; fromBranchId: string; intoNodeId: string }
  | { type: "deviceRewriter"; nodeId: string; instanceId: string }
  | { type: "devicePreserver"; branchId: string }
  | { type: "deviceJumper"; toNodeId: string }
  | { type: "debugBuildDevice"; deviceId: DeviceId }
  | { type: "claimObjective"; objectiveId: string }
  | { type: "endTurn" }
  | { type: "endOfTimeStay" }
  | { type: "endOfTimeRoll"; branchIndex?: number };
