import { handler, param, venues, haversineDistance } from "./_helpers.js";

export default handler(async (req, res) => {
  // nearby-venues logic (merged to stay within Vercel Hobby function limit)
  const nearbyId = param(req, "venue");
  if (nearbyId) {
    const origin = venues.find((v) => v.id === nearbyId.toLowerCase());
    if (!origin) return res.status(404).json({ error: `Venue '${nearbyId}' not found.` });
    const limitParam = param(req, "limit");
    const nearby = venues
      .filter((v) => v.id !== origin.id)
      .map((v) => {
        const dist = haversineDistance(origin.coordinates.lat, origin.coordinates.lng, v.coordinates.lat, v.coordinates.lng);
        return { id: v.id, name: v.name, city: v.city, country: v.country, distance_miles: dist.miles, distance_km: dist.km };
      })
      .sort((a, b) => a.distance_miles - b.distance_miles);
    const limited = limitParam ? nearby.slice(0, parseInt(limitParam, 10)) : nearby;
    return res.json({ origin: { id: origin.id, name: origin.name, city: origin.city, country: origin.country }, nearby_venues: limited });
  }

  const country = param(req, "country");
  const city = param(req, "city");
  const region = param(req, "region");

  let result = venues;
  if (country) result = result.filter((v) => v.country === country);
  if (city) result = result.filter((v) => v.city.toLowerCase().includes(city.toLowerCase()));
  if (region) result = result.filter((v) => v.region === region);

  res.json({ count: result.length, venues: result });
});
