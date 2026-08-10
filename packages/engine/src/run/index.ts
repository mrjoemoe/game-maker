export type RunStatus = "playing" | "won" | "lost";

export type RunState = {
  status: RunStatus;
  hp: number;
  maxHp: number;
  inventory: string[];
  attempts: number;
  /** Short reason the last step failed or ended the path, or null. */
  bump: string | null;
};

export type CreateRunStateOptions = {
  maxHp: number;
  inventory?: string[];
  attempts?: number;
};

export function createRunState(options: CreateRunStateOptions): RunState {
  const maxHp = options.maxHp;
  if (!Number.isFinite(maxHp) || maxHp < 1) {
    throw new Error(`maxHp must be a positive number, got ${maxHp}`);
  }
  return {
    status: "playing",
    hp: maxHp,
    maxHp,
    inventory: [...(options.inventory ?? [])],
    attempts: options.attempts ?? 1,
    bump: null,
  };
}

export function applyDamage(run: RunState, damage: number): RunState {
  const nextHp = Math.max(0, run.hp - Math.max(0, damage));
  return {
    ...run,
    hp: nextHp,
    status: nextHp <= 0 ? "lost" : run.status,
  };
}

export function collectItem(run: RunState, itemId: string): RunState {
  if (run.inventory.includes(itemId)) {
    return run;
  }
  return {
    ...run,
    inventory: [...run.inventory, itemId],
  };
}

export function markWon(run: RunState): RunState {
  if (run.status !== "playing") {
    return run;
  }
  return { ...run, status: "won" };
}

export function markLost(run: RunState, message: string): RunState {
  return {
    ...run,
    status: "lost",
    bump: message,
  };
}

export function clearBump(run: RunState): RunState {
  return run.bump === null ? run : { ...run, bump: null };
}

export function setBump(run: RunState, message: string): RunState {
  return { ...run, bump: message };
}

/** Meadow/forest (empty) and mage tiles are safe path tiles. */
export function isSafePathEffect(kind: string): boolean {
  return kind === "empty" || kind === "mage";
}

export function pathOverMessage(tileLabel: string): string {
  return `You found a ${tileLabel} — path over`;
}

export {
  programActionLabel,
  type ProgramAction,
  type ProgramStep,
} from "./program.js";
