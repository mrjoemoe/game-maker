import type { ItemDefinition, ProgramStep } from "@game-maker/engine";
import { ActionBank } from "./ActionBank";
import { ActionTrack } from "./ActionTrack";

type ActionsPanelProps = {
  programLength: number;
  steps: ProgramStep[];
  items: ItemDefinition[];
  inventory: string[];
  coins: number;
  executingIndex: number | null;
  disabled: boolean;
  onAppend: (step: ProgramStep) => void;
  onUndo: () => void;
  onClear: () => void;
  onExecute: () => void;
};

export function ActionsPanel({
  programLength,
  steps,
  items,
  inventory,
  coins,
  executingIndex,
  disabled,
  onAppend,
  onUndo,
  onClear,
  onExecute,
}: ActionsPanelProps) {
  return (
    <section className="actions-panel" aria-label="Actions">
      <ActionTrack
        programLength={programLength}
        steps={steps}
        items={items}
        executingIndex={executingIndex}
        disabled={disabled}
        onUndo={onUndo}
        onClear={onClear}
        onExecute={onExecute}
      />
      <ActionBank
        programLength={programLength}
        steps={steps}
        items={items}
        inventory={inventory}
        coins={coins}
        disabled={disabled}
        executing={executingIndex !== null}
        onAppend={onAppend}
      />
    </section>
  );
}
