import type { TimelineCardDefinition } from "@game-maker/engine";

export function cardFaceClass(
  def: TimelineCardDefinition | undefined,
  isEpoch = false,
): string {
  if (isEpoch) return "epoch";
  if (!def) return "rift";
  if (def.family === "event") return def.eventKind ?? "event";
  if (def.family === "society") return def.societyKind ?? "society";
  if (def.family === "resource") return def.resourceKind ?? "resource";
  if (def.family === "invention") return def.inventionKind ?? "invention";
  return def.family;
}

export function cardTypeLabel(
  def: TimelineCardDefinition | undefined,
  isEpoch = false,
): string {
  if (isEpoch) return "Epoch";
  if (!def) return "Rift";
  if (def.eventKind) return def.eventKind;
  if (def.societyKind) return def.societyKind;
  if (def.resourceKind) return def.resourceKind;
  if (def.inventionKind) return def.inventionKind;
  if (def.family === "random-draw") return "random";
  if (def.family === "random-event") return def.randomKind ?? "random";
  if (def.family === "blueprint") return "blueprint";
  return def.family;
}
