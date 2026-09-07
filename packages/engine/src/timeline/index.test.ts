import { describe, expect, it } from "vitest";
import {
  applyTimelineAction,
  createInitialTimeline,
  isHead,
  jumperTargets,
  objectiveIsPresent,
  type TimelineConfig,
} from "./index.js";

const config: TimelineConfig = {
  debugMode: true,
  cards: [
    { id: "ada", label: "Ada", family: "event", eventKind: "person" },
    { id: "tesla", label: "Tesla", family: "event", eventKind: "person" },
    { id: "paris", label: "Paris", family: "event", eventKind: "place" },
    { id: "kyoto", label: "Kyoto", family: "event", eventKind: "place" },
    {
      id: "chrono",
      label: "Chronometer",
      family: "event",
      eventKind: "thing",
    },
    { id: "radio", label: "Radio", family: "event", eventKind: "thing" },
    {
      id: "culture",
      label: "Culture +1",
      family: "society",
      societyKind: "culture",
      societyValue: 1,
    },
    {
      id: "get-parts",
      label: "Get Parts",
      family: "resource",
      resourceKind: "parts",
    },
  ],
  devices: [
    {
      id: "brancher",
      letter: "A",
      label: "Brancher",
      summary: "Fork",
      uses: 3,
      requirements: {
        parts: 2,
        minerals: 5,
        crystals: 1,
        culture: 4,
        science: 2,
        politics: 0,
      },
    },
    {
      id: "reverser",
      letter: "B",
      label: "Reverser",
      summary: "Back",
      uses: 3,
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
      summary: "Move",
      uses: 3,
      requirements: {
        parts: 3,
        minerals: 3,
        crystals: 1,
        culture: 2,
        science: 4,
        politics: 1,
      },
    },
    {
      id: "pruner",
      letter: "D",
      label: "Pruner",
      summary: "Cut",
      uses: 3,
      requirements: {
        parts: 3,
        minerals: 3,
        crystals: 1,
        culture: 3,
        science: 3,
        politics: 3,
      },
    },
    {
      id: "merger",
      letter: "E",
      label: "Merger",
      summary: "Join",
      uses: 3,
      requirements: {
        parts: 5,
        minerals: 1,
        crystals: 1,
        culture: 1,
        science: 1,
        politics: 5,
      },
    },
    {
      id: "rewriter",
      letter: "F",
      label: "Rewriter",
      summary: "Swap",
      uses: 3,
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
      summary: "Lock",
      uses: 3,
      requirements: {
        parts: 1,
        minerals: 1,
        crystals: 1,
        culture: 1,
        science: 1,
        politics: 1,
      },
    },
    {
      id: "jumper",
      letter: "H",
      label: "Jumper",
      summary: "Skip",
      uses: 3,
      requirements: {
        parts: 1,
        minerals: 1,
        crystals: 1,
        culture: 1,
        science: 1,
        politics: 1,
      },
    },
  ],
  objectives: [
    { id: "obj-1", personId: "ada", placeId: "paris", thingId: "chrono" },
  ],
  seedCardIds: ["ada", "paris", "chrono", "culture"],
  startingHand: ["tesla", "get-parts"],
  startingResources: { parts: 0, minerals: 0, crystals: 0 },
};

function nodeByCard(cardId: string, state = createInitialTimeline(config)) {
  return Object.values(state.nodes).find((n) => n.card?.cardId === cardId)!;
}

function apply(state: ReturnType<typeof createInitialTimeline>, action: Parameters<typeof applyTimelineAction>[2]) {
  return applyTimelineAction(state, config, action);
}

function brancherFrom(
  state: ReturnType<typeof createInitialTimeline>,
  fromNodeId: string,
  cardId = "tesla",
) {
  const card = state.hand.find((c) => c.cardId === cardId)!;
  return apply(state, {
    type: "deviceBrancher",
    fromNodeId,
    instanceId: card.instanceId,
  });
}

