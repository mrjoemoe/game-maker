import { defineComponent } from "../../authoring.js";

export const rulesProgrammedRun = defineComponent({
  manifest: {
    id: "rules/programmed-run",
    kind: "rule",
    schemaVersion: 1,
    contractVersion: "1.0.0",
    owner: "platform",
    docs: {
      summary: "Programmed path run-mode configuration.",
      playerFacing:
        "Chart up to ten actions (moves included), then run. Soft reset keeps the map.",
    },
  },
  contribute: ({ params }) => {
    const start = (params.startPosition as { x: number; y: number }) ?? {
      x: 3,
      y: 6,
    };
    return {
      features: { runMode: true, tileFlip: false },
      run: {
        heroPieceId: (params.heroPieceId as string) ?? "hero",
        startPosition: { ...start },
        maxHp: (params.maxHp as number) ?? 100,
        baseAttack: (params.baseAttack as number) ?? 1,
        programLength: (params.programLength as number) ?? 10,
      },
      pieceTypes: [
        {
          id: "hero",
          label: (params.heroLabel as string) ?? "Hero",
          color: (params.heroColor as string) ?? "#c47a2c",
          icon: (params.heroIcon as string) ?? "H",
        },
      ],
      initialPieces: [
        {
          id: "hero",
          typeId: "hero",
          position: { ...start },
        },
      ],
    };
  },
});
