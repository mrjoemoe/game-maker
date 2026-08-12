import type { CompatibilityRange, SemVer } from "./types.js";

const SEMVER_RE = /^(\d+)\.(\d+)\.(\d+)$/;

export function parseSemVer(version: SemVer | string): {
  major: number;
  minor: number;
  patch: number;
} {
  const match = SEMVER_RE.exec(version);
  if (!match) {
    throw new Error(`Invalid semver: ${version}`);
  }
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

export function majorOf(version: SemVer | string): number {
  return parseSemVer(version).major;
}

export function isExactPin(range: CompatibilityRange): boolean {
  return SEMVER_RE.test(range);
}

export function parseRange(range: CompatibilityRange): {
  kind: "caret" | "exact";
  major: number;
  exact?: SemVer;
} {
  if (range.startsWith("^")) {
    const major = Number(range.slice(1));
    if (!Number.isInteger(major) || major < 0) {
      throw new Error(`Invalid compatibility range: ${range}`);
    }
    return { kind: "caret", major };
  }
  if (!SEMVER_RE.test(range)) {
    throw new Error(`Invalid compatibility range: ${range}`);
  }
  return { kind: "exact", major: majorOf(range as SemVer), exact: range as SemVer };
}

export function satisfiesRange(
  version: SemVer,
  range: CompatibilityRange,
): boolean {
  const parsed = parseRange(range);
  const v = parseSemVer(version);
  if (parsed.kind === "exact") {
    return version === parsed.exact;
  }
  return v.major === parsed.major;
}

export function catalogKey(id: string, major: number): string {
  return `${id}@${major}`;
}

export function compareSemVer(a: SemVer, b: SemVer): number {
  const av = parseSemVer(a);
  const bv = parseSemVer(b);
  if (av.major !== bv.major) return av.major - bv.major;
  if (av.minor !== bv.minor) return av.minor - bv.minor;
  return av.patch - bv.patch;
}
