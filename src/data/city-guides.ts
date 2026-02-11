import type { CityGuide } from "../types/index.js";

export const cityGuides: CityGuide[] = [
  // ── UNITED STATES (11 venues) ──────────────────────────────

  {
    venue_id: "metlife",
    metro_area: "New York City",
    highlights:
      "The world's most iconic city and host of the 2026 Final. MetLife Stadium sits across the Hudson in East Rutherford, NJ, with the Manhattan skyline as a backdrop. Expect an electric, globally diverse atmosphere.",
    getting_there:
      "Three major airports: JFK, Newark (EWR, closest to MetLife), and LaGuardia. NJ Transit trains run from Penn Station to Meadowlands station on match days. Shuttle buses connect the station to the stadium.",
    food_and_drink: [
      "Dollar-slice pizza at any corner shop in Manhattan — a NYC rite of passage",
      "Halal cart chicken and rice from 53rd & 6th or The Halal Guys",
      "Bagels from Russ & Daughters or Absolute Bagels",
      "Craft beer at any of dozens of breweries in Brooklyn or Jersey City",
    ],
    things_to_do: [
      "Walk the High Line, Central Park, or the Brooklyn Bridge",
      "Catch the Statue of Liberty & Ellis Island ferry from Battery Park",
      "Explore Times Square, the 9/11 Memorial, and the Empire State Building",
      "Watch street performers and artists in Washington Square Park",
    ],
    local_tips: [
      "Get a MetroCard or use OMNY tap-to-pay — NYC subway runs 24/7 and is the fastest way around",
      "MetLife has no roof — bring sunscreen for day games and a rain layer for evening",
      "Allow 90+ minutes to get from Manhattan to MetLife on match day — traffic and transit will be packed",
    ],
  },

  {
    venue_id: "sofi",
    metro_area: "Los Angeles",
    highlights:
      "LA is the entertainment capital of the world, hosting the USA's opening match. SoFi Stadium in Inglewood is a state-of-the-art indoor-outdoor venue right next to LAX. The city's diversity means world-class food from every continent.",
    getting_there:
      "LAX is minutes from SoFi Stadium. The new Inglewood Transit Connector and LA Metro K Line connect to the stadium area. Ride-share is common, but budget extra time — LA traffic is legendary.",
    food_and_drink: [
      "Tacos from a street stand in East LA or Grand Central Market",
      "Korean BBQ in Koreatown — all-you-can-eat spots line 6th and Western",
      "In-N-Out Burger — the iconic California fast-food experience",
      "Birria tacos from Teddy's Red Tacos or Birrieria Gonzalez",
    ],
    things_to_do: [
      "Walk the Venice Beach boardwalk and Santa Monica Pier",
      "Hike to the Hollywood Sign via Griffith Observatory for city-wide views",
      "Visit the Getty Center for world-class art with free admission",
      "Explore the vibrant murals and galleries in the Arts District",
    ],
    local_tips: [
      "Rent a car or plan ride-shares — LA is sprawling and public transit has gaps",
      "SoFi's translucent roof means it's not fully enclosed — dress for warm weather",
      "Arrive early to explore the Hollywood Park entertainment district around the stadium",
    ],
  },

  {
    venue_id: "att",
    metro_area: "Dallas-Fort Worth",
    highlights:
      "The DFW metroplex is Texas-sized in every way, and AT&T Stadium in Arlington hosts the most matches of any venue (9 total), including a semi-final. The retractable-roof stadium is climate-controlled, a blessing in Texas summer heat.",
    getting_there:
      "DFW International Airport is the main hub, ~20 minutes from Arlington. Dallas Love Field (DAL) is a Southwest Airlines hub. Arlington lacks rail service — ride-share or rental car is essential to reach the stadium.",
    food_and_drink: [
      "Texas BBQ brisket from Pecan Lodge, Cattleack, or Terry Black's",
      "Tex-Mex at Mi Cocina or Joe T. Garcia's in Fort Worth",
      "Chicken-fried steak — a Texas staple found at most local diners",
      "Craft beer from Deep Ellum Brewing or Community Beer Co.",
    ],
    things_to_do: [
      "Visit the Sixth Floor Museum at Dealey Plaza (JFK assassination history)",
      "Explore the Fort Worth Stockyards for a taste of cowboy culture",
      "Walk through the Dallas Arts District — largest urban arts district in the US",
      "Catch live music in Deep Ellum, Dallas's entertainment neighborhood",
    ],
    local_tips: [
      "Summer temps regularly exceed 95°F (35°C) — stay hydrated and seek shade outdoors",
      "AT&T Stadium has a retractable roof and AC, so it's comfortable inside regardless of weather",
      "Arlington sits between Dallas and Fort Worth with no rail — plan for car/ride-share logistics",
    ],
  },

  {
    venue_id: "hard_rock",
    metro_area: "Miami",
    highlights:
      "Miami is a tropical, bilingual gateway city hosting the third-place playoff. Hard Rock Stadium in Miami Gardens is an open-air venue with a partial canopy. The city's Latin American influence means a passionate soccer atmosphere.",
    getting_there:
      "Miami International Airport (MIA) is 30 minutes from the stadium. Fort Lauderdale-Hollywood (FLL) is another option. Tri-Rail connects the airports to nearby stations; ride-share or shuttle to the stadium from there.",
    food_and_drink: [
      "Cuban sandwich and cafecito from Versailles in Little Havana",
      "Fresh ceviche at a Peruvian or Colombian spot in Doral or Brickell",
      "Stone crab claws at Joe's Stone Crab (seasonal) on South Beach",
      "Empanadas from any of the dozens of Latin bakeries across the city",
    ],
    things_to_do: [
      "Stroll South Beach and the Art Deco Historic District on Ocean Drive",
      "Visit the Wynwood Walls — a world-famous open-air street art museum",
      "Take a day trip to the Everglades for airboat rides and wildlife",
      "Explore Little Havana's Calle Ocho for live music, dominos, and culture",
    ],
    local_tips: [
      "Expect 90°F+ heat with high humidity and daily afternoon thunderstorms in summer — carry an umbrella",
      "Hard Rock Stadium is open-air — sunscreen and water are musts for day games",
      "Miami traffic is brutal — use ride-share pooling or arrive very early on match day",
    ],
  },

  {
    venue_id: "mercedes_benz",
    metro_area: "Atlanta",
    highlights:
      "Atlanta is the cultural and economic hub of the American South, hosting a semi-final at Mercedes-Benz Stadium. The stadium's retractable roof and iconic pinwheel design make it one of the world's most impressive venues. Atlanta's diverse food scene is a highlight.",
    getting_there:
      "Hartsfield-Jackson Atlanta International Airport (ATL) is the world's busiest and has a direct MARTA rail connection to downtown. Take MARTA to the Vine City or GWCC/CNN Center station — the stadium is a short walk.",
    food_and_drink: [
      "Southern fried chicken and waffles at Mary Mac's Tea Room or Busy Bee Cafe",
      "Peach cobbler — a Georgia staple available at most soul food restaurants",
      "The Buford Highway Corridor for incredible Korean, Vietnamese, and Mexican food",
      "Craft cocktails in the Beltline-adjacent neighborhoods of Inman Park or Old Fourth Ward",
    ],
    things_to_do: [
      "Walk or bike the Atlanta BeltLine — a 22-mile urban trail with art installations",
      "Visit the National Center for Civil and Human Rights and the MLK Jr. National Historic Site",
      "Explore the Georgia Aquarium, one of the largest in the world",
      "Check out Ponce City Market for local food, shopping, and rooftop amusements",
    ],
    local_tips: [
      "MARTA rail is the best way to get to the stadium — driving and parking will be a nightmare",
      "Mercedes-Benz Stadium has a retractable roof, so weather won't be an issue inside",
      "Atlanta summers are hot and humid (90°F+) — stay hydrated if exploring the city on foot",
    ],
  },

  {
    venue_id: "gillette",
    metro_area: "Boston",
    highlights:
      "Boston is one of America's oldest and most walkable cities. Gillette Stadium sits in Foxborough, about 30 miles southwest of downtown. The region is steeped in American history, world-class universities, and passionate sports fans.",
    getting_there:
      "Boston Logan International Airport (BOS) serves the region. Gillette Stadium is in Foxborough — commuter rail runs on match days from Boston's South Station. Expect shuttle buses from the Foxborough station to the stadium.",
    food_and_drink: [
      "New England clam chowder at Legal Sea Foods or the Union Oyster House (America's oldest restaurant)",
      "Lobster roll — available everywhere from food trucks to fine dining along the waterfront",
      "Cannoli from Mike's Pastry or Modern Pastry in the North End (Little Italy)",
      "Craft beer from Trillium Brewing or Tree House Brewing — world-class NE IPAs",
    ],
    things_to_do: [
      "Walk the Freedom Trail — a 2.5-mile route through 16 historic sites",
      "Explore Harvard and MIT campuses in Cambridge, just across the Charles River",
      "Visit Fenway Park, America's oldest baseball stadium",
      "Stroll through the Boston Common and Public Garden",
    ],
    local_tips: [
      "Foxborough is 30+ miles from downtown Boston — don't underestimate the commute on match days",
      "Gillette is open-air — New England weather can shift quickly, bring layers for evening games",
      "The 'T' (subway) is useful in Boston proper but doesn't go to Foxborough — plan commuter rail or drive",
    ],
  },

  {
    venue_id: "nrg",
    metro_area: "Houston",
    highlights:
      "Houston is America's most ethnically diverse city, a sprawling metropolis known for NASA, energy, and incredible food from every corner of the globe. NRG Stadium has a retractable roof — essential in Houston's brutal summer heat.",
    getting_there:
      "George Bush Intercontinental Airport (IAH) is the main hub; William P. Hobby (HOU) is closer to NRG Stadium. METRORail's Purple Line stops near NRG Park. Ride-share and driving are common — Houston is very car-dependent.",
    food_and_drink: [
      "Vietnamese pho and banh mi along Bellaire Blvd in Chinatown/Asiatown",
      "Texas BBQ — Killen's, Truth BBQ, or The Pit Room for brisket and ribs",
      "Breakfast tacos — a Houston morning staple from spots like Laredo Taqueria",
      "Nigerian, Ethiopian, and Indian food along Hillcroft Ave (the 'Mahatma Gandhi District')",
    ],
    things_to_do: [
      "Visit Space Center Houston — NASA's official visitor center with real spacecraft",
      "Explore the Museum District — 19 museums, many with free admission",
      "Walk through Hermann Park and the Houston Zoo",
      "Browse the eclectic shops and murals of the Heights neighborhood",
    ],
    local_tips: [
      "Houston is extremely hot and humid in summer (95°F+) — NRG's retractable roof provides relief inside",
      "The city is very spread out — a car or ride-share is practically essential",
      "Drink plenty of water and take heat seriously; heat index can exceed 110°F",
    ],
  },

  {
    venue_id: "arrowhead",
    metro_area: "Kansas City",
    highlights:
      "Kansas City straddles the Missouri-Kansas border and is legendary for BBQ, jazz, and passionate sports fans. Arrowhead Stadium (GEHA Field) is one of the NFL's loudest venues. The city punches well above its weight in food and culture.",
    getting_there:
      "Kansas City International Airport (MCI) is 25 minutes from downtown. No rail to the stadium — ride-share, taxi, or drive. The stadium is in the Truman Sports Complex in eastern KC with large parking lots.",
    food_and_drink: [
      "KC-style BBQ — slow-smoked burnt ends at Joe's Kansas City, Q39, or Gates BBQ",
      "A classic KC strip steak at one of the many steakhouses downtown",
      "Boulevard Brewing beer — KC's flagship craft brewery with a taproom tour",
      "Fried chicken from Stroud's — a Kansas City institution since 1933",
    ],
    things_to_do: [
      "Visit the National WWI Museum and Memorial — the only US museum dedicated to WWI",
      "Explore the 18th & Vine Jazz District, birthplace of Kansas City jazz",
      "Walk through the Country Club Plaza — America's first shopping district, built in 1922",
      "Catch the fountains — KC has more fountains than any city outside Rome",
    ],
    local_tips: [
      "Arrowhead is open-air — expect heat (90°F+) and possible thunderstorms in summer",
      "Tailgating is a big tradition at Arrowhead — the lots open hours before kickoff",
      "The stadium area is car-dependent — plan parking or ride-share in advance",
    ],
  },

  {
    venue_id: "lincoln",
    metro_area: "Philadelphia",
    highlights:
      "Philadelphia is the birthplace of American democracy and one of the Northeast's most vibrant cities. Lincoln Financial Field sits in the South Philly sports complex. Philly's food scene — from cheesesteaks to fine dining — is among the best in the US.",
    getting_there:
      "Philadelphia International Airport (PHL) is 15 minutes from the stadium. SEPTA's Broad Street Line subway runs directly to the sports complex (NRG station). Amtrak and regional rail connect Philly to NYC and DC.",
    food_and_drink: [
      "Cheesesteak from Pat's King of Steaks, Geno's, or Jim's on South Street",
      "Roast pork sandwich from DiNic's at Reading Terminal Market — arguably better than cheesesteaks",
      "Soft pretzels from a street vendor — a Philly staple, best with mustard",
      "Italian Market on 9th Street for fresh produce, pasta, and cannoli",
    ],
    things_to_do: [
      "Visit Independence Hall and the Liberty Bell — birthplace of the Declaration of Independence",
      "Explore the Philadelphia Museum of Art and run the Rocky Steps",
      "Walk through Reading Terminal Market, one of America's oldest and largest public markets",
      "Stroll down South Street or through the murals of the Mural Arts Program",
    ],
    local_tips: [
      "SEPTA subway goes directly to the stadium — it's by far the easiest option on match day",
      "Lincoln Financial Field is open-air — Philly summers are warm and humid (upper 80s°F)",
      "Philadelphia is very walkable downtown — you can cover most historic sites on foot",
    ],
  },

  {
    venue_id: "levis",
    metro_area: "San Francisco Bay Area",
    highlights:
      "The Bay Area offers world-class tech, culture, and natural beauty. Levi's Stadium in Santa Clara is in the heart of Silicon Valley, about 45 minutes south of San Francisco. Summer weather is warm and dry — ideal for outdoor matches.",
    getting_there:
      "San Jose International Airport (SJC) is closest to the stadium (~10 min). San Francisco International (SFO) is 30 minutes away. Caltrain and VTA light rail connect to the stadium area. BART serves the broader Bay Area.",
    food_and_drink: [
      "Mission-style burritos from La Taqueria or El Farolito in SF's Mission District",
      "Sourdough bread and clam chowder in a bread bowl at Fisherman's Wharf",
      "Dim sum in SF's Chinatown — the oldest in North America",
      "Farm-to-table dining — the Bay Area pioneered the movement; Chez Panisse in Berkeley is legendary",
    ],
    things_to_do: [
      "Walk or bike across the Golden Gate Bridge for stunning bay views",
      "Ride a cable car through San Francisco's hilly streets",
      "Visit Alcatraz Island — book ferry tickets well in advance",
      "Explore Muir Woods for towering redwoods just north of the city",
    ],
    local_tips: [
      "Santa Clara (stadium) is much warmer than San Francisco — bring layers if heading to SF, where fog rolls in",
      "Levi's Stadium is fully open-air — sunscreen is essential for daytime matches",
      "Bay Area traffic is heavy — use Caltrain or VTA to avoid match-day congestion",
    ],
  },

  {
    venue_id: "lumen",
    metro_area: "Seattle",
    highlights:
      "Seattle is the Pacific Northwest's cultural hub, known for coffee, tech, and stunning mountain-and-water scenery. Lumen Field sits downtown on the waterfront with views of Puget Sound. Seattle's mild summer weather makes it one of the most comfortable venues.",
    getting_there:
      "Seattle-Tacoma International Airport (SEA) is 30 minutes south. Link Light Rail runs directly from the airport to downtown near the stadium. Lumen Field is walking distance from Pioneer Square and the International District.",
    food_and_drink: [
      "Fresh seafood at Pike Place Market — salmon, Dungeness crab, and oysters",
      "Coffee from the original Starbucks at Pike Place, or any of Seattle's specialty roasters",
      "Teriyaki — Seattle's unique fast-casual teriyaki joints are a local staple",
      "Pho and banh mi in the International District, just steps from the stadium",
    ],
    things_to_do: [
      "Explore Pike Place Market — watch the fish throwers and browse artisan stalls",
      "Visit the Space Needle and Chihuly Garden and Glass for iconic views",
      "Take a ferry across Puget Sound to Bainbridge Island for a scenic half-day trip",
      "Walk through the Museum of Pop Culture (MoPOP) for music and sci-fi exhibits",
    ],
    local_tips: [
      "Seattle summers are mild (low 70s°F) with long daylight — it stays light past 9pm in June",
      "Despite the reputation, summer rain is rare — but bring a light layer for cooler evenings",
      "Link Light Rail from the airport to downtown is cheap, fast, and drops you near the stadium",
    ],
  },

  // ── MEXICO (3 venues) ──────────────────────────────────────

  {
    venue_id: "azteca",
    metro_area: "Mexico City",
    highlights:
      "Mexico City is a massive, vibrant metropolis hosting the tournament's opening match at the legendary Estadio Azteca — the only stadium to host three World Cup opening ceremonies (1970, 1986, 2026). At 7,350 feet elevation, the thin air affects stamina and ball flight.",
    getting_there:
      "Mexico City International Airport (MEX) is centrally located. The Metro is extensive, cheap, and efficient — Line 2 reaches the Azteca area (Tasqueña station, then bus/taxi). Ride-share apps Uber and DiDi work well throughout the city.",
    food_and_drink: [
      "Tacos al pastor from a street stand — arguably the world's greatest street food",
      "Mole at a traditional restaurant in Coyoacán or the Centro Histórico",
      "Churros and hot chocolate from El Moro, a classic since 1935",
      "Mezcal at one of the craft mezcalerías in Roma Norte or Condesa",
    ],
    things_to_do: [
      "Visit the Museo Nacional de Antropología — one of the world's great museums",
      "Explore the ancient pyramids of Teotihuacán, 30 miles northeast of the city",
      "Stroll through Chapultepec Park and Castle — larger than Central Park",
      "Wander the colorful streets of Coyoacán and visit the Frida Kahlo Museum",
    ],
    local_tips: [
      "The altitude (7,350 ft) can cause fatigue and headaches — take it easy the first day and stay hydrated",
      "Tap water is not safe to drink — buy bottled water or use a purification bottle",
      "Mexico City is enormous — use the Metro and ride-share rather than trying to walk between neighborhoods",
    ],
  },

  {
    venue_id: "akron",
    metro_area: "Guadalajara",
    highlights:
      "Guadalajara is Mexico's second-largest city and the birthplace of mariachi and tequila. Estadio Akron (Chivas stadium) is a modern venue on the city's outskirts. The city combines colonial architecture with a thriving arts and food scene.",
    getting_there:
      "Guadalajara International Airport (GDL) is 30 minutes from the stadium. Uber and DiDi are reliable. The city has a two-line light rail system, but the stadium is best reached by car or ride-share from the city center.",
    food_and_drink: [
      "Birria — Guadalajara's signature slow-cooked goat or beef stew, served with consommé",
      "Torta ahogada — a pork sandwich drowned in spicy tomato sauce, a Guadalajara original",
      "Tequila tasting — Jalisco is tequila country; visit a distillery or sample at local bars",
      "Tejuino — a refreshing fermented corn drink with lime and salt, sold by street vendors",
    ],
    things_to_do: [
      "Explore the historic Centro with its cathedral, Hospicio Cabañas (UNESCO site), and plazas",
      "Day trip to the town of Tequila — ride the Tequila Express train through agave fields",
      "Visit Tlaquepaque for artisan crafts, galleries, and mariachi music in the plazas",
      "Catch a Chivas match atmosphere at the bars and restaurants near Estadio Akron",
    ],
    local_tips: [
      "Guadalajara's rainy season peaks in June-July — expect warm days with afternoon thundershowers",
      "The city sits at 5,100 ft elevation — milder than the coast but bring sun protection",
      "Spanish is essential outside tourist areas — download an offline translation app",
    ],
  },

  {
    venue_id: "bbva",
    metro_area: "Monterrey",
    highlights:
      "Monterrey is Mexico's industrial and business capital, set dramatically against the Sierra Madre mountains. Estadio BBVA in Guadalupe is one of North America's most modern football-specific stadiums. The city is known for its grilled meat culture and mountain scenery.",
    getting_there:
      "Monterrey International Airport (MTY) is 30 minutes from the stadium. Uber and DiDi are the easiest transit options. The city has a Metro system with two lines, but the stadium is best reached by car or ride-share.",
    food_and_drink: [
      "Cabrito (roasted kid goat) — Monterrey's signature dish, slow-roasted over mesquite",
      "Carne asada — Monterrey takes grilled beef seriously; try it at any local restaurant",
      "Machaca — dried shredded beef with eggs, a traditional Norteño breakfast",
      "Craft beer from the Barrio Antiguo brewery scene — Monterrey has a growing craft beer culture",
    ],
    things_to_do: [
      "Hike or take the cable car to the top of Cerro de la Silla for panoramic mountain views",
      "Visit the MARCO museum (Museo de Arte Contemporáneo) in the Macroplaza",
      "Explore the Barrio Antiguo — cobblestone streets with bars, restaurants, and nightlife",
      "Take a day trip to Grutas de García — dramatic caves and formations in the Sierra Madre",
    ],
    local_tips: [
      "Monterrey summer heat is extreme (95°F+) — schedule outdoor activities for early morning or evening",
      "The city is very spread out and car-dependent — ride-share apps are your best bet",
      "Tap water is not safe to drink — stick to bottled or purified water",
    ],
  },

  // ── CANADA (2 venues) ──────────────────────────────────────

  {
    venue_id: "bmo",
    metro_area: "Toronto",
    highlights:
      "Toronto is Canada's largest city and one of the world's most multicultural. BMO Field sits on the lakefront at Exhibition Place. The city's neighborhoods — from Kensington Market to Little Italy to Chinatown — offer an incredible range of food and culture.",
    getting_there:
      "Toronto Pearson International Airport (YYZ) is the main hub, connected by UP Express train to downtown Union Station (25 min). Billy Bishop Airport (YTZ) is on the waterfront near BMO Field. TTC streetcars and buses serve Exhibition Place directly.",
    food_and_drink: [
      "Peameal bacon sandwich at Carousel Bakery in St. Lawrence Market — a Toronto original",
      "Poutine — fries, gravy, and cheese curds; try it at Smoke's Poutinerie or any diner",
      "Dim sum in Chinatown or Markham — Toronto's Chinese food rivals any city outside Asia",
      "Patties from a Jamaican bakery on Eglinton West — Toronto's Caribbean community is huge",
    ],
    things_to_do: [
      "Visit the CN Tower for panoramic views and the glass-floor EdgeWalk experience",
      "Explore the diverse neighborhoods: Kensington Market, Queen West, Distillery District",
      "Walk the Toronto Islands — a car-free park with beaches and skyline views, reached by ferry",
      "Browse the Royal Ontario Museum or the Art Gallery of Ontario",
    ],
    local_tips: [
      "BMO Field is compact (45,000 expanded capacity) and open-air — arrive early for best experience",
      "Toronto summers are warm and pleasant (high 70s-80s°F) — enjoy the long lakefront evenings",
      "The TTC (subway, streetcar, bus) covers the city well — a day pass is good value for visitors",
    ],
  },

  {
    venue_id: "bc_place",
    metro_area: "Vancouver",
    highlights:
      "Vancouver is consistently ranked among the world's most livable cities, nestled between mountains and the Pacific Ocean. BC Place's retractable roof ensures matches happen rain or shine. The city's natural beauty and Asian food scene are world-class.",
    getting_there:
      "Vancouver International Airport (YVR) connects to downtown via the Canada Line SkyTrain (25 min). BC Place is in the heart of downtown, steps from Stadium-Chinatown SkyTrain station. Walking and transit are easy for the entire downtown core.",
    food_and_drink: [
      "Sushi and ramen — Vancouver's Japanese food scene rivals cities outside Japan",
      "Dim sum in Richmond — a quick SkyTrain ride to some of the best Chinese food in North America",
      "Salmon — wild BC salmon is legendary; try it smoked, grilled, or as sashimi",
      "Japadog — a Vancouver original: Japanese-style hot dogs from the famous food cart",
    ],
    things_to_do: [
      "Walk or bike the Stanley Park Seawall — a 5.5-mile loop with mountain and ocean views",
      "Visit Granville Island for its public market, artisan shops, and waterfront dining",
      "Take the Sea to Sky Gondola to Squamish or drive to Whistler for stunning mountain scenery",
      "Explore Gastown's cobblestone streets and the famous steam clock",
    ],
    local_tips: [
      "Vancouver summers are mild and dry (low 70s°F) — one of the most comfortable venues in the tournament",
      "BC Place has a retractable roof, so weather is never an issue for matches",
      "The SkyTrain is fast, clean, and goes directly to the stadium — skip the car entirely",
    ],
  },
];
