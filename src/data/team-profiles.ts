import type { TeamProfile } from "../types/index.js";

export const teamProfiles: TeamProfile[] = [
  // ── Group A ────────────────────────────────────────────────
  {
    team_id: "mex",
    coach: "Javier Aguirre",
    playing_style: "Defensively disciplined with quick transitions and strong set-piece play.",
    key_players: [
      { name: "Edson Alvarez", position: "MID", club: "West Ham United" },
      { name: "Santiago Gimenez", position: "FWD", club: "Feyenoord" },
      { name: "Guillermo Ochoa", position: "GK", club: "Salernitana" },
    ],
    world_cup_history: { appearances: 17, best_result: "Quarter-finals (1970, 1986)", titles: 0 },
    qualifying_summary: "Automatic qualification as co-hosts.",
  },
  {
    team_id: "rsa",
    coach: "Hugo Broos",
    playing_style: "High-energy pressing with young, athletic talent and direct attacking play.",
    key_players: [
      { name: "Percy Tau", position: "FWD", club: "Al Ahly" },
      { name: "Ronwen Williams", position: "GK", club: "Mamelodi Sundowns" },
      { name: "Themba Zwane", position: "MID", club: "Mamelodi Sundowns" },
    ],
    world_cup_history: { appearances: 4, best_result: "Group stage (1998, 2002, 2010)", titles: 0 },
    qualifying_summary: "Qualified through CAF World Cup qualifiers, finishing top of their group.",
  },
  {
    team_id: "kor",
    coach: "Hong Myung-bo",
    playing_style: "Tactically versatile with high pressing intensity and strong collective discipline.",
    key_players: [
      { name: "Son Heung-min", position: "FWD", club: "Tottenham Hotspur" },
      { name: "Kim Min-jae", position: "DEF", club: "Bayern Munich" },
      { name: "Lee Kang-in", position: "MID", club: "Paris Saint-Germain" },
    ],
    world_cup_history: { appearances: 11, best_result: "Semi-finals (2002)", titles: 0 },
    qualifying_summary: "Qualified through AFC qualifiers, securing automatic qualification from their group.",
  },
  {
    team_id: "tbd_uefa_d",
    coach: "TBD",
    playing_style: "To be determined after UEFA Playoff D concludes.",
    key_players: [],
    world_cup_history: { appearances: 0, best_result: "TBD", titles: 0 },
    qualifying_summary: "Winner of UEFA Playoff Path D, to be decided by March 2026.",
  },

  // ── Group B ────────────────────────────────────────────────
  {
    team_id: "can",
    coach: "Jesse Marsch",
    playing_style: "High-pressing, physically imposing side with pace on the wings and direct attacking transitions.",
    key_players: [
      { name: "Alphonso Davies", position: "DEF", club: "Real Madrid" },
      { name: "Jonathan David", position: "FWD", club: "Lille" },
      { name: "Tajon Buchanan", position: "MID", club: "Inter Milan" },
    ],
    world_cup_history: { appearances: 2, best_result: "Group stage (2022)", titles: 0 },
    qualifying_summary: "Automatic qualification as co-hosts.",
  },
  {
    team_id: "sui",
    coach: "Murat Yakin",
    playing_style: "Organized and compact defensively with a structured build-up and ability to absorb pressure before striking on the counter.",
    key_players: [
      { name: "Granit Xhaka", position: "MID", club: "Bayer Leverkusen" },
      { name: "Manuel Akanji", position: "DEF", club: "Manchester City" },
      { name: "Breel Embolo", position: "FWD", club: "Monaco" },
    ],
    world_cup_history: { appearances: 12, best_result: "Quarter-finals (1934, 1938, 1954)", titles: 0 },
    qualifying_summary: "Qualified through UEFA qualifiers, finishing runners-up in their group and winning their playoff.",
  },
  {
    team_id: "qat",
    coach: "Carlos Queiroz",
    playing_style: "Possession-based approach with emphasis on technical quality and tactical discipline.",
    key_players: [
      { name: "Akram Afif", position: "FWD", club: "Al Sadd" },
      { name: "Almoez Ali", position: "FWD", club: "Al Duhail" },
      { name: "Hassan Al-Haydos", position: "MID", club: "Al Sadd" },
    ],
    world_cup_history: { appearances: 2, best_result: "Group stage (2022)", titles: 0 },
    qualifying_summary: "Qualified through AFC qualifiers as Asian Cup champions, securing a spot through their group-stage performance.",
  },
  {
    team_id: "tbd_uefa_a",
    coach: "TBD",
    playing_style: "To be determined after UEFA Playoff A concludes.",
    key_players: [],
    world_cup_history: { appearances: 0, best_result: "TBD", titles: 0 },
    qualifying_summary: "Winner of UEFA Playoff Path A, to be decided by March 2026.",
  },

  // ── Group C ────────────────────────────────────────────────
  {
    team_id: "bra",
    coach: "Dorival Junior",
    playing_style: "Flair-driven attack with creative wide players, strong individual skill, and a tradition of expansive football.",
    key_players: [
      { name: "Vinicius Junior", position: "FWD", club: "Real Madrid" },
      { name: "Rodrygo", position: "FWD", club: "Real Madrid" },
      { name: "Bruno Guimaraes", position: "MID", club: "Newcastle United" },
    ],
    world_cup_history: { appearances: 22, best_result: "Champions (2002)", titles: 5 },
    qualifying_summary: "Qualified through CONMEBOL qualifiers after a challenging campaign, finishing in the top four.",
  },
  {
    team_id: "mar",
    coach: "Walid Regragui",
    playing_style: "Defensively resolute with rapid counter-attacks and a fearless big-game mentality built on 2022 semi-final run.",
    key_players: [
      { name: "Achraf Hakimi", position: "DEF", club: "Paris Saint-Germain" },
      { name: "Hakim Ziyech", position: "MID", club: "Galatasaray" },
      { name: "Youssef En-Nesyri", position: "FWD", club: "Fenerbahce" },
    ],
    world_cup_history: { appearances: 7, best_result: "Semi-finals (2022)", titles: 0 },
    qualifying_summary: "Qualified through CAF qualifiers, topping their group with a dominant defensive record.",
  },
  {
    team_id: "hai",
    coach: "Marc Collat",
    playing_style: "Energetic and passionate with quick passing combinations and reliance on speed in transition.",
    key_players: [
      { name: "Frantzdy Pierrot", position: "FWD", club: "Rapid Wien" },
      { name: "Derrick Etienne Jr.", position: "MID", club: "Columbus Crew" },
      { name: "Josue Duverger", position: "GK", club: "Real Espana" },
    ],
    world_cup_history: { appearances: 1, best_result: "Group stage (1974)", titles: 0 },
    qualifying_summary: "Qualified through CONCACAF qualifiers after a historic campaign, finishing in the top qualifying spots.",
  },
  {
    team_id: "sco",
    coach: "Steve Clarke",
    playing_style: "Compact and disciplined with a low block and direct build-up, relying on set pieces and physicality.",
    key_players: [
      { name: "Andrew Robertson", position: "DEF", club: "Liverpool" },
      { name: "John McGinn", position: "MID", club: "Aston Villa" },
      { name: "Scott McTominay", position: "MID", club: "Napoli" },
    ],
    world_cup_history: { appearances: 9, best_result: "Group stage (1974, 1978, 1982, 1986, 1990, 1998)", titles: 0 },
    qualifying_summary: "Qualified through UEFA qualifiers, navigating a competitive group and playoff to reach their first World Cup since 1998.",
  },

  // ── Group D ────────────────────────────────────────────────
  {
    team_id: "usa",
    coach: "Mauricio Pochettino",
    playing_style: "Athletic and high-pressing with a young, technically gifted squad and versatile attacking options.",
    key_players: [
      { name: "Christian Pulisic", position: "FWD", club: "AC Milan" },
      { name: "Weston McKennie", position: "MID", club: "Juventus" },
      { name: "Yunus Musah", position: "MID", club: "AC Milan" },
    ],
    world_cup_history: { appearances: 11, best_result: "Semi-finals (1930)", titles: 0 },
    qualifying_summary: "Automatic qualification as co-hosts.",
  },
  {
    team_id: "par",
    coach: "Alfaro Moreno",
    playing_style: "Physically combative with a deep defensive block and dangerous set-piece delivery.",
    key_players: [
      { name: "Miguel Almiron", position: "MID", club: "Atlanta United" },
      { name: "Julio Enciso", position: "FWD", club: "Brighton" },
      { name: "Gustavo Gomez", position: "DEF", club: "Palmeiras" },
    ],
    world_cup_history: { appearances: 9, best_result: "Round of 16 (1998, 2002, 2006, 2010)", titles: 0 },
    qualifying_summary: "Qualified through CONMEBOL qualifiers after a steady campaign, securing a direct qualification spot.",
  },
  {
    team_id: "aus",
    coach: "Tony Popovic",
    playing_style: "Hard-working and organized with a counter-attacking focus and strong aerial presence.",
    key_players: [
      { name: "Mathew Leckie", position: "FWD", club: "Melbourne City" },
      { name: "Jackson Irvine", position: "MID", club: "St. Pauli" },
      { name: "Harry Souttar", position: "DEF", club: "Leicester City" },
    ],
    world_cup_history: { appearances: 6, best_result: "Round of 16 (2006, 2022)", titles: 0 },
    qualifying_summary: "Qualified through AFC qualifiers, securing a spot from the third round of Asian qualifying.",
  },
  {
    team_id: "tbd_uefa_c",
    coach: "TBD",
    playing_style: "To be determined after UEFA Playoff C concludes.",
    key_players: [],
    world_cup_history: { appearances: 0, best_result: "TBD", titles: 0 },
    qualifying_summary: "Winner of UEFA Playoff Path C, to be decided by March 2026.",
  },

  // ── Group E ────────────────────────────────────────────────
  {
    team_id: "ger",
    coach: "Julian Nagelsmann",
    playing_style: "Possession-oriented with aggressive pressing, tactical flexibility, and quick vertical transitions.",
    key_players: [
      { name: "Jamal Musiala", position: "MID", club: "Bayern Munich" },
      { name: "Florian Wirtz", position: "MID", club: "Bayer Leverkusen" },
      { name: "Kai Havertz", position: "FWD", club: "Arsenal" },
    ],
    world_cup_history: { appearances: 20, best_result: "Champions (2014)", titles: 4 },
    qualifying_summary: "Qualified through UEFA qualifiers, topping their group convincingly.",
  },
  {
    team_id: "ecu",
    coach: "Sebastian Beccacece",
    playing_style: "High-altitude conditioning translates to relentless pressing and physical endurance with pacey forwards.",
    key_players: [
      { name: "Moises Caicedo", position: "MID", club: "Chelsea" },
      { name: "Enner Valencia", position: "FWD", club: "Internacional" },
      { name: "Piero Hincapie", position: "DEF", club: "Bayer Leverkusen" },
    ],
    world_cup_history: { appearances: 4, best_result: "Round of 16 (2006)", titles: 0 },
    qualifying_summary: "Qualified through CONMEBOL qualifiers, finishing in the top four of the South American table.",
  },
  {
    team_id: "civ",
    coach: "Faouzi Benzarti",
    playing_style: "Explosive attacking talent combined with aggressive pressing and flair on the ball.",
    key_players: [
      { name: "Sebastien Haller", position: "FWD", club: "Borussia Dortmund" },
      { name: "Franck Kessie", position: "MID", club: "Al Ahli" },
      { name: "Simon Adingra", position: "FWD", club: "Brighton" },
    ],
    world_cup_history: { appearances: 4, best_result: "Group stage (2006, 2010, 2014)", titles: 0 },
    qualifying_summary: "Qualified through CAF qualifiers as reigning AFCON champions, finishing top of their qualifying group.",
  },
  {
    team_id: "cuw",
    coach: "Dick Advocaat",
    playing_style: "Compact and defensively oriented with quick transitions and reliance on individual quality in attack.",
    key_players: [
      { name: "Juninho Bacuna", position: "MID", club: "Rangers" },
      { name: "Kenji Gorre", position: "FWD", club: "NAC Breda" },
      { name: "Eloy Room", position: "GK", club: "Vitesse" },
    ],
    world_cup_history: { appearances: 1, best_result: "Debut appearance (2026)", titles: 0 },
    qualifying_summary: "Historic first World Cup qualification through CONCACAF qualifiers, finishing in the top qualifying positions.",
  },

  // ── Group F ────────────────────────────────────────────────
  {
    team_id: "ned",
    coach: "Ronald Koeman",
    playing_style: "Total Football philosophy with positional interchange, technical build-up, and possession dominance.",
    key_players: [
      { name: "Cody Gakpo", position: "FWD", club: "Liverpool" },
      { name: "Virgil van Dijk", position: "DEF", club: "Liverpool" },
      { name: "Frenkie de Jong", position: "MID", club: "Barcelona" },
    ],
    world_cup_history: { appearances: 11, best_result: "Runners-up (1974, 1978, 2010)", titles: 0 },
    qualifying_summary: "Qualified through UEFA qualifiers, finishing at the top of their group.",
  },
  {
    team_id: "jpn",
    coach: "Hajime Moriyasu",
    playing_style: "Tactically astute with rapid transitions, high pressing, and disciplined defensive structure. Known for upsetting favorites.",
    key_players: [
      { name: "Takefusa Kubo", position: "FWD", club: "Real Sociedad" },
      { name: "Wataru Endo", position: "MID", club: "Liverpool" },
      { name: "Kaoru Mitoma", position: "FWD", club: "Brighton" },
    ],
    world_cup_history: { appearances: 7, best_result: "Round of 16 (2002, 2010, 2022)", titles: 0 },
    qualifying_summary: "Qualified through AFC qualifiers, topping their group with a strong unbeaten run.",
  },
  {
    team_id: "tun",
    coach: "Jalel Kadri",
    playing_style: "Physically strong and well-organized with a pragmatic approach and clinical counter-attacking.",
    key_players: [
      { name: "Aissa Laidouni", position: "MID", club: "Union Berlin" },
      { name: "Youssef Msakni", position: "FWD", club: "Al-Arabi" },
      { name: "Hannibal Mejbri", position: "MID", club: "Manchester United" },
    ],
    world_cup_history: { appearances: 6, best_result: "Group stage (1978, 1998, 2002, 2006, 2018, 2022)", titles: 0 },
    qualifying_summary: "Qualified through CAF qualifiers, navigating a tough group to earn their spot.",
  },
  {
    team_id: "tbd_uefa_b",
    coach: "TBD",
    playing_style: "To be determined after UEFA Playoff B concludes.",
    key_players: [],
    world_cup_history: { appearances: 0, best_result: "TBD", titles: 0 },
    qualifying_summary: "Winner of UEFA Playoff Path B, to be decided by March 2026.",
  },

  // ── Group G ────────────────────────────────────────────────
  {
    team_id: "bel",
    coach: "Domenico Tedesco",
    playing_style: "Technically gifted with creative midfield play, though transitioning from a golden generation to emerging new talent.",
    key_players: [
      { name: "Kevin De Bruyne", position: "MID", club: "Manchester City" },
      { name: "Jeremy Doku", position: "FWD", club: "Manchester City" },
      { name: "Amadou Onana", position: "MID", club: "Aston Villa" },
    ],
    world_cup_history: { appearances: 14, best_result: "Semi-finals (2018)", titles: 0 },
    qualifying_summary: "Qualified through UEFA qualifiers, finishing at the top of their group.",
  },
  {
    team_id: "irn",
    coach: "Amir Ghalenoei",
    playing_style: "Defensively resilient with a low block, physical duels, and dangerous on set pieces and counter-attacks.",
    key_players: [
      { name: "Mehdi Taremi", position: "FWD", club: "Inter Milan" },
      { name: "Sardar Azmoun", position: "FWD", club: "Roma" },
      { name: "Alireza Beiranvand", position: "GK", club: "Persepolis" },
    ],
    world_cup_history: { appearances: 6, best_result: "Group stage (1978, 1998, 2006, 2014, 2018, 2022)", titles: 0 },
    qualifying_summary: "Qualified through AFC qualifiers, finishing in a direct qualification spot from their group.",
  },
  {
    team_id: "egy",
    coach: "Hossam Hassan",
    playing_style: "Structured defensively with a reliance on star forward Mohamed Salah for creative spark and goals.",
    key_players: [
      { name: "Mohamed Salah", position: "FWD", club: "Liverpool" },
      { name: "Omar Marmoush", position: "FWD", club: "Manchester City" },
      { name: "Mohamed Elneny", position: "MID", club: "Al Ahly" },
    ],
    world_cup_history: { appearances: 4, best_result: "Group stage (1934, 1990, 2018)", titles: 0 },
    qualifying_summary: "Qualified through CAF qualifiers, finishing at the top of their qualifying group.",
  },
  {
    team_id: "nzl",
    coach: "Darren Bazeley",
    playing_style: "Resolute and hardworking with a direct, physical approach and strong team cohesion.",
    key_players: [
      { name: "Chris Wood", position: "FWD", club: "Nottingham Forest" },
      { name: "Liberato Cacace", position: "DEF", club: "Empoli" },
      { name: "Matt Garbett", position: "MID", club: "Torino" },
    ],
    world_cup_history: { appearances: 3, best_result: "Group stage (1982, 2010)", titles: 0 },
    qualifying_summary: "Qualified as OFC representatives, winning the Oceania qualifying tournament.",
  },

  // ── Group H ────────────────────────────────────────────────
  {
    team_id: "esp",
    coach: "Luis de la Fuente",
    playing_style: "Tiki-taka evolved — possession-dominant with penetrating passing, young dynamic wingers, and a high defensive line.",
    key_players: [
      { name: "Lamine Yamal", position: "FWD", club: "Barcelona" },
      { name: "Pedri", position: "MID", club: "Barcelona" },
      { name: "Rodri", position: "MID", club: "Manchester City" },
    ],
    world_cup_history: { appearances: 16, best_result: "Champions (2010)", titles: 1 },
    qualifying_summary: "Qualified through UEFA qualifiers as reigning European champions, topping their group comfortably.",
  },
  {
    team_id: "uru",
    coach: "Marcelo Bielsa",
    playing_style: "Aggressive pressing with relentless intensity, fluid attacking movements, and a fearless mentality under Bielsa's demanding system.",
    key_players: [
      { name: "Federico Valverde", position: "MID", club: "Real Madrid" },
      { name: "Darwin Nunez", position: "FWD", club: "Liverpool" },
      { name: "Ronald Araujo", position: "DEF", club: "Barcelona" },
    ],
    world_cup_history: { appearances: 14, best_result: "Champions (1930, 1950)", titles: 2 },
    qualifying_summary: "Qualified through CONMEBOL qualifiers, finishing in the top positions of the South American table.",
  },
  {
    team_id: "ksa",
    coach: "Roberto Mancini",
    playing_style: "Possession-focused with improved tactical discipline and a growing emphasis on developing domestic talent.",
    key_players: [
      { name: "Salem Al-Dawsari", position: "FWD", club: "Al Hilal" },
      { name: "Firas Al-Buraikan", position: "FWD", club: "Al Ahli" },
      { name: "Mohammed Al-Owais", position: "GK", club: "Al Hilal" },
    ],
    world_cup_history: { appearances: 7, best_result: "Round of 16 (1994)", titles: 0 },
    qualifying_summary: "Qualified through AFC qualifiers, finishing in a direct qualification spot from the third round.",
  },
  {
    team_id: "cpv",
    coach: "Bubista",
    playing_style: "Technically skilled with flair on the ball, emphasizing width and individual creativity in tight spaces.",
    key_players: [
      { name: "Garry Rodrigues", position: "FWD", club: "Olympiacos" },
      { name: "Kenny Rocha Santos", position: "MID", club: "Al-Ittihad" },
      { name: "Stopira", position: "DEF", club: "Giresunspor" },
    ],
    world_cup_history: { appearances: 1, best_result: "Debut appearance (2026)", titles: 0 },
    qualifying_summary: "Historic first World Cup qualification through CAF qualifiers, topping their qualifying group.",
  },

  // ── Group I ────────────────────────────────────────────────
  {
    team_id: "fra",
    coach: "Didier Deschamps",
    playing_style: "Pragmatic and adaptable with world-class individual talent, capable of both defensive solidity and explosive attacking football.",
    key_players: [
      { name: "Kylian Mbappe", position: "FWD", club: "Real Madrid" },
      { name: "Antoine Griezmann", position: "FWD", club: "Atletico Madrid" },
      { name: "Aurelien Tchouameni", position: "MID", club: "Real Madrid" },
    ],
    world_cup_history: { appearances: 16, best_result: "Champions (2018)", titles: 2 },
    qualifying_summary: "Qualified through UEFA qualifiers, finishing at the top of their group as one of the tournament favorites.",
  },
  {
    team_id: "sen",
    coach: "Aliou Cisse",
    playing_style: "Physically powerful with pace on the flanks, tactical discipline, and strong defensive organization.",
    key_players: [
      { name: "Sadio Mane", position: "FWD", club: "Al Nassr" },
      { name: "Kalidou Koulibaly", position: "DEF", club: "Al Hilal" },
      { name: "Ismaila Sarr", position: "FWD", club: "Crystal Palace" },
    ],
    world_cup_history: { appearances: 4, best_result: "Quarter-finals (2002)", titles: 0 },
    qualifying_summary: "Qualified through CAF qualifiers as reigning AFCON runners-up, finishing top of their qualifying group.",
  },
  {
    team_id: "nor",
    coach: "Stale Solbakken",
    playing_style: "Direct and physical with a focus on getting the ball to star striker Haaland quickly, supported by disciplined defending.",
    key_players: [
      { name: "Erling Haaland", position: "FWD", club: "Manchester City" },
      { name: "Martin Odegaard", position: "MID", club: "Arsenal" },
      { name: "Alexander Sorloth", position: "FWD", club: "Atletico Madrid" },
    ],
    world_cup_history: { appearances: 3, best_result: "Round of 16 (1998)", titles: 0 },
    qualifying_summary: "Qualified through UEFA qualifiers, finishing runners-up in their group and winning their playoff to reach a first World Cup since 1998.",
  },
  {
    team_id: "tbd_ic_2",
    coach: "TBD",
    playing_style: "To be determined after Intercontinental Playoff 2 concludes.",
    key_players: [],
    world_cup_history: { appearances: 0, best_result: "TBD", titles: 0 },
    qualifying_summary: "Winner of Intercontinental Playoff 2, to be decided by March 2026.",
  },

  // ── Group J ────────────────────────────────────────────────
  {
    team_id: "arg",
    coach: "Lionel Scaloni",
    playing_style: "Balanced and cohesive with elite individual quality, a rock-solid defense, and Messi's orchestration in attack.",
    key_players: [
      { name: "Lionel Messi", position: "FWD", club: "Inter Miami" },
      { name: "Julian Alvarez", position: "FWD", club: "Atletico Madrid" },
      { name: "Enzo Fernandez", position: "MID", club: "Chelsea" },
    ],
    world_cup_history: { appearances: 18, best_result: "Champions (2022)", titles: 3 },
    qualifying_summary: "Qualified through CONMEBOL qualifiers as defending world champions, finishing near the top of the South American table.",
  },
  {
    team_id: "aut",
    coach: "Ralf Rangnick",
    playing_style: "Intense gegenpressing with a structured positional game, vertical transitions, and relentless energy under Rangnick.",
    key_players: [
      { name: "David Alaba", position: "DEF", club: "Real Madrid" },
      { name: "Marcel Sabitzer", position: "MID", club: "Borussia Dortmund" },
      { name: "Christoph Baumgartner", position: "MID", club: "RB Leipzig" },
    ],
    world_cup_history: { appearances: 8, best_result: "Semi-finals (1934, 1954)", titles: 0 },
    qualifying_summary: "Qualified through UEFA qualifiers, finishing at the top of a competitive group under Rangnick's revitalized system.",
  },
  {
    team_id: "alg",
    coach: "Vladimir Petkovic",
    playing_style: "Technically proficient with a structured build-up, strong midfield control, and clinical finishing.",
    key_players: [
      { name: "Riyad Mahrez", position: "FWD", club: "Al Ahli" },
      { name: "Ismael Bennacer", position: "MID", club: "AC Milan" },
      { name: "Islam Slimani", position: "FWD", club: "Coritiba" },
    ],
    world_cup_history: { appearances: 5, best_result: "Round of 16 (2014)", titles: 0 },
    qualifying_summary: "Qualified through CAF qualifiers, finishing at the top of their group.",
  },
  {
    team_id: "jor",
    coach: "Hussein Ammouta",
    playing_style: "Defensively organized with disciplined shape and capable of producing surprise results through collective effort.",
    key_players: [
      { name: "Mousa Al-Taamari", position: "FWD", club: "Montpellier" },
      { name: "Yazan Al-Naimat", position: "FWD", club: "Young Boys" },
      { name: "Yazeed Abo Laila", position: "GK", club: "Omonoia" },
    ],
    world_cup_history: { appearances: 1, best_result: "Debut appearance (2026)", titles: 0 },
    qualifying_summary: "Historic first World Cup qualification through AFC qualifiers, reaching the tournament as Asian Cup finalists.",
  },

  // ── Group K ────────────────────────────────────────────────
  {
    team_id: "por",
    coach: "Roberto Martinez",
    playing_style: "Technically excellent with patient build-up play, creative midfield, and devastating finishing from Cristiano Ronaldo.",
    key_players: [
      { name: "Cristiano Ronaldo", position: "FWD", club: "Al Nassr" },
      { name: "Bernardo Silva", position: "MID", club: "Manchester City" },
      { name: "Rafael Leao", position: "FWD", club: "AC Milan" },
    ],
    world_cup_history: { appearances: 8, best_result: "Semi-finals (1966, 2006)", titles: 0 },
    qualifying_summary: "Qualified through UEFA qualifiers, topping their group with a strong campaign under Roberto Martinez.",
  },
  {
    team_id: "col",
    coach: "Nestor Lorenzo",
    playing_style: "Possession-based with technical flair, creative playmaking through James Rodriguez, and physicality in midfield.",
    key_players: [
      { name: "Luis Diaz", position: "FWD", club: "Liverpool" },
      { name: "James Rodriguez", position: "MID", club: "Rayo Vallecano" },
      { name: "Jhon Arias", position: "FWD", club: "Fluminense" },
    ],
    world_cup_history: { appearances: 7, best_result: "Quarter-finals (2014)", titles: 0 },
    qualifying_summary: "Qualified through CONMEBOL qualifiers, finishing in a strong position in the South American standings.",
  },
  {
    team_id: "uzb",
    coach: "Srecko Katanec",
    playing_style: "Well-organized with a disciplined defensive shape and ability to compete physically against stronger opponents.",
    key_players: [
      { name: "Eldor Shomurodov", position: "FWD", club: "Roma" },
      { name: "Abbosbek Fayzullaev", position: "MID", club: "CSKA Moscow" },
      { name: "Otabek Shukurov", position: "MID", club: "Al Wasl" },
    ],
    world_cup_history: { appearances: 1, best_result: "Debut appearance (2026)", titles: 0 },
    qualifying_summary: "Historic first World Cup qualification through AFC qualifiers, finishing in a direct qualification spot from the third round.",
  },
  {
    team_id: "tbd_ic_1",
    coach: "TBD",
    playing_style: "To be determined after Intercontinental Playoff 1 concludes.",
    key_players: [],
    world_cup_history: { appearances: 0, best_result: "TBD", titles: 0 },
    qualifying_summary: "Winner of Intercontinental Playoff 1, to be decided by March 2026.",
  },

  // ── Group L ────────────────────────────────────────────────
  {
    team_id: "eng",
    coach: "Thomas Tuchel",
    playing_style: "Structured and tactically sophisticated with strong defensive organization and quality in wide areas.",
    key_players: [
      { name: "Jude Bellingham", position: "MID", club: "Real Madrid" },
      { name: "Bukayo Saka", position: "FWD", club: "Arsenal" },
      { name: "Phil Foden", position: "MID", club: "Manchester City" },
    ],
    world_cup_history: { appearances: 16, best_result: "Champions (1966)", titles: 1 },
    qualifying_summary: "Qualified through UEFA qualifiers, finishing at the top of their group under new manager Thomas Tuchel.",
  },
  {
    team_id: "cro",
    coach: "Zlatko Dalic",
    playing_style: "Technically masterful midfield-driven team with exceptional passing quality and big-tournament pedigree.",
    key_players: [
      { name: "Luka Modric", position: "MID", club: "Real Madrid" },
      { name: "Mateo Kovacic", position: "MID", club: "Manchester City" },
      { name: "Josko Gvardiol", position: "DEF", club: "Manchester City" },
    ],
    world_cup_history: { appearances: 7, best_result: "Runners-up (2018)", titles: 0 },
    qualifying_summary: "Qualified through UEFA qualifiers, finishing in a qualifying position from their group.",
  },
  {
    team_id: "gha",
    coach: "Otto Addo",
    playing_style: "Athletic and dynamic with pace in attack, spirited performances, and strong team unity.",
    key_players: [
      { name: "Mohammed Kudus", position: "MID", club: "West Ham United" },
      { name: "Thomas Partey", position: "MID", club: "Arsenal" },
      { name: "Antoine Semenyo", position: "FWD", club: "Bournemouth" },
    ],
    world_cup_history: { appearances: 5, best_result: "Quarter-finals (2010)", titles: 0 },
    qualifying_summary: "Qualified through CAF qualifiers, finishing top of their group in the African qualifying rounds.",
  },
  {
    team_id: "pan",
    coach: "Thomas Christiansen",
    playing_style: "Physically strong and combative with an organized defensive block and aerial threat from set pieces.",
    key_players: [
      { name: "Michael Murillo", position: "DEF", club: "Anderlecht" },
      { name: "Jose Fajardo", position: "FWD", club: "Saprissa" },
      { name: "Adalberto Carrasquilla", position: "MID", club: "Houston Dynamo" },
    ],
    world_cup_history: { appearances: 2, best_result: "Group stage (2018)", titles: 0 },
    qualifying_summary: "Qualified through CONCACAF qualifiers, finishing in a direct qualification spot from the final round.",
  },
];
