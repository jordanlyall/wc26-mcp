import { handler, param, resolveTeam, visaInfo } from "./_helpers.js";

export default handler(async (req, res) => {
  const team = param(req, "team");
  const hostCountry = param(req, "host_country");

  if (!team) return res.status(400).json({ error: "team parameter is required." });

  const resolved = resolveTeam(team);
  if (!resolved) return res.status(404).json({ error: `Team '${team}' not found.`, suggestion: "Use GET /teams to see all available teams." });

  const info = visaInfo.find((v) => v.team_id === resolved.id);
  if (!info) return res.status(404).json({ error: `No visa data available for ${resolved.name}.` });

  const requirements = hostCountry
    ? info.entry_requirements.filter((r) => r.country === hostCountry)
    : info.entry_requirements;

  res.json({
    team: { id: resolved.id, name: resolved.name, flag_emoji: resolved.flag_emoji, group: resolved.group },
    nationality: info.nationality,
    passport_country: info.passport_country,
    entry_requirements: requirements,
  });
});
