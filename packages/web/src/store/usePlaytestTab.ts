import { useCallback, useEffect, useState, type MouseEvent } from "react";
import {
  pathForTab,
  tabFromPath,
  type PlaytestTab,
} from "./playtestRoute";

export function usePlaytestTab(
  hasRulebook: boolean,
): [PlaytestTab, (tab: PlaytestTab) => void] {
  const [tab, setTab] = useState<PlaytestTab>(() =>
    tabFromPath(window.location.pathname, hasRulebook),
  );

  useEffect(() => {
    const canonical = pathForTab(
      tabFromPath(window.location.pathname, hasRulebook),
    );
    if (window.location.pathname !== canonical) {
      window.history.replaceState(null, "", canonical);
    }
    setTab(tabFromPath(canonical, hasRulebook));
    const onPop = () => {
      setTab(tabFromPath(window.location.pathname, hasRulebook));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [hasRulebook]);

  const go = useCallback((next: PlaytestTab) => {
    const path = pathForTab(next);
    if (window.location.pathname !== path) {
      window.history.pushState(null, "", path);
    }
    setTab(next);
  }, []);

  return [tab, go];
}

export function sameDocumentNav(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}
