import { handler, param, validateDate, matches, teams, groups, venues, fanZones, enrichMatch, teamName, venueName } from "./_helpers.js";

const TOURNAMENT_DATES = {
  playoff_end: "2026-03-31",
  tournament_start: "2026-06-11",
  group_stage_end: "2026-06-28",
  final: "2026-07-19",
};

type TournamentPhase = "pre_playoff" | "post_playoff" | "group_stage" | "knockout" | "tournament_over";

function getPhase(dateStr: string): TournamentPhase {
  if (dateStr < TOURNAMENT_DATES.playoff_end) return "pre_playoff";
  if (dateStr < TOURNAMENT_DATES.tournament_start) return "post_playoff";
  if (dateStr <= TOURNAMENT_DATES.group_stage_end) return "group_stage";
  if (dateStr <= TOURNAMENT_DATES.final) return "knockout";
  return "tournament_over";
}

function daysBetween(a: string, b: string): number {
  return Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

const PHASE_LABELS: Record<TournamentPhase, string> = {
  pre_playoff: "Pre-Tournament (Playoffs Pending)",
  post_playoff: "Pre-Tournament (All Teams Confirmed)",
  group_stage: "Group Stage",
  knockout: "Knockout Stage",
  tournament_over: "Tournament Complete",
};

export default handler(async (req, res) => {
  const dateParam = param(req, "date");
  const timezone = param(req, "timezone");

  const dateErr = validateDate(dateParam, "date");
  if (dateErr) return res.status(400).json({ error: dateErr });

  const today = dateParam ?? new Date().toISOString().slice(0, 10);
  const phase = getPhase(today);
  const daysUntilKickoff = daysBetween(today, TOURNAMENT_DATES.tournament_start);
  const sections: Record<string, unknown>[] = [];
  let headline = "";

  if (phase === "pre_playoff") {
    const tbdTeams = teams.filter((t) => t.code === "TBD");
    headline = `${daysUntilKickoff} days until the FIFA World Cup 2026 kicks off. ${tbdTeams.length} playoff spots still to be decided.`;

    sections.push({ title: "Countdown", content: `${daysUntilKickoff} days until the opening match: ${teamName(matches[0].home_team_id)} vs ${teamName(matches[0].away_team_id)} at ${venueName(matches[0].venue_id)} on ${TOURNAMENT_DATES.tournament_start}.` });
    sections.push({ title: "Pending Playoff Slots", content: `${tbdTeams.length} teams still to be determined:`, teams: tbdTeams.map((t) => ({ id: t.id, name: t.name, group: t.group })) });
    sections.push({ title: "Host Nations", content: teams.filter((t) => t.is_host).map((h) => `${h.flag_emoji} ${h.name} (Group ${h.group})`) });
    sections.push({ title: "Groups at a Glance", content: groups.map((g) => ({ group: g.id, teams: g.teams.map((tid) => { const t = teams.find((t) => t.id === tid); return t ? `${t.flag_emoji} ${t.name}` : tid; }) })) });
    sections.push({ title: "Venue Summary", content: `${venues.length} venues across 3 countries: ${venues.filter((v) => v.country === "USA").length} in USA, ${venues.filter((v) => v.country === "Mexico").length} in Mexico, ${venues.filter((v) => v.country === "Canada").length} in Canada.` });
    sections.push({ title: "Fan Zones", content: `${fanZones.length} official FIFA Fan Festival and fan zone locations across all host cities.` });
  } else if (phase === "post_playoff") {
    headline = `${daysUntilKickoff} days until the FIFA World Cup 2026 kicks off. All 48 teams are confirmed.`;
    sections.push({ title: "Countdown", content: `${daysUntilKickoff} days until the opening match at ${venueName(matches[0].venue_id)} on ${TOURNAMENT_DATES.tournament_start}.` });
    sections.push({ title: "All Groups", content: groups.map((g) => ({ group: g.id, teams: g.teams.map((tid) => { const t = teams.find((t) => t.id === tid); return t ? { name: `${t.flag_emoji} ${t.name}`, fifa_ranking: t.fifa_ranking } : { name: tid, fifa_ranking: null }; }) })) });
    sections.push({ title: "Fan Zones", content: `${fanZones.length} official FIFA Fan Festival and fan zone locations across all host cities.` });
  } else if (phase === "group_stage") {
    const todayMatches = matches.filter((m) => m.date === today);
    const totalGroupMatches = matches.filter((m) => m.round === "Group Stage").length;
    const playedGroupMatches = matches.filter((m) => m.round === "Group Stage" && m.date < today).length;
    headline = todayMatches.length > 0
      ? `${todayMatches.length} match${todayMatches.length !== 1 ? "es" : ""} today. Group stage: ${playedGroupMatches}/${totalGroupMatches} matches played.`
      : `No matches today. Group stage: ${playedGroupMatches}/${totalGroupMatches} matches played.`;
    if (todayMatches.length > 0) sections.push({ title: "Today's Matches", matches: todayMatches.map((m) => enrichMatch(m, timezone)) });
  } else if (phase === "knockout") {
    const todayMatches = matches.filter((m) => m.date === today);
    const knockoutMatches = matches.filter((m) => m.round !== "Group Stage" && m.date >= today);
    const currentRound = knockoutMatches.length > 0 ? knockoutMatches[0].round : "Final";
    headline = todayMatches.length > 0
      ? `${todayMatches.length} knockout match${todayMatches.length !== 1 ? "es" : ""} today. Current round: ${currentRound}.`
      : `No matches today. Current round: ${currentRound}.`;
    if (todayMatches.length > 0) sections.push({ title: "Today's Matches", matches: todayMatches.map((m) => enrichMatch(m, timezone)) });
  } else {
    headline = "The FIFA World Cup 2026 has concluded.";
    const finalMatch = matches.find((m) => m.round === "Final");
    if (finalMatch) sections.push({ title: "Final Result", match: enrichMatch(finalMatch, timezone) });
  }

  res.json({
    phase,
    phase_label: PHASE_LABELS[phase],
    as_of: today,
    ...(phase !== "tournament_over" ? { days_until_kickoff: Math.max(0, daysUntilKickoff) } : {}),
    headline,
    sections,
  });
});
