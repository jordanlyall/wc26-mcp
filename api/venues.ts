import { handler, param, venues } from "./_helpers.js";

export default handler(async (req, res) => {
  const country = param(req, "country");
  const city = param(req, "city");
  const region = param(req, "region");

  let result = venues;

  if (country) result = result.filter((v) => v.country === country);
  if (city) result = result.filter((v) => v.city.toLowerCase().includes(city.toLowerCase()));
  if (region) result = result.filter((v) => v.region === region);

  res.json({ count: result.length, venues: result });
});
