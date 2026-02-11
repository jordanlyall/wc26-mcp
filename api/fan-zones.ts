import { handler, param, venues, fanZones, venueName } from "./_helpers.js";

export default handler(async (req, res) => {
  const city = param(req, "city");
  const country = param(req, "country");
  const venueId = param(req, "venue_id");

  let results = fanZones;

  if (venueId) results = results.filter((fz) => fz.venue_id === venueId);
  if (country) results = results.filter((fz) => fz.country === country);

  if (city) {
    const q = city.toLowerCase();
    const cityMatches = results.filter((fz) => fz.city.toLowerCase().includes(q));
    if (cityMatches.length > 0) {
      const venueIds = new Set(cityMatches.map((fz) => fz.venue_id));
      results = results.filter((fz) => venueIds.has(fz.venue_id));
    } else {
      const matchingVenue = venues.find((v) => v.city.toLowerCase().includes(q) || v.name.toLowerCase().includes(q));
      results = matchingVenue ? results.filter((fz) => fz.venue_id === matchingVenue.id) : [];
    }
  }

  if (results.length === 0) {
    return res.status(404).json({ error: "No fan zones found matching your criteria.", available_countries: ["USA", "Mexico", "Canada"] });
  }

  res.json({
    count: results.length,
    fan_zones: results.map((fz) => ({
      id: fz.id, name: fz.name, city: fz.city, country: fz.country,
      location: fz.location, address: fz.address, coordinates: fz.coordinates,
      capacity: fz.capacity, free_entry: fz.free_entry, hours: fz.hours,
      activities: fz.activities, highlights: fz.highlights,
      transportation: fz.transportation, amenities: fz.amenities,
      family_friendly: fz.family_friendly, status: fz.status,
      match_venue: venueName(fz.venue_id),
    })),
  });
});
