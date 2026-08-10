export type RunStatus = "playing" | "won" | "lost";

export type RunState = {
  status: RunStatus;
  hp: number;
  maxHp: number;
  inventory: string[];
  attempts: number;
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
