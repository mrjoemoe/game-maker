import type { DeviceId } from "@game-maker/engine";

export type Targeting =
  | { kind: "idle" }
  | { kind: "play"; instanceId: string }
  | { kind: "brancher" }
  | { kind: "brancher-card"; fromNodeId: string }
  | { kind: "reverser" }
  | { kind: "relocator-branch" }
  | { kind: "relocator-parent"; branchId: string }
  | { kind: "pruner" }
  | { kind: "merger-first" }
  | { kind: "merger-second"; branchId: string }
  | { kind: "rewriter-node" }
  | { kind: "rewriter-card"; nodeId: string }
  | { kind: "preserver" }
  | { kind: "jumper" };

export type TargetingGuide = {
  deviceId: DeviceId | null;
  letter: string | null;
  title: string;
  step: string | null;
  how: string;
};

export function targetingGuide(targeting: Targeting): TargetingGuide | null {
  switch (targeting.kind) {
    case "idle":
      return null;
    case "play":
      return {
        deviceId: null,
        letter: null,
        title: "Playing a card",
        step: null,
        how: "Click a branch head to add it, or an earlier card to fork a new timeline from that moment.",
      };
    case "brancher":
      return {
        deviceId: "brancher",
        letter: "A",
        title: "Brancher",
        step: "Step 1 of 2",
        how: "Click the timeline card where the new branch should split off.",
      };
    case "brancher-card":
      return {
        deviceId: "brancher",
        letter: "A",
        title: "Brancher",
        step: "Step 2 of 2",
        how: "Click an action card in your hand to lay on the new branch.",
      };
    case "reverser":
      return {
        deviceId: "reverser",
        letter: "B",
        title: "Reverser",
        step: "Step 1 of 1",
        how: "Click a highlighted ancestor (toward Epoch) to jump into the past.",
      };
    case "relocator-branch":
      return {
        deviceId: "relocator",
        letter: "C",
        title: "Relocator",
        step: "Step 1 of 2",
        how: "Click any card on the branch you want to move. Prime cannot be relocated.",
      };
    case "relocator-parent":
      return {
        deviceId: "relocator",
        letter: "C",
        title: "Relocator",
        step: "Step 2 of 2",
        how: "Click the moment this branch should hang from (its new parent).",
      };
    case "pruner":
      return {
        deviceId: "pruner",
        letter: "D",
        title: "Pruner",
        step: "Step 1 of 1",
        how: "Click any card on the branch to cut. Prime cannot be pruned.",
      };
    case "merger-first":
      return {
        deviceId: "merger",
        letter: "E",
        title: "Merger",
        step: "Step 1 of 2",
        how: "Click a card on the timeline that ends. Its head is what joins away.",
      };
    case "merger-second":
      return {
        deviceId: "merger",
        letter: "E",
        title: "Merger",
        step: "Step 2 of 2",
        how: "Click a card on the timeline that continues. The join is head to head; that timeline can still grow.",
      };
    case "rewriter-node":
      return {
        deviceId: "rewriter",
        letter: "F",
        title: "Rewriter",
        step: "Step 1 of 2",
        how: "Click the timeline card to swap out.",
      };
    case "rewriter-card":
      return {
        deviceId: "rewriter",
        letter: "F",
        title: "Rewriter",
        step: "Step 2 of 2",
        how: "Click a card in your hand to swap onto that moment.",
      };
    case "preserver":
      return {
        deviceId: "preserver",
        letter: "G",
        title: "Preserver",
        step: "Step 1 of 1",
        how: "Click any card on the timeline to lock or unlock it.",
      };
    case "jumper":
      return {
        deviceId: "jumper",
        letter: "H",
        title: "Jumper",
        step: "Step 1 of 1",
        how: "Click a highlighted node up to 3 spaces ahead of you.",
      };
    default:
      return null;
  }
}

export function idleHint(): string {
  return "Click a node to move. Use the dock to fire a device.";
}
