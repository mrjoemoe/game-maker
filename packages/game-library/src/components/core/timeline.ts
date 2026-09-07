import { defineComponent } from "../../authoring.js";
import type {
  DeviceId,
  TimelineCardDefinition,
  TimelineDeviceDefinition,
} from "@game-maker/engine";

const DEVICES: TimelineDeviceDefinition[] = [
  {
    id: "brancher",
    letter: "A",
    label: "Brancher",
    summary: "Fork a timeline and play a card onto it",
    uses: 2,
    blueprintCopies: 12,
    requirements: {
      parts: 2,
      minerals: 5,
      crystals: 2,
      culture: 4,
      science: 2,
      politics: 0,
    },
  },
  {
    id: "reverser",
    letter: "B",
    label: "Reverser",
    summary: "Jump back along your past",
    uses: 3,
    blueprintCopies: 12,
    requirements: {
      parts: 3,
      minerals: 1,
      crystals: 1,
      culture: 5,
      science: 5,
      politics: 5,
    },
  },
  {
    id: "relocator",
    letter: "C",
    label: "Relocator",
    summary: "Attach a branch to a new parent",
    uses: 1,
    blueprintCopies: 6,
    requirements: {
      parts: 3,
      minerals: 3,
      crystals: 3,
      culture: 2,
      science: 4,
      politics: 1,
    },
  },
  {
    id: "pruner",
    letter: "D",
    label: "Pruner",
    summary: "Cut a branch and return its events",
    uses: 1,
    blueprintCopies: 3,
    requirements: {
      parts: 3,
      minerals: 3,
      crystals: 4,
      culture: 3,
      science: 3,
      politics: 3,
    },
  },
  {
    id: "merger",
    letter: "E",
    label: "Merger",
    summary: "Join two branch heads; incoming timeline ends",
    uses: 1,
    blueprintCopies: 3,
    requirements: {
      parts: 5,
      minerals: 1,
      crystals: 4,
      culture: 1,
      science: 1,
      politics: 5,
    },
  },
  {
    id: "rewriter",
    letter: "F",
    label: "Rewriter",
    summary: "Swap a hand card with a timeline card",
    uses: 3,
    blueprintCopies: 24,
    requirements: {
      parts: 1,
      minerals: 3,
      crystals: 1,
      culture: 1,
      science: 3,
      politics: 1,
    },
  },
  {
    id: "preserver",
    letter: "G",
    label: "Preserver",
    summary: "Lock cards already laid up to a chosen moment",
    uses: 1,
    blueprintCopies: 3,
    requirements: {
      parts: 1,
      minerals: 1,
      crystals: 5,
      culture: 1,
      science: 1,
      politics: 1,
    },
  },
  {
    id: "jumper",
    letter: "H",
    label: "Jumper",
    summary: "Skip ahead up to 3 spaces",
    uses: 3,
    blueprintCopies: 12,
    requirements: {
      parts: 1,
      minerals: 1,
      crystals: 1,
      culture: 1,
      science: 1,
      politics: 1,
    },
  },
];

function events(): TimelineCardDefinition[] {
  const persons = [
    "Ada",
    "Tesla",
    "Curie",
    "Hypatia",
    "Newton",
    "Hatshepsut",
    "Galileo",
    "Darwin",
    "Franklin",
    "Cleopatra",
  ];
  const places = [
    "Paris",
    "Alexandria",
    "Kyoto",
    "Venice",
    "Tenochtitlan",
    "Baghdad",
    "London",
    "Cairo",
    "Athens",
    "Rome",
  ];
  const things = [
    "Chronometer",
    "Printing Press",
    "Radio",
    "Astrolabe",
    "Loom",
    "Compass",
    "Telescope",
    "Steam Engine",
    "Abacus",
    "Porcelain",
  ];
  return [
    ...persons.map((label) => ({
      id: label.toLowerCase(),
      label,
      family: "event" as const,
      eventKind: "person" as const,
    })),
    ...places.map((label) => ({
      id: label.toLowerCase(),
      label,
      family: "event" as const,
      eventKind: "place" as const,
    })),
    ...things.map((label) => ({
      id: label.replace(/\s+/g, "-").toLowerCase(),
      label,
      family: "event" as const,
      eventKind: "thing" as const,
    })),
  ];
}

