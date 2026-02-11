import { handler, param, teams, groups, enrichGroup } from "./_helpers.js";

export default handler(async (req, res) => {
  // Also handles /api/groups via rewrite with ?_endpoint=groups
  const endpoint = param(req, "_endpoint");

  if (endpoint === "groups") {
    const group = param(req, "group");
    let result = groups;
    if (group) result = result.filter((g) => g.id.toUpperCase() === group.toUpperCase());
    return res.json({ count: result.length, groups: result.map(enrichGroup) });
  }

  const group = param(req, "group");
  const confederation = param(req, "confederation");
  const isHost = param(req, "is_host");

  let result = teams;

  if (group) result = result.filter((t) => t.group.toUpperCase() === group.toUpperCase());
  if (confederation) result = result.filter((t) => t.confederation === confederation);
  if (isHost !== undefined) result = result.filter((t) => t.is_host === (isHost === "true"));

  res.json({ count: result.length, teams: result });
});
