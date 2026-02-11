import { handler, param, venues, cityGuides } from "./_helpers.js";
import type { Venue } from "./_helpers.js";

export default handler(async (req, res) => {
  const city = param(req, "city");
  if (!city) return res.status(400).json({ error: "city parameter is required." });

  const query = city.toLowerCase();
  let venue: Venue | undefined;
  let guide: typeof cityGuides[number] | undefined;

  // Try venue ID
  venue = venues.find((v) => v.id === query);
  if (venue) guide = cityGuides.find((g) => g.venue_id === venue!.id);

  // Try city name
  if (!venue) {
    venue = venues.find((v) => v.city.toLowerCase() === query);
    if (venue) guide = cityGuides.find((g) => g.venue_id === venue!.id);
  }

  // Try metro area
  if (!guide) {
    guide = cityGuides.find((g) => g.metro_area.toLowerCase() === query);
    if (guide) venue = venues.find((v) => v.id === guide!.venue_id);
  }

  // Try partial metro area
  if (!guide) {
    guide = cityGuides.find((g) => g.metro_area.toLowerCase().includes(query));
    if (guide) venue = venues.find((v) => v.id === guide!.venue_id);
  }

  // Try partial city name
  if (!guide && !venue) {
    venue = venues.find((v) => v.city.toLowerCase().includes(query));
    if (venue) guide = cityGuides.find((g) => g.venue_id === venue!.id);
  }

  if (!venue || !guide) {
    return res.status(404).json({ error: `City '${city}' not found.`, suggestion: "Use GET /venues to see all host cities." });
  }

  res.json({
    venue: {
      id: venue.id, name: venue.name, city: venue.city, state_province: venue.state_province,
      country: venue.country, capacity: venue.capacity, timezone: venue.timezone, weather: venue.weather,
    },
    metro_area: guide.metro_area,
    highlights: guide.highlights,
    getting_there: guide.getting_there,
    food_and_drink: guide.food_and_drink,
    things_to_do: guide.things_to_do,
    local_tips: guide.local_tips,
  });
});