const CARDS: TimelineCardDefinition[] = [
  ...events(),
  {
    id: "get-parts",
    label: "Get Parts",
    family: "resource",
    resourceKind: "parts",
  },
  {
    id: "get-minerals",
    label: "Get Minerals",
    family: "resource",
    resourceKind: "minerals",
  },
  {
    id: "education",
    label: "Education 2×",
    family: "invention",
    inventionKind: "education",
    inventionMultiplier: 2,
  },
  {
    id: "infrastructure",
    label: "Infrastructure 2×",
    family: "invention",
    inventionKind: "infrastructure",
    inventionMultiplier: 2,
  },
  {
    id: "culture-1",
    label: "Culture +1",
    family: "society",
    societyKind: "culture",
    societyValue: 1,
  },
  {
    id: "culture-2",
    label: "Culture +2",
    family: "society",
    societyKind: "culture",
    societyValue: 2,
  },
  {
    id: "science-1",
    label: "Science +1",
    family: "society",
    societyKind: "science",
    societyValue: 1,
  },
  {
    id: "science-2",
    label: "Science +2",
    family: "society",
    societyKind: "science",
    societyValue: 2,
  },
  {
    id: "politics-1",
    label: "Politics +1",
    family: "society",
    societyKind: "politics",
    societyValue: 1,
  },
  {
    id: "politics-2",
    label: "Politics +2",
    family: "society",
    societyKind: "politics",
    societyValue: 2,
  },
  {
    id: "draw-random",
    label: "Random Event",
    family: "random-draw",
    copies: 4,
  },
  {
    id: "draw-blueprint",
    label: "Draw Blueprint",
    family: "draw-blueprint",
    copies: 4,
  },
  ...DEVICES.map((d) => ({
    id: `blueprint-${d.id}`,
    label: `${d.label} Blueprint`,
    family: "blueprint" as const,
    deviceId: d.id as DeviceId,
    copies: d.blueprintCopies ?? 1,
  })),
];

export const coreTimeline = defineComponent({
  manifest: {
    id: "core/timeline",
    kind: "feature-bundle",
    schemaVersion: 1,
    contractVersion: "1.5.0",
    owner: "platform",
    docs: {
      summary:
        "Time-travel timeline template: branching graph, branch mats, player mat, and devices A–H.",
      playerFacing:
        "You are a time traveler repairing the past. Walk timelines, place Omega events, and complete person–place–thing objectives. Action cards (green backs) go in your hand. Each blueprint shows how many uses the built device has; crystal cost is paid to run it. Device costs and deck counts are listed in the Timeline Game rulebook.",
      developerNotes:
        "Contributes templateId timeline, a dummy 1×1 board for resolver compatibility, and three card piles (Omega events, action cards, blueprints). Debug mode defaults on. playerCount defaults to 1 (solo playtest).",
    },
  },
  contribute: ({ params }) => {
    const debugMode =
      typeof params.debugMode === "boolean" ? params.debugMode : true;
    return {
      templateId: "timeline",
      features: { timelineMode: true, tileFlip: false, runMode: false },
      board: {
        grid: { width: 1, height: 1 },
        tileTypes: [
          { id: "timestream", label: "Timestream", color: "#1a2332" },
        ],
        defaultTileTypeId: "timestream",
      },
      pieceTypes: [
        { id: "traveler", label: "Traveler", color: "#e8c547", icon: "◷" },
      ],
      initialPieces: [
        { id: "traveler", typeId: "traveler", position: { x: 0, y: 0 } },
      ],
      timeline: {
        debugMode,
        playerCount:
          typeof params.playerCount === "number" ? params.playerCount : 1,
        jumpSteps: 3,
        maxPrimaryLength: 20,
        maxBranchLength: 10,
        maxPathLength: 20,
        maxBranches: 12,
        maxHand: 7,
        maxDevices: 3,
        cards: CARDS,
        devices: DEVICES,
        objectives: [
          {
            id: "obj-ada",
            personId: "ada",
            placeId: "paris",
            thingId: "chronometer",
          },
          {
            id: "obj-tesla",
            personId: "tesla",
            placeId: "kyoto",
            thingId: "radio",
          },
          {
            id: "obj-curie",
            personId: "curie",
            placeId: "alexandria",
            thingId: "astrolabe",
          },
        ],
        seedCardIds: ["ada", "paris", "chronometer", "culture-1"],
        startingHand: ["get-parts", "science-1", "draw-random"],
        startingResources: { parts: 3, minerals: 3, crystals: 1 },
      },
    };
  },
});
