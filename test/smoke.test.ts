/**
 * Smoke tests for WC26 MCP data integrity.
 * Run with: npx tsx --test test/smoke.test.ts
 */
import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { matches } from "../src/data/matches.js";
import { teams } from "../src/data/teams.js";
import { groups } from "../src/data/groups.js";
import { venues } from "../src/data/venues.js";
import { teamProfiles } from "../src/data/team-profiles.js";
import { cityGuides } from "../src/data/city-guides.js";
import { historicalMatchups } from "../src/data/historical-matchups.js";
import { visaInfo } from "../src/data/visa-info.js";
import { fanZones } from "../src/data/fan-zones.js";

// ── Data counts ──────────────────────────────────────────────────────

describe("data counts", () => {
  it("has 104 matches", () => {
    assert.equal(matches.length, 104);
  });

  it("has 48 teams", () => {
    assert.equal(teams.length, 48);
  });

  it("has 12 groups", () => {
    assert.equal(groups.length, 12);
  });

  it("has 16 venues", () => {
    assert.equal(venues.length, 16);
  });

  it("has 48 team profiles", () => {
    assert.equal(teamProfiles.length, 48);
  });

  it("has 16 city guides", () => {
    assert.equal(cityGuides.length, 16);
  });

  it("has 42 visa entries", () => {
    assert.equal(visaInfo.length, 42);
  });

  it("has 18 fan zones", () => {
    assert.equal(fanZones.length, 18);
  });
});

// ── Referential integrity ────────────────────────────────────────────

describe("referential integrity", () => {
  const teamIds = new Set(teams.map((t) => t.id));
  const venueIds = new Set(venues.map((v) => v.id));

  it("every match references a valid venue", () => {
    for (const m of matches) {
      assert.ok(venueIds.has(m.venue_id), `Match ${m.match_number}: invalid venue_id "${m.venue_id}"`);
    }
  });

  it("every match references valid teams (or TBD/knockout placeholder)", () => {
    for (const m of matches) {
      const home = m.home_team;
      const away = m.away_team;
      if (home && !home.startsWith("Winner") && !home.startsWith("Loser") && !home.startsWith("Runner") && !home.startsWith("1") && !home.startsWith("2")) {
        assert.ok(teamIds.has(home), `Match ${m.match_number}: invalid home_team "${home}"`);
      }
      if (away && !away.startsWith("Winner") && !away.startsWith("Loser") && !away.startsWith("Runner") && !away.startsWith("1") && !away.startsWith("2")) {
        assert.ok(teamIds.has(away), `Match ${m.match_number}: invalid away_team "${away}"`);
      }
    }
  });

  it("every team profile references a valid team", () => {
    for (const p of teamProfiles) {
      assert.ok(teamIds.has(p.team_id), `Profile for "${p.team_id}" has no matching team`);
    }
  });

  it("every city guide references a valid venue", () => {
    for (const c of cityGuides) {
      assert.ok(venueIds.has(c.venue_id), `City guide for "${c.venue_id}" has no matching venue`);
    }
  });

  it("every visa entry references a valid team", () => {
    for (const v of visaInfo) {
      assert.ok(teamIds.has(v.team_id), `Visa entry for "${v.team_id}" has no matching team`);
    }
  });

  it("every fan zone references a valid venue", () => {
    for (const fz of fanZones) {
      assert.ok(venueIds.has(fz.venue_id), `Fan zone "${fz.id}" has invalid venue_id "${fz.venue_id}"`);
    }
  });

  it("every group contains valid team IDs", () => {
    for (const g of groups) {
      for (const tid of g.teams) {
        assert.ok(teamIds.has(tid), `Group ${g.group}: invalid team "${tid}"`);
      }
    }
  });
});

// ── Data quality ─────────────────────────────────────────────────────

describe("data quality", () => {
  it("no duplicate team IDs", () => {
    const ids = teams.map((t) => t.id);
    assert.equal(ids.length, new Set(ids).size, "Duplicate team IDs found");
  });

  it("no duplicate venue IDs", () => {
    const ids = venues.map((v) => v.id);
    assert.equal(ids.length, new Set(ids).size, "Duplicate venue IDs found");
  });

  it("no duplicate match numbers", () => {
    const nums = matches.map((m) => m.match_number);
    assert.equal(nums.length, new Set(nums).size, "Duplicate match numbers found");
  });

  it("every team profile has a coach", () => {
    for (const p of teamProfiles) {
      if (p.team_id.startsWith("tbd")) continue;
      assert.ok(p.coach && p.coach.length > 0, `${p.team_id} has no coach`);
    }
  });

  it("every confirmed team profile has key players", () => {
    for (const p of teamProfiles) {
      if (p.team_id.startsWith("tbd")) continue;
      assert.ok(p.key_players.length >= 3, `${p.team_id} has fewer than 3 key players`);
    }
  });

  it("every venue has valid coordinates", () => {
    for (const v of venues) {
      assert.ok(v.coordinates.lat >= -90 && v.coordinates.lat <= 90, `${v.id}: invalid latitude`);
      assert.ok(v.coordinates.lng >= -180 && v.coordinates.lng <= 180, `${v.id}: invalid longitude`);
    }
  });

  it("every visa entry covers all 3 host countries", () => {
    for (const v of visaInfo) {
      const countries = v.entry_requirements.map((r) => r.country);
      assert.ok(countries.includes("USA"), `${v.team_id}: missing USA visa info`);
      assert.ok(countries.includes("Mexico"), `${v.team_id}: missing Mexico visa info`);
      assert.ok(countries.includes("Canada"), `${v.team_id}: missing Canada visa info`);
    }
  });

  it("no duplicate fan zone IDs", () => {
    const ids = fanZones.map((fz) => fz.id);
    assert.equal(ids.length, new Set(ids).size, "Duplicate fan zone IDs found");
  });

  it("every fan zone has valid coordinates", () => {
    for (const fz of fanZones) {
      assert.ok(fz.coordinates.lat >= -90 && fz.coordinates.lat <= 90, `${fz.id}: invalid latitude`);
      assert.ok(fz.coordinates.lng >= -180 && fz.coordinates.lng <= 180, `${fz.id}: invalid longitude`);
    }
  });

  it("all matches are in June or July 2026", () => {
    for (const m of matches) {
      const d = new Date(m.date);
      assert.equal(d.getFullYear(), 2026, `Match ${m.match_number}: wrong year`);
      assert.ok(d.getMonth() === 5 || d.getMonth() === 6, `Match ${m.match_number}: not in June/July`);
    }
  });
});
