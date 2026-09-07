export type PlaytestTab = "play" | "rulebook";

export function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

export function tabFromPath(
  pathname: string,
  hasRulebook: boolean,
): PlaytestTab {
  if (hasRulebook && normalizePath(pathname) === "/rulebook") {
    return "rulebook";
  }
  return "play";
}

export function pathForTab(tab: PlaytestTab): string {
  return tab === "rulebook" ? "/rulebook" : "/play";
}
