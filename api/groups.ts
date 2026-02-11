import { handler, param, groups, enrichGroup } from "./_helpers.js";

export default handler(async (req, res) => {
  const group = param(req, "group");

  let result = groups;
  if (group) result = result.filter((g) => g.id.toUpperCase() === group.toUpperCase());

  res.json({ count: result.length, groups: result.map(enrichGroup) });
});
