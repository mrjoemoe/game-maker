import type { CSSProperties } from "react";
import type { Direction } from "@game-maker/engine";

type HeroTokenProps = {
  color: string;
  label: string;
  selected?: boolean;
  facing?: Direction;
};

export function HeroToken({
  color,
  label,
  selected = false,
  facing = "down",
}: HeroTokenProps) {
  return (
    <span
      className={`hero-token facing-${facing}${selected ? " is-selected" : ""}`}
      style={{ "--hero-color": color } as CSSProperties}
      title={label}
      aria-hidden="true"
    >
      <span className="hero-token-shadow" />
      <span className="hero-token-body" />
      <span className="hero-token-head" />
    </span>
  );
}

type PawnTokenProps = {
  color: string;
  label: string;
  selected?: boolean;
};

export function PawnToken({ color, label, selected = false }: PawnTokenProps) {
  return (
    <span
      className={`pawn-token${selected ? " is-selected" : ""}`}
      style={{ background: color }}
      title={label}
    >
      {label}
    </span>
  );
}
