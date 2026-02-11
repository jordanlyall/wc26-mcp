import type { HistoricalMatchup } from "../types/index.js";

export const historicalMatchups: HistoricalMatchup[] = [
  // ── Tier 1: Group stage matchups with World Cup history ──────────

  // Group C: Brazil vs Scotland
  {
    team_a: "bra",
    team_b: "sco",
    total_matches: 3,
    team_a_wins: 2,
    draws: 1,
    team_b_wins: 0,
    total_goals_team_a: 6,
    total_goals_team_b: 2,
    summary:
      "Brazil have dominated the World Cup rivalry with Scotland, winning two and drawing one of three meetings. The 1998 opener in Paris is the most famous encounter.",
    meetings: [
      { year: 1974, host_country: "West Germany", round: "Group Stage", score: "0-0", result: "draw", venue_city: "Frankfurt" },
      { year: 1982, host_country: "Spain", round: "Group Stage", score: "4-1", result: "team_a", venue_city: "Seville" },
      { year: 1998, host_country: "France", round: "Group Stage", score: "2-1", result: "team_a", venue_city: "Saint-Denis" },
    ],
  },

  // Group C: Brazil vs Morocco
  {
    team_a: "bra",
    team_b: "mar",
    total_matches: 1,
    team_a_wins: 1,
    draws: 0,
    team_b_wins: 0,
    total_goals_team_a: 3,
    total_goals_team_b: 0,
    summary:
      "Brazil's lone World Cup meeting with Morocco was a comfortable 3-0 group stage win at France 1998.",
    meetings: [
      { year: 1998, host_country: "France", round: "Group Stage", score: "3-0", result: "team_a", venue_city: "Nantes" },
    ],
  },

  // Group L: Croatia vs England
  {
    team_a: "cro",
    team_b: "eng",
    total_matches: 1,
    team_a_wins: 1,
    draws: 0,
    team_b_wins: 0,
    total_goals_team_a: 2,
    total_goals_team_b: 1,
    summary:
      "Croatia stunned England in the 2018 semi-final, coming from behind to win 2-1 in extra time and reach their first-ever World Cup final.",
    meetings: [
      { year: 2018, host_country: "Russia", round: "Semi-final", score: "2-1", result: "team_a", venue_city: "Moscow" },
    ],
  },

  // Group E: Ecuador vs Germany
  {
    team_a: "ecu",
    team_b: "ger",
    total_matches: 1,
    team_a_wins: 0,
    draws: 0,
    team_b_wins: 1,
    total_goals_team_a: 0,
    total_goals_team_b: 3,
    summary:
      "Germany comfortably beat Ecuador 3-0 in the 2006 group stage on home soil — the only World Cup meeting between these sides.",
    meetings: [
      { year: 2006, host_country: "Germany", round: "Group Stage", score: "0-3", result: "team_b", venue_city: "Berlin" },
    ],
  },

  // Group L: England vs Panama
  {
    team_a: "eng",
    team_b: "pan",
    total_matches: 1,
    team_a_wins: 1,
    draws: 0,
    team_b_wins: 0,
    total_goals_team_a: 6,
    total_goals_team_b: 1,
    summary:
      "England routed Panama 6-1 in Panama's World Cup debut, with Harry Kane scoring a hat trick in the 2018 group stage.",
    meetings: [
      { year: 2018, host_country: "Russia", round: "Group Stage", score: "6-1", result: "team_a", venue_city: "Nizhny Novgorod" },
    ],
  },

  // Group H: Spain vs Saudi Arabia
  {
    team_a: "esp",
    team_b: "ksa",
    total_matches: 1,
    team_a_wins: 1,
    draws: 0,
    team_b_wins: 0,
    total_goals_team_a: 1,
    total_goals_team_b: 0,
    summary:
      "Spain edged Saudi Arabia 1-0 in their only World Cup meeting during the 2006 group stage in Germany.",
    meetings: [
      { year: 2006, host_country: "Germany", round: "Group Stage", score: "1-0", result: "team_a", venue_city: "Kaiserslautern" },
    ],
  },

  // Group H: Spain vs Uruguay
  {
    team_a: "esp",
    team_b: "uru",
    total_matches: 1,
    team_a_wins: 0,
    draws: 1,
    team_b_wins: 0,
    total_goals_team_a: 2,
    total_goals_team_b: 2,
    summary:
      "Spain and Uruguay's only World Cup meeting was a 2-2 draw in the 1950 final round in Brazil.",
    meetings: [
      { year: 1950, host_country: "Brazil", round: "Final Round", score: "2-2", result: "draw", venue_city: "São Paulo" },
    ],
  },

  // Group I: France vs Senegal
  {
    team_a: "fra",
    team_b: "sen",
    total_matches: 1,
    team_a_wins: 0,
    draws: 0,
    team_b_wins: 1,
    total_goals_team_a: 0,
    total_goals_team_b: 1,
    summary:
      "Senegal shocked defending champions France 1-0 in the 2002 opening match — one of the greatest World Cup upsets.",
    meetings: [
      { year: 2002, host_country: "South Korea / Japan", round: "Group Stage", score: "0-1", result: "team_b", venue_city: "Seoul" },
    ],
  },

  // Group F: Japan vs Netherlands
  {
    team_a: "jpn",
    team_b: "ned",
    total_matches: 1,
    team_a_wins: 0,
    draws: 0,
    team_b_wins: 1,
    total_goals_team_a: 0,
    total_goals_team_b: 1,
    summary:
      "The Netherlands edged Japan 1-0 in their only World Cup meeting during the 2010 group stage in South Africa.",
    meetings: [
      { year: 2010, host_country: "South Africa", round: "Group Stage", score: "0-1", result: "team_b", venue_city: "Durban" },
    ],
  },

  // Group A: South Korea vs Mexico
  {
    team_a: "kor",
    team_b: "mex",
    total_matches: 2,
    team_a_wins: 0,
    draws: 0,
    team_b_wins: 2,
    total_goals_team_a: 2,
    total_goals_team_b: 5,
    summary:
      "Mexico have won both World Cup meetings with South Korea — 3-1 in 1998 and 2-1 in 2018.",
    meetings: [
      { year: 1998, host_country: "France", round: "Group Stage", score: "1-3", result: "team_b", venue_city: "Lyon" },
      { year: 2018, host_country: "Russia", round: "Group Stage", score: "1-2", result: "team_b", venue_city: "Rostov-on-Don" },
    ],
  },

  // Group A: Mexico vs South Africa
  {
    team_a: "mex",
    team_b: "rsa",
    total_matches: 1,
    team_a_wins: 0,
    draws: 1,
    team_b_wins: 0,
    total_goals_team_a: 1,
    total_goals_team_b: 1,
    summary:
      "Mexico and South Africa drew 1-1 in the opening match of the 2010 World Cup at Soccer City in Johannesburg.",
    meetings: [
      { year: 2010, host_country: "South Africa", round: "Group Stage", score: "1-1", result: "draw", venue_city: "Johannesburg" },
    ],
  },

  // ── Tier 2: Major historical rivalries ───────────────────────────

  // Argentina vs Brazil
  {
    team_a: "arg",
    team_b: "bra",
    total_matches: 4,
    team_a_wins: 1,
    draws: 1,
    team_b_wins: 2,
    total_goals_team_a: 3,
    total_goals_team_b: 5,
    summary:
      "The South American superclásico at World Cups: Brazil lead 2-1 with one draw. Argentina's lone win was a tense 1-0 in the 1990 Round of 16.",
    meetings: [
      { year: 1974, host_country: "West Germany", round: "Second Round", score: "1-2", result: "team_b", venue_city: "Hannover" },
      { year: 1978, host_country: "Argentina", round: "Second Round", score: "0-0", result: "draw", venue_city: "Rosario" },
      { year: 1982, host_country: "Spain", round: "Second Round", score: "1-3", result: "team_b", venue_city: "Barcelona" },
      { year: 1990, host_country: "Italy", round: "Round of 16", score: "1-0", result: "team_a", venue_city: "Turin" },
    ],
  },

  // Argentina vs England
  {
    team_a: "arg",
    team_b: "eng",
    total_matches: 4,
    team_a_wins: 2,
    draws: 0,
    team_b_wins: 2,
    total_goals_team_a: 4,
    total_goals_team_b: 4,
    summary:
      "One of football's fiercest World Cup rivalries, perfectly split at 2-2. Features Maradona's Hand of God (1986) and Beckham's red card (1998).",
    meetings: [
      { year: 1966, host_country: "England", round: "Quarter-final", score: "0-1", result: "team_b", venue_city: "London" },
      { year: 1986, host_country: "Mexico", round: "Quarter-final", score: "2-1", result: "team_a", venue_city: "Mexico City" },
      { year: 1998, host_country: "France", round: "Round of 16", score: "2-2", penalty_score: "4-3", result: "team_a", venue_city: "Saint-Étienne" },
      { year: 2002, host_country: "South Korea / Japan", round: "Group Stage", score: "0-1", result: "team_b", venue_city: "Sapporo" },
    ],
  },

  // Argentina vs France
  {
    team_a: "arg",
    team_b: "fra",
    total_matches: 4,
    team_a_wins: 3,
    draws: 0,
    team_b_wins: 1,
    total_goals_team_a: 9,
    total_goals_team_b: 8,
    summary:
      "A modern-day World Cup epic. Argentina lead 3-1 overall, crowned by the legendary 2022 final — a 3-3 draw with Argentina winning on penalties after Mbappé's hat trick.",
    meetings: [
      { year: 1930, host_country: "Uruguay", round: "Group Stage", score: "1-0", result: "team_a", venue_city: "Montevideo" },
      { year: 1978, host_country: "Argentina", round: "Group Stage", score: "2-1", result: "team_a", venue_city: "Buenos Aires" },
      { year: 2018, host_country: "Russia", round: "Round of 16", score: "3-4", result: "team_b", venue_city: "Kazan" },
      { year: 2022, host_country: "Qatar", round: "Final", score: "3-3", penalty_score: "4-2", result: "team_a", venue_city: "Lusail" },
    ],
  },

  // Argentina vs Germany
  {
    team_a: "arg",
    team_b: "ger",
    total_matches: 5,
    team_a_wins: 1,
    draws: 0,
    team_b_wins: 4,
    total_goals_team_a: 4,
    total_goals_team_b: 8,
    summary:
      "A defining World Cup rivalry with three finals (1986, 1990, 2014). Germany lead 4-1 overall, but Argentina's 1986 triumph in Mexico City remains iconic.",
    meetings: [
      { year: 1986, host_country: "Mexico", round: "Final", score: "3-2", result: "team_a", venue_city: "Mexico City" },
      { year: 1990, host_country: "Italy", round: "Final", score: "0-1", result: "team_b", venue_city: "Rome" },
      { year: 2006, host_country: "Germany", round: "Quarter-final", score: "1-1", penalty_score: "2-4", result: "team_b", venue_city: "Berlin" },
      { year: 2010, host_country: "South Africa", round: "Quarter-final", score: "0-4", result: "team_b", venue_city: "Cape Town" },
      { year: 2014, host_country: "Brazil", round: "Final", score: "0-1", result: "team_b", venue_city: "Rio de Janeiro" },
    ],
  },

  // Argentina vs Netherlands
  {
    team_a: "arg",
    team_b: "ned",
    total_matches: 5,
    team_a_wins: 3,
    draws: 0,
    team_b_wins: 2,
    total_goals_team_a: 6,
    total_goals_team_b: 9,
    summary:
      "A dramatic World Cup rivalry featuring the 1978 final and three penalty shootouts. Argentina lead 3-2 despite being outscored overall.",
    meetings: [
      { year: 1974, host_country: "West Germany", round: "Second Round", score: "0-4", result: "team_b", venue_city: "Gelsenkirchen" },
      { year: 1978, host_country: "Argentina", round: "Final", score: "3-1", result: "team_a", venue_city: "Buenos Aires" },
      { year: 1998, host_country: "France", round: "Quarter-final", score: "1-2", result: "team_b", venue_city: "Marseille" },
      { year: 2014, host_country: "Brazil", round: "Semi-final", score: "0-0", penalty_score: "4-2", result: "team_a", venue_city: "São Paulo" },
      { year: 2022, host_country: "Qatar", round: "Quarter-final", score: "2-2", penalty_score: "4-3", result: "team_a", venue_city: "Lusail" },
    ],
  },

  // Argentina vs Uruguay
  {
    team_a: "arg",
    team_b: "uru",
    total_matches: 1,
    team_a_wins: 0,
    draws: 0,
    team_b_wins: 1,
    total_goals_team_a: 2,
    total_goals_team_b: 4,
    summary:
      "The Río de la Plata derby has only met once at a World Cup — the very first final in 1930, when Uruguay beat Argentina 4-2 in Montevideo.",
    meetings: [
      { year: 1930, host_country: "Uruguay", round: "Final", score: "2-4", result: "team_b", venue_city: "Montevideo" },
    ],
  },

  // Brazil vs Colombia
  {
    team_a: "bra",
    team_b: "col",
    total_matches: 1,
    team_a_wins: 1,
    draws: 0,
    team_b_wins: 0,
    total_goals_team_a: 2,
    total_goals_team_b: 1,
    summary:
      "Brazil beat Colombia 2-1 in a physical 2014 quarter-final in Fortaleza, a match overshadowed by Neymar's tournament-ending back injury.",
    meetings: [
      { year: 2014, host_country: "Brazil", round: "Quarter-final", score: "2-1", result: "team_a", venue_city: "Fortaleza" },
    ],
  },

  // Brazil vs France
  {
    team_a: "bra",
    team_b: "fra",
    total_matches: 4,
    team_a_wins: 1,
    draws: 0,
    team_b_wins: 3,
    total_goals_team_a: 6,
    total_goals_team_b: 6,
    summary:
      "France lead 3-1 in World Cup meetings despite equal total goals. Highlights include Pelé's hat trick in the 1958 semi-final and France's dominant 3-0 win in the 1998 final.",
    meetings: [
      { year: 1958, host_country: "Sweden", round: "Semi-final", score: "5-2", result: "team_a", venue_city: "Stockholm" },
      { year: 1986, host_country: "Mexico", round: "Quarter-final", score: "1-1", penalty_score: "3-4", result: "team_b", venue_city: "Guadalajara" },
      { year: 1998, host_country: "France", round: "Final", score: "0-3", result: "team_b", venue_city: "Saint-Denis" },
      { year: 2006, host_country: "Germany", round: "Quarter-final", score: "0-1", result: "team_b", venue_city: "Frankfurt" },
    ],
  },

  // Brazil vs Germany
  {
    team_a: "bra",
    team_b: "ger",
    total_matches: 2,
    team_a_wins: 1,
    draws: 0,
    team_b_wins: 1,
    total_goals_team_a: 3,
    total_goals_team_b: 7,
    summary:
      "Two of football's biggest nations with two seismic World Cup meetings: Ronaldo's redemption in the 2002 final and Germany's historic 7-1 demolition in the 2014 semi-final.",
    meetings: [
      { year: 2002, host_country: "South Korea / Japan", round: "Final", score: "2-0", result: "team_a", venue_city: "Yokohama" },
      { year: 2014, host_country: "Brazil", round: "Semi-final", score: "1-7", result: "team_b", venue_city: "Belo Horizonte" },
    ],
  },

  // Brazil vs Netherlands
  {
    team_a: "bra",
    team_b: "ned",
    total_matches: 5,
    team_a_wins: 2,
    draws: 0,
    team_b_wins: 3,
    total_goals_team_a: 5,
    total_goals_team_b: 10,
    summary:
      "A high-quality World Cup rivalry spanning five decades. The Netherlands lead 3-2, featuring classic encounters like the 1994 quarter-final and the 2010 knockout clash.",
    meetings: [
      { year: 1974, host_country: "West Germany", round: "Second Round", score: "0-2", result: "team_b", venue_city: "Dortmund" },
      { year: 1994, host_country: "United States", round: "Quarter-final", score: "3-2", result: "team_a", venue_city: "Dallas" },
      { year: 1998, host_country: "France", round: "Semi-final", score: "1-1", penalty_score: "4-2", result: "team_a", venue_city: "Marseille" },
      { year: 2010, host_country: "South Africa", round: "Quarter-final", score: "1-2", result: "team_b", venue_city: "Port Elizabeth" },
      { year: 2014, host_country: "Brazil", round: "Third-place play-off", score: "0-3", result: "team_b", venue_city: "Brasília" },
    ],
  },

  // Brazil vs Uruguay
  {
    team_a: "bra",
    team_b: "uru",
    total_matches: 2,
    team_a_wins: 1,
    draws: 0,
    team_b_wins: 1,
    total_goals_team_a: 4,
    total_goals_team_b: 3,
    summary:
      "A South American classic split 1-1 at World Cups. The 1950 'Maracanazo' — Uruguay's 2-1 upset of Brazil in Rio — is the most famous result in World Cup history.",
    meetings: [
      { year: 1950, host_country: "Brazil", round: "Final Round", score: "1-2", result: "team_b", venue_city: "Rio de Janeiro" },
      { year: 1970, host_country: "Mexico", round: "Semi-final", score: "3-1", result: "team_a", venue_city: "Guadalajara" },
    ],
  },

  // England vs Germany
  {
    team_a: "eng",
    team_b: "ger",
    total_matches: 4,
    team_a_wins: 1,
    draws: 0,
    team_b_wins: 3,
    total_goals_team_a: 8,
    total_goals_team_b: 10,
    summary:
      "England's defining World Cup rivalry. Germany lead 3-1, but England's 1966 final triumph — Hurst's hat trick and 'they think it's all over' — remains the Three Lions' finest hour.",
    meetings: [
      { year: 1966, host_country: "England", round: "Final", score: "4-2", result: "team_a", venue_city: "London" },
      { year: 1970, host_country: "Mexico", round: "Quarter-final", score: "2-3", result: "team_b", venue_city: "León" },
      { year: 1990, host_country: "Italy", round: "Semi-final", score: "1-1", penalty_score: "3-4", result: "team_b", venue_city: "Turin" },
      { year: 2010, host_country: "South Africa", round: "Round of 16", score: "1-4", result: "team_b", venue_city: "Bloemfontein" },
    ],
  },

  // England vs Portugal
  {
    team_a: "eng",
    team_b: "por",
    total_matches: 2,
    team_a_wins: 1,
    draws: 0,
    team_b_wins: 1,
    total_goals_team_a: 2,
    total_goals_team_b: 1,
    summary:
      "Split 1-1 in World Cup knockout rounds. England won the 1966 semi-final featuring Eusébio's tears, while Portugal prevailed on penalties in a tense 2006 quarter-final.",
    meetings: [
      { year: 1966, host_country: "England", round: "Semi-final", score: "2-1", result: "team_a", venue_city: "London" },
      { year: 2006, host_country: "Germany", round: "Quarter-final", score: "0-0", penalty_score: "1-3", result: "team_b", venue_city: "Gelsenkirchen" },
    ],
  },

  // England vs United States
  {
    team_a: "eng",
    team_b: "usa",
    total_matches: 3,
    team_a_wins: 0,
    draws: 2,
    team_b_wins: 1,
    total_goals_team_a: 1,
    total_goals_team_b: 2,
    summary:
      "The USA have never lost to England at a World Cup. Their 1-0 win in 1950 remains one of the greatest upsets in football history, followed by draws in 2010 and 2022.",
    meetings: [
      { year: 1950, host_country: "Brazil", round: "Group Stage", score: "0-1", result: "team_b", venue_city: "Belo Horizonte" },
      { year: 2010, host_country: "South Africa", round: "Group Stage", score: "1-1", result: "draw", venue_city: "Rustenburg" },
      { year: 2022, host_country: "Qatar", round: "Group Stage", score: "0-0", result: "draw", venue_city: "Al Khor" },
    ],
  },

  // Spain vs Netherlands
  {
    team_a: "esp",
    team_b: "ned",
    total_matches: 2,
    team_a_wins: 1,
    draws: 0,
    team_b_wins: 1,
    total_goals_team_a: 2,
    total_goals_team_b: 5,
    summary:
      "A tale of two extremes: Spain's gritty 1-0 extra-time win in the 2010 final, followed by the Netherlands' stunning 5-1 revenge in the 2014 group stage.",
    meetings: [
      { year: 2010, host_country: "South Africa", round: "Final", score: "1-0", result: "team_a", venue_city: "Johannesburg" },
      { year: 2014, host_country: "Brazil", round: "Group Stage", score: "1-5", result: "team_b", venue_city: "Salvador" },
    ],
  },

  // France vs Germany
  {
    team_a: "fra",
    team_b: "ger",
    total_matches: 4,
    team_a_wins: 1,
    draws: 0,
    team_b_wins: 3,
    total_goals_team_a: 9,
    total_goals_team_b: 9,
    summary:
      "Germany lead 3-1 despite equal total goals. The 1982 semi-final in Seville — featuring the Battiston incident and a dramatic penalty shootout — is one of the greatest World Cup matches ever played.",
    meetings: [
      { year: 1958, host_country: "Sweden", round: "Third-place play-off", score: "6-3", result: "team_a", venue_city: "Gothenburg" },
      { year: 1982, host_country: "Spain", round: "Semi-final", score: "3-3", penalty_score: "4-5", result: "team_b", venue_city: "Seville" },
      { year: 1986, host_country: "Mexico", round: "Semi-final", score: "0-2", result: "team_b", venue_city: "Guadalajara" },
      { year: 2014, host_country: "Brazil", round: "Quarter-final", score: "0-1", result: "team_b", venue_city: "Rio de Janeiro" },
    ],
  },

  // France vs Portugal
  {
    team_a: "fra",
    team_b: "por",
    total_matches: 1,
    team_a_wins: 1,
    draws: 0,
    team_b_wins: 0,
    total_goals_team_a: 1,
    total_goals_team_b: 0,
    summary:
      "France's only World Cup meeting with Portugal was a 1-0 semi-final win in 2006 at Munich, with Zidane converting the decisive penalty.",
    meetings: [
      { year: 2006, host_country: "Germany", round: "Semi-final", score: "1-0", result: "team_a", venue_city: "Munich" },
    ],
  },

  // Germany vs South Korea
  {
    team_a: "ger",
    team_b: "kor",
    total_matches: 3,
    team_a_wins: 2,
    draws: 0,
    team_b_wins: 1,
    total_goals_team_a: 4,
    total_goals_team_b: 4,
    summary:
      "Germany lead 2-1 but South Korea delivered one of the biggest World Cup shocks in 2018, eliminating the defending champions 2-0 in the group stage.",
    meetings: [
      { year: 1994, host_country: "United States", round: "Group Stage", score: "3-2", result: "team_a", venue_city: "Dallas" },
      { year: 2002, host_country: "South Korea / Japan", round: "Semi-final", score: "1-0", result: "team_a", venue_city: "Seoul" },
      { year: 2018, host_country: "Russia", round: "Group Stage", score: "0-2", result: "team_b", venue_city: "Kazan" },
    ],
  },

  // Germany vs United States
  {
    team_a: "ger",
    team_b: "usa",
    total_matches: 2,
    team_a_wins: 2,
    draws: 0,
    team_b_wins: 0,
    total_goals_team_a: 2,
    total_goals_team_b: 0,
    summary:
      "Germany have won both World Cup meetings with the United States by identical 1-0 scorelines — a 2002 quarter-final and a 2014 group stage match.",
    meetings: [
      { year: 2002, host_country: "South Korea / Japan", round: "Quarter-final", score: "1-0", result: "team_a", venue_city: "Ulsan" },
      { year: 2014, host_country: "Brazil", round: "Group Stage", score: "1-0", result: "team_a", venue_city: "Recife" },
    ],
  },
];
