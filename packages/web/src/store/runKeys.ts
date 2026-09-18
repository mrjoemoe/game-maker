import type { Direction } from "@game-maker/engine";

export type RunKeyCommand =
  | { kind: "move"; direction: Direction }
  | { kind: "clear" }
  | { kind: "debug" }
  | { kind: "run" };

const MOVE_KEYS: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

export function runKeyCommand(
  key: string,
  modifiers: { alt?: boolean; ctrl?: boolean; meta?: boolean },
): RunKeyCommand | null {
  if (modifiers.alt || modifiers.ctrl || modifiers.meta) {
    return null;
  }
  const direction = MOVE_KEYS[key];
  if (direction) {
    return { kind: "move", direction };
  }
  if (key === "Escape") return { kind: "clear" };
  if (key === "d" || key === "D") return { kind: "debug" };
  if (key === "Enter") return { kind: "run" };
  return null;
}
