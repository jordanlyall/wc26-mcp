import { handler, param, validateDate, matches, venues, resolveTeam, enrichMatch } from "./_helpers.js";

export default handler(async (req, res) => {
  const date = param(req, "date");
  const dateFrom = param(req, "date_from");
  const dateTo = param(req, "date_to");
  const team = param(req, "team");
  const group = param(req, "group");
  const venue = param(req, "venue");
  const round = param(req, "round");
  const status = param(req, "status");
  const timezone = param(req, "timezone");

  // Validate dates
  for (const [val, name] of [[date, "date"], [dateFrom, "date_from"], [dateTo, "date_to"]] as const) {
    const err = validateDate(val, name);
    if (err) return res.status(400).json({ error: err });
  }

  let result = matches;

  if (date) result = result.filter((m) => m.date === date);
  if (dateFrom) result = result.filter((m) => m.date >= dateFrom);
  if (dateTo) result = result.filter((m) => m.date <= dateTo);

  if (team) {
    const resolved = resolveTeam(team);
    if (!resolved) return res.status(404).json({ error: `Team '${team}' not found.`, suggestion: "Use GET /teams to see all available teams." });
    result = result.filter((m) => m.home_team_id === resolved.id || m.away_team_id === resolved.id);
  }

  if (group) {
    const groupLetter = group.toUpperCase();
    const validGroups = [...new Set(matches.map((m) => m.group).filter(Boolean))];
    if (!validGroups.includes(groupLetter)) {
      return res.status(404).json({ error: `Group '${group}' not found.`, valid_groups: validGroups.sort() });
    }
    result = result.filter((m) => m.group?.toUpperCase() === groupLetter);
  }

  if (venue) {
    if (!venues.some((v) => v.id === venue)) {
      return res.status(404).json({ error: `Venue '${venue}' not found.`, suggestion: "Use GET /venues to see all available venues." });
    }
    result = result.filter((m) => m.venue_id === venue);
  }

  if (round) result = result.filter((m) => m.round === round);
  if (status) result = result.filter((m) => m.status === status);

  res.json({ count: result.length, matches: result.map((m) => enrichMatch(m, timezone)) });
});
