import { handler, param, validateDate, matches, enrichMatch } from "./_helpers.js";

export default handler(async (req, res) => {
  const dateFrom = param(req, "date_from");
  const dateTo = param(req, "date_to");
  const timezone = param(req, "timezone");

  for (const [val, name] of [[dateFrom, "date_from"], [dateTo, "date_to"]] as const) {
    const err = validateDate(val, name);
    if (err) return res.status(400).json({ error: err });
  }

  let filtered = matches;
  if (dateFrom) filtered = filtered.filter((m) => m.date >= dateFrom);
  if (dateTo) filtered = filtered.filter((m) => m.date <= dateTo);

  const byDate = new Map<string, typeof filtered>();
  for (const m of filtered) {
    const existing = byDate.get(m.date) ?? [];
    existing.push(m);
    byDate.set(m.date, existing);
  }

  const schedule = Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, dayMatches]) => ({
      date,
      match_count: dayMatches.length,
      matches: dayMatches.sort((a, b) => a.time_utc.localeCompare(b.time_utc)).map((m) => enrichMatch(m, timezone)),
    }));

  res.json({ total_days: schedule.length, total_matches: filtered.length, schedule });
});