describe("timeline", () => {
  it("starts at epoch with a seeded prime branch and no crystals on prime", () => {
    const state = createInitialTimeline(config);
    expect(state.travelerNodeId).toBe(state.epochNodeId);
    expect(state.branches[state.primaryBranchId].crystals).toBe(0);
    expect(state.branches[state.primaryBranchId].index).toBe(1);
    expect(nodeByCard("ada", state)).toBeTruthy();
    expect(state.debugMode).toBe(true);
    expect(state.hand).toHaveLength(2);
  });

  it("steps forward along the seeded past", () => {
    const start = createInitialTimeline(config);
    const next = apply(start, { type: "stepForward" });
    expect(next.travelerNodeId).toBe(nodeByCard("ada", start).id);
  });

  it("plays a card at the head to append", () => {
    let state = createInitialTimeline(config);
    const tesla = state.hand.find((c) => c.cardId === "tesla")!;
    const head = state.branches[state.primaryBranchId].headNodeId;
    expect(isHead(state, head)).toBe(true);
    state = apply(state, {
      type: "playCard",
      instanceId: tesla.instanceId,
      atNodeId: head,
    });
    expect(state.nodes[state.travelerNodeId].card?.cardId).toBe("tesla");
    expect(state.branches[state.primaryBranchId].headNodeId).toBe(
      state.travelerNodeId,
    );
  });

  it("Brancher forks a new mat with a crystal and a card from hand", () => {
    const start = createInitialTimeline(config);
    const paris = nodeByCard("paris", start);
    const tesla = start.hand.find((c) => c.cardId === "tesla")!;
    const next = apply(start, {
      type: "deviceBrancher",
      fromNodeId: paris.id,
      instanceId: tesla.instanceId,
    });
    expect(Object.keys(next.branches).length).toBe(2);
    const fork = Object.values(next.branches).find((b) => b.index === 2)!;
    expect(fork.crystals).toBe(1);
    expect(next.player.crystals).toBe(1);
    expect(next.travelerNodeId).toBe(fork.rootNodeId);
    expect(next.nodes[fork.rootNodeId].card?.cardId).toBe("tesla");
    expect(next.hand.find((c) => c.instanceId === tesla.instanceId)).toBeUndefined();
    expect(next.nodes[paris.id].childIds.length).toBeGreaterThan(
      start.nodes[paris.id].childIds.length,
    );
  });

  it("Brancher without a valid card does not fork", () => {
    const start = createInitialTimeline(config);
    const next = apply(start, {
      type: "deviceBrancher",
      fromNodeId: start.epochNodeId,
      instanceId: "missing",
    });
    expect(Object.keys(next.branches).length).toBe(1);
    expect(next.log.at(-1)).toMatch(/action card/i);
  });

  it("works with zero resources in debug", () => {
    const start = createInitialTimeline(config);
    expect(start.player.parts).toBe(0);
    const tesla = start.hand.find((c) => c.cardId === "tesla")!;
    const next = apply(start, {
      type: "deviceBrancher",
      fromNodeId: start.epochNodeId,
      instanceId: tesla.instanceId,
    });
    expect(Object.keys(next.branches).length).toBe(2);
    expect(next.nodes[Object.values(next.branches).find((b) => b.index === 2)!.rootNodeId].card?.cardId).toBe("tesla");
  });

  it("Reverser jumps to an ancestor", () => {
    let state = createInitialTimeline(config);
    state = apply(state, { type: "stepForward" });
    state = apply(state, { type: "stepForward" });
    const next = apply(state, {
      type: "deviceReverser",
      toNodeId: state.epochNodeId,
    });
    expect(next.travelerNodeId).toBe(state.epochNodeId);
  });

  it("Relocator re-parents a fork and refuses a cycle", () => {
    const start = createInitialTimeline(config);
    const paris = nodeByCard("paris", start);
    const ada = nodeByCard("ada", start);
    let state = brancherFrom(start, paris.id);
    const fork = Object.values(state.branches).find((b) => b.index === 2)!;
    state = apply(state, {
      type: "deviceRelocator",
      branchId: fork.id,
      newParentNodeId: ada.id,
    });
    expect(state.nodes[fork.rootNodeId].parentIds).toEqual([ada.id]);
    expect(state.nodes[paris.id].childIds).not.toContain(fork.rootNodeId);

    const cycled = apply(state, {
      type: "deviceRelocator",
      branchId: fork.id,
      newParentNodeId: fork.rootNodeId,
    });
    expect(cycled.log.at(-1)).toMatch(/loop/i);
  });

  it("Pruner deletes a fork and returns its event cards", () => {
    const start = createInitialTimeline(config);
    const tesla = start.hand.find((c) => c.cardId === "tesla")!;
    const paris = nodeByCard("paris", start);
    let state = apply(start, {
      type: "playCard",
      instanceId: tesla.instanceId,
      atNodeId: paris.id,
    });
    const fork = Object.values(state.branches).find((b) => b.index === 2)!;
    expect(state.nodes[fork.rootNodeId].card?.cardId).toBe("tesla");
    const before = state.actionDeck.filter((id) => id === "tesla").length;
    state = apply(state, { type: "devicePruner", branchId: fork.id });
    expect(state.branches[fork.id]).toBeUndefined();
    expect(state.actionDeck.filter((id) => id === "tesla").length).toBe(
      before + 1,
    );
  });

  it("Merger ends one branch into another without a third timeline", () => {
    const start = createInitialTimeline(config);
    const paris = nodeByCard("paris", start);
    let state = brancherFrom(start, paris.id);
    const fork = Object.values(state.branches).find((b) => b.index === 2)!;
    const into = nodeByCard("chrono", state);
    const incomingHead = fork.headNodeId;
    state = apply(state, {
      type: "deviceMerger",
      fromBranchId: fork.id,
      intoNodeId: into.id,
    });
    expect(Object.keys(state.branches).length).toBe(2);
    expect(state.branches[fork.id].mergedIntoNodeId).toBe(into.id);
    expect(state.nodes[into.id].parentIds).toContain(incomingHead);
    expect(state.nodes[incomingHead].childIds).toContain(into.id);
    expect(state.travelerNodeId).toBe(into.id);
    expect(isHead(state, incomingHead)).toBe(false);
    expect(
      Object.values(state.branches).some((b) =>
        b.label.startsWith("Confluence"),
      ),
    ).toBe(false);
  });

  it("Rewriter swaps a played card back into the deck", () => {
    const start = createInitialTimeline(config);
    const ada = nodeByCard("ada", start);
    const before = start.actionDeck.filter((id) => id === "ada").length;
    const next = apply(start, {
      type: "deviceRewriter",
      nodeId: ada.id,
      replacementCardId: "tesla",
    });
    expect(next.nodes[ada.id].card?.cardId).toBe("tesla");
    expect(next.actionDeck.filter((id) => id === "ada").length).toBe(before + 1);
  });

  it("Preserver locks a branch", () => {
    const start = createInitialTimeline(config);
    const next = apply(start, {
      type: "devicePreserver",
      branchId: start.primaryBranchId,
    });
    expect(next.branches[start.primaryBranchId].preserved).toBe(true);
  });

  it("Jumper skips ahead up to 3 spaces", () => {
    const start = createInitialTimeline(config);
    const targets = jumperTargets(start, config);
    expect(targets.length).toBeGreaterThanOrEqual(3);
    const next = apply(start, {
      type: "deviceJumper",
      toNodeId: targets[1],
    });
    expect(next.travelerNodeId).toBe(targets[1]);
  });

  it("claims an objective that is present and completes it next turn", () => {
    const start = createInitialTimeline(config);
    expect(objectiveIsPresent(start, start.player.objectives[0])).toBe(true);
    let state = apply(start, { type: "claimObjective", objectiveId: "obj-1" });
    expect(state.player.pendingClaimIds).toContain("obj-1");
    state = apply(state, { type: "endTurn" });
    expect(state.player.objectives[0].complete).toBe(true);
    expect(state.player.completedCount).toBe(1);
  });
});
