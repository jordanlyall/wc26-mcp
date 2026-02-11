import { handler, param, resolveTeam, matches, teams, teamProfiles, historicalMatchups, venueName } from "./_helpers.js";

export default handler(async (req, res) => {
  const teamAParam = param(req, "team_a");
  const teamBParam = param(req, "team_b");

  if (!teamAParam || !teamBParam) {
    return res.status(400).json({ error: "Both team_a and team_b parameters are required." });
  }

  const teamA = resolveTeam(teamAParam);
  const teamB = resolveTeam(teamBParam);

  if (!teamA) return res.status(404).json({ error: `Team '${teamAParam}' not found.` });
  if (!teamB) return res.status(404).json({ error: `Team '${teamBParam}' not found.` });
  if (teamA.id === teamB.id) return res.status(400).json({ error: "Both inputs resolve to the same team." });

  if (teamA.code === "TBD") return res.json({ note: `${teamA.name} has not been determined yet.`, team_b: { id: teamB.id, name: teamB.name, flag_emoji: teamB.flag_emoji } });
  if (teamB.code === "TBD") return res.json({ note: `${teamB.name} has not been determined yet.`, team_a: { id: teamA.id, name: teamA.name, flag_emoji: teamA.flag_emoji } });

  const [first, second] = [teamA, teamB].sort((a, b) => a.id.localeCompare(b.id));
  const record = historicalMatchups.find((h) => h.team_a === first.id && h.team_b === second.id);

  const upcoming2026 = matches.find(
    (m) => (m.home_team_id === teamA.id && m.away_team_id === teamB.id) || (m.home_team_id === teamB.id && m.away_team_id === teamA.id)
  );
  const matchContext = upcoming2026
    ? { upcoming_2026_match: { date: upcoming2026.date, time_utc: upcoming2026.time_utc, round: upcoming2026.round, venue: venueName(upcoming2026.venue_id), group: upcoming2026.group ?? undefined } }
    : {};

  if (!record) {
    const profileA = teamProfiles.find((p) => p.team_id === first.id);
    const profileB = teamProfiles.find((p) => p.team_id === second.id);
    const firstTimerNote = (id: string, profile?: typeof profileA) => {
      if (profile && profile.world_cup_history.appearances <= 1) {
        const t = teams.find((t) => t.id === id);
        return `${t?.name ?? id} is making their World Cup debut in 2026.`;
      }
      return null;
    };

    return res.json({
      team_a: { id: first.id, name: first.name, flag_emoji: first.flag_emoji },
      team_b: { id: second.id, name: second.name, flag_emoji: second.flag_emoji },
      total_matches: 0,
      summary: `${first.name} and ${second.name} have never met at a FIFA World Cup.`,
      first_timer_notes: [firstTimerNote(first.id, profileA), firstTimerNote(second.id, profileB)].filter(Boolean),
      ...matchContext,
    });
  }

  res.json({
    team_a: { id: first.id, name: first.name, flag_emoji: first.flag_emoji },
    team_b: { id: second.id, name: second.name, flag_emoji: second.flag_emoji },
    total_matches: record.total_matches,
    team_a_wins: record.team_a_wins,
    draws: record.draws,
    team_b_wins: record.team_b_wins,
    total_goals_team_a: record.total_goals_team_a,
    total_goals_team_b: record.total_goals_team_b,
    summary: record.summary,
    meetings: record.meetings,
    ...matchContext,
  });
});
