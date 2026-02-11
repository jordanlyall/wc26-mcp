import { handler, param, venues, haversineDistance } from "./_helpers.js";

export default handler(async (req, res) => {
  const venueId = param(req, "venue");
  const limitParam = param(req, "limit");

  if (!venueId) return res.status(400).json({ error: "venue parameter is required." });

  const origin = venues.find((v) => v.id === venueId.toLowerCase());
  if (!origin) return res.status(404).json({ error: `Venue '${venueId}' not found.`, suggestion: "Use GET /venues to see all available venues." });

  const nearby = venues
    .filter((v) => v.id !== origin.id)
    .map((v) => {
      const dist = haversineDistance(origin.coordinates.lat, origin.coordinates.lng, v.coordinates.lat, v.coordinates.lng);
      return { id: v.id, name: v.name, city: v.city, country: v.country, distance_miles: dist.miles, distance_km: dist.km };
    })
    .sort((a, b) => a.distance_miles - b.distance_miles);

  const limited = limitParam ? nearby.slice(0, parseInt(limitParam, 10)) : nearby;

  res.json({
    origin: { id: origin.id, name: origin.name, city: origin.city, country: origin.country },
    nearby_venues: limited,
  });
});
