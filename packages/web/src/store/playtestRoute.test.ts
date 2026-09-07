import assert from "node:assert/strict";
import { pathForTab, tabFromPath, normalizePath } from "./playtestRoute.ts";

assert.equal(normalizePath("/"), "/");
assert.equal(normalizePath("/play/"), "/play");
assert.equal(tabFromPath("/rulebook", true), "rulebook");
assert.equal(tabFromPath("/rulebook", false), "play");
assert.equal(tabFromPath("/", true), "play");
assert.equal(tabFromPath("/play", true), "play");
assert.equal(tabFromPath("/unknown", true), "play");
assert.equal(pathForTab("play"), "/play");
assert.equal(pathForTab("rulebook"), "/rulebook");
console.log("playtestRoute ok");
