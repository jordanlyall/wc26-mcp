import { handler, param, teams } from "./_helpers.js";

export default handler(async (req, res) => {
  const group = param(req, "group");
  const confederation = param(req, "confederation");
  const isHost = param(req, "is_host");

  let result = teams;

  if (group) result = result.filter((t) => t.group.toUpperCase() === group.toUpperCase());
  if (confederation) result = result.filter((t) => t.confederation === confederation);
  if (isHost !== undefined) result = result.filter((t) => t.is_host === (isHost === "true"));

  res.json({ count: result.length, teams: result });
});
