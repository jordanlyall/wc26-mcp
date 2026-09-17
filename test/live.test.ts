import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getLiveResults,
  lookupResult,
  computeGroupTable,
  resolveTeamId,
  type LiveResult,
} from "../src/data/live.js";

// A synthetic result map: openfootball stored mex(home) 2–1 rsa(away).
function fakeLive(): Map<string, LiveResult> {
  const m = new Map<string, LiveResult>();
  m.set(["mex", "rsa"].sort().join("|"), {
    home_team_id: "mex",
    away_team_id: "rsa",
    home_score: 2,
    away_score: 1,
    status: "completed",
  });
  return m;
}

test("lookupResult returns scores in the queried match's orientation", () => {
  const live = fakeLive();

  // Same orientation as stored
  const a = lookupResult(live, "mex", "rsa");
  assert.deepEqual([a?.home_score, a?.away_score], [2, 1]);

  // Reversed orientation → scores must flip
  const b = lookupResult(live, "rsa", "mex");
  assert.deepEqual([b?.home_score, b?.away_score], [1, 2]);

  // Unknown pair → undefined
  assert.equal(lookupResult(live, "bra", "arg"), undefined);
  // Null team (knockout TBD) → undefined, no throw
  assert.equal(lookupResult(live, null, "mex"), undefined);
});

test("computeGroupTable awards points, GD, and orders correctly", () => {
  const live = fakeLive();
  const groupMatches = [{ home_team_id: "mex", away_team_id: "rsa" }];
  const table = computeGroupTable(["mex", "rsa", "kor", "cze"], groupMatches, live);

  assert.equal(table.length, 4);
  // Winner on top
  assert.equal(table[0].team_id, "mex");
  assert.equal(table[0].points, 3);
  assert.equal(table[0].goal_difference, 1);
  assert.equal(table[0].played, 1);
  // Loser
  const rsa = table.find((r) => r.team_id === "rsa")!;
  assert.equal(rsa.points, 0);
  assert.equal(rsa.goal_difference, -1);
  // Unplayed teams sit at zero
  const kor = table.find((r) => r.team_id === "kor")!;
  assert.equal(kor.played, 0);
  assert.equal(kor.points, 0);
});

test("resolveTeamId maps football-data.org tla codes + names, diacritics & aliases", () => {
  // football-data.org tla → wc26 id (tla is tried first by the FD adapter)
  assert.equal(resolveTeamId("MEX"), "mex");
  assert.equal(resolveTeamId("RSA"), "rsa");
  // Falls through tla → name when tla misses
  assert.equal(resolveTeamId(undefined, "South Korea"), "kor");
  // Diacritic-insensitive (Curaçao vs Curacao)
  assert.equal(resolveTeamId("Curaçao"), "cuw");
  // Alias (United States → usa)
  assert.equal(resolveTeamId("United States"), "usa");
  // Unknown → undefined
  assert.equal(resolveTeamId("Atlantis", undefined), undefined);
});

test("getLiveResults never throws and returns a Map (fail-safe network path)", async () => {
  const live = await getLiveResults();
  assert.ok(live instanceof Map);
  // Before kickoff openfootball has no scores → size 0; after, it grows.
  // Either way the call must resolve cleanly.
  assert.ok(live.size >= 0);
});
