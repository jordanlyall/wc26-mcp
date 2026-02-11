import { handler, param, resolveTeam, teamProfiles } from "./_helpers.js";

export default handler(async (req, res) => {
  const team = param(req, "team");
  if (!team) return res.status(400).json({ error: "team parameter is required." });

  const resolved = resolveTeam(team);
  if (!resolved) return res.status(404).json({ error: `Team '${team}' not found.`, suggestion: "Use GET /teams to see all available teams." });

  const profile = teamProfiles.find((p) => p.team_id === resolved.id);

  res.json({
    ...resolved,
    ...(profile
      ? {
          coach: profile.coach,
          playing_style: profile.playing_style,
          key_players: profile.key_players,
          world_cup_history: profile.world_cup_history,
          qualifying_summary: profile.qualifying_summary,
        }
      : {
          coach: "Unknown",
          playing_style: "No profile data available.",
          key_players: [],
          world_cup_history: null,
          qualifying_summary: "No qualifying data available.",
        }),
  });
});
