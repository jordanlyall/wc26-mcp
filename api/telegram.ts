import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  matches, teams, venues, groups, teamProfiles, cityGuides,
  historicalMatchups, visaInfo, fanZones, news, injuries, tournamentOdds,
  resolveTeam, teamName, venueName, enrichMatch, enrichGroup,
} from "./_helpers.js";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// ── HTML helpers ──

function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function bold(text: string): string {
  return `<b>${esc(text)}</b>`;
}

function truncate(text: string, max = 4000): string {
  if (text.length <= max) return text;
  return text.slice(0, max) + '\n\n… <a href="https://wc26.ai">See more at wc26.ai</a>';
}

// ── Telegram API ──

async function sendMessage(chatId: number, text: string): Promise<void> {
  await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: truncate(text),
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
}

// ── Parse command ──

function parseCommand(text: string): { command: string; args: string } {
  const cleaned = text.replace(/@\S+/, "").trim(); // strip @botname
  const spaceIdx = cleaned.indexOf(" ");
  if (spaceIdx === -1) return { command: cleaned.toLowerCase(), args: "" };
  return {
    command: cleaned.slice(0, spaceIdx).toLowerCase(),
    args: cleaned.slice(spaceIdx + 1).trim(),
  };
}

// ── Command handlers ──

function cmdStart(): string {
  return [
    "<b>FIFA World Cup 2026</b>",
    "",
    "/brief — Tournament overview &amp; countdown",
    "/news — Latest WC2026 news",
    "/team &lt;name&gt; — Team profile",
    "/matches &lt;team&gt; — Team match schedule",
    "/group &lt;letter&gt; — Group details",
    "/city &lt;name&gt; — City travel guide",
    "/venue &lt;name&gt; — Venue info",
    "/history &lt;team1&gt; &lt;team2&gt; — Head-to-head record",
    "/visa &lt;team&gt; — Visa requirements",
    "/fanzones &lt;city&gt; — Fan zone locations",
    "/injuries [team|status] — Injury report",
    "/odds [category] — Tournament odds &amp; predictions",
    "/standings [group] — Group power rankings",
    "/bracket [round] — Knockout bracket",
    "/schedule — Upcoming matches",
    "",
    'Share this bot: t.me/wc26ai_bot',
    'wc26.ai',
  ].join("\n");
}

function cmdBrief(): string {
  const today = new Date().toISOString().slice(0, 10);
  const kickoff = "2026-06-11";
  const days = Math.ceil((new Date(kickoff).getTime() - new Date(today).getTime()) / 86400000);
  const tbdCount = teams.filter((t) => t.code === "TBD").length;

  const lines: string[] = [
    `<b>FIFA World Cup 2026</b>`,
    "",
  ];

  if (days > 0) {
    lines.push(`${days} days until kickoff on June 11, 2026`);
  } else if (days === 0) {
    lines.push("The World Cup starts TODAY!");
  }

  if (tbdCount > 0) {
    lines.push(`${tbdCount} playoff spots still to be decided`);
  } else {
    lines.push("All 48 teams confirmed");
  }

  lines.push("");
  lines.push(`${venues.length} venues across 3 countries`);
  lines.push(`${teams.filter((t) => !t.code.startsWith("TBD")).length} teams confirmed`);
  lines.push(`${matches.length} total matches scheduled`);

  const hostTeams = teams.filter((t) => t.is_host);
  if (hostTeams.length > 0) {
    lines.push("");
    lines.push("<b>Host nations:</b>");
    for (const h of hostTeams) {
      lines.push(`  ${h.flag_emoji} ${esc(h.name)} (Group ${h.group})`);
    }
  }

  lines.push("");
  lines.push('wc26.ai');

  return lines.join("\n");
}

function cmdTeam(args: string): string {
  if (!args) return "Usage: /team &lt;name&gt;\nExample: /team brazil";

  const resolved = resolveTeam(args);
  if (!resolved) return `Team "${esc(args)}" not found. Try a country name, FIFA code, or ID.`;

  const profile = teamProfiles.find((p) => p.team_id === resolved.id);
  const lines: string[] = [
    `${resolved.flag_emoji} <b>${esc(resolved.name)}</b>`,
    "",
    `Group: ${resolved.group}`,
    `FIFA Code: ${resolved.code}`,
    `Confederation: ${resolved.confederation}`,
  ];

  if (resolved.fifa_ranking) lines.push(`FIFA Ranking: #${resolved.fifa_ranking}`);
  if (resolved.is_host) lines.push("Host nation");

  if (profile) {
    lines.push("");
    lines.push(`<b>Coach:</b> ${esc(profile.coach)}`);
    lines.push(`<b>Style:</b> ${esc(profile.playing_style)}`);

    if (profile.key_players.length > 0) {
      lines.push("");
      lines.push("<b>Key Players:</b>");
      for (const p of profile.key_players) {
        lines.push(`  ${esc(p.name)} (${esc(p.position)}, ${esc(p.club)})`);
      }
    }

    if (profile.world_cup_history) {
      lines.push("");
      lines.push(`<b>WC History:</b> ${profile.world_cup_history.appearances} appearances, ${profile.world_cup_history.titles} title(s)`);
      lines.push(`Best: ${esc(profile.world_cup_history.best_result)}`);
    }

    lines.push("");
    lines.push(`<b>Qualifying:</b> ${esc(profile.qualifying_summary)}`);
  }

  return lines.join("\n");
}

function cmdMatches(args: string): string {
  if (!args) return "Usage: /matches &lt;team&gt;\nExample: /matches usa";

  const resolved = resolveTeam(args);
  if (!resolved) return `Team "${esc(args)}" not found.`;

  const teamMatches = matches.filter(
    (m) => m.home_team_id === resolved.id || m.away_team_id === resolved.id
  );

  if (teamMatches.length === 0) return `No matches found for ${resolved.flag_emoji} ${esc(resolved.name)}.`;

  const lines: string[] = [
    `${resolved.flag_emoji} <b>${esc(resolved.name)} — Matches</b>`,
    "",
  ];

  for (const m of teamMatches) {
    const home = teamName(m.home_team_id);
    const away = teamName(m.away_team_id);
    const venue = venueName(m.venue_id);
    lines.push(`${esc(m.date)} ${m.time_utc} UTC`);
    lines.push(`  ${esc(home)} vs ${esc(away)}`);
    lines.push(`  ${esc(venue)} (${esc(m.round)})`);
    lines.push("");
  }

  return lines.join("\n");
}

function cmdGroup(args: string): string {
  if (!args) return "Usage: /group &lt;letter&gt;\nExample: /group C";

  const letter = args.toUpperCase();
  const group = groups.find((g) => g.id === letter);
  if (!group) return `Group "${esc(args)}" not found. Valid groups: A through L.`;

  const enriched = enrichGroup(group);
  const lines: string[] = [
    `<b>Group ${enriched.id}</b>`,
    "",
    "<b>Teams:</b>",
  ];

  for (const t of enriched.teams) {
    const ranking = t.fifa_ranking ? ` (#${t.fifa_ranking})` : "";
    lines.push(`  ${t.flag_emoji} ${esc(t.name)}${ranking}`);
  }

  lines.push("");
  lines.push("<b>Matches:</b>");
  for (const m of enriched.matches) {
    const em = m as Record<string, unknown>;
    lines.push(`${esc(String(em.date))} ${String(em.time_utc)} UTC`);
    lines.push(`  ${esc(String(em.home_team_name))} vs ${esc(String(em.away_team_name))}`);
    lines.push(`  ${esc(String(em.venue_name))}`);
    lines.push("");
  }

  lines.push("<b>Venues:</b>");
  for (const v of enriched.venues) {
    lines.push(`  ${esc(v.name)}, ${esc(v.city)}`);
  }

  return lines.join("\n");
}

function cmdCity(args: string): string {
  if (!args) return "Usage: /city &lt;name&gt;\nExample: /city dallas";

  const query = args.toLowerCase();
  let venue = venues.find((v) => v.id === query);
  let guide = venue ? cityGuides.find((g) => g.venue_id === venue!.id) : undefined;

  if (!venue) {
    venue = venues.find((v) => v.city.toLowerCase() === query);
    if (venue) guide = cityGuides.find((g) => g.venue_id === venue!.id);
  }
  if (!guide) {
    guide = cityGuides.find((g) => g.metro_area.toLowerCase() === query);
    if (guide) venue = venues.find((v) => v.id === guide!.venue_id);
  }
  if (!guide) {
    guide = cityGuides.find((g) => g.metro_area.toLowerCase().includes(query));
    if (guide) venue = venues.find((v) => v.id === guide!.venue_id);
  }
  if (!guide && !venue) {
    venue = venues.find((v) => v.city.toLowerCase().includes(query));
    if (venue) guide = cityGuides.find((g) => g.venue_id === venue!.id);
  }

  if (!venue || !guide) return `City "${esc(args)}" not found. Try a host city name like "dallas" or "miami".`;

  const lines: string[] = [
    `<b>${esc(guide.metro_area)}</b>`,
    "",
    esc(guide.highlights),
    "",
    `<b>Venue:</b> ${esc(venue.name)} (${venue.capacity.toLocaleString()} capacity)`,
    `<b>Getting There:</b> ${esc(guide.getting_there)}`,
  ];

  if (guide.food_and_drink.length > 0) {
    lines.push("");
    lines.push("<b>Food &amp; Drink:</b>");
    for (const f of guide.food_and_drink) lines.push(`  • ${esc(f)}`);
  }

  if (guide.things_to_do.length > 0) {
    lines.push("");
    lines.push("<b>Things to Do:</b>");
    for (const t of guide.things_to_do) lines.push(`  • ${esc(t)}`);
  }

  if (guide.local_tips.length > 0) {
    lines.push("");
    lines.push("<b>Tips:</b>");
    for (const t of guide.local_tips) lines.push(`  • ${esc(t)}`);
  }

  return lines.join("\n");
}

function cmdVenue(args: string): string {
  if (!args) return "Usage: /venue &lt;name&gt;\nExample: /venue metlife";

  const query = args.toLowerCase();
  const venue = venues.find(
    (v) => v.id === query || v.name.toLowerCase().includes(query) || v.city.toLowerCase().includes(query)
  );

  if (!venue) return `Venue "${esc(args)}" not found. Try a stadium or city name.`;

  const lines: string[] = [
    `<b>${esc(venue.name)}</b>`,
    "",
    `${esc(venue.city)}, ${esc(venue.state_province)}, ${venue.country}`,
    `Capacity: ${venue.capacity.toLocaleString()}`,
    `Timezone: ${venue.timezone}`,
    `Region: ${venue.region}`,
  ];

  if (venue.weather) {
    lines.push("");
    lines.push(`<b>Weather:</b> ${esc(venue.weather.description)}`);
    lines.push(`June: ${venue.weather.june_avg_high_f}°F / ${venue.weather.june_avg_low_f}°F`);
    lines.push(`July: ${venue.weather.july_avg_high_f}°F / ${venue.weather.july_avg_low_f}°F`);
  }

  if (venue.notable.length > 0) {
    lines.push("");
    lines.push("<b>Notable:</b>");
    for (const n of venue.notable) lines.push(`  • ${esc(n)}`);
  }

  return lines.join("\n");
}

function cmdHistory(args: string): string {
  if (!args) return "Usage: /history &lt;team1&gt; &lt;team2&gt;\nExample: /history argentina france";

  const parts = args.split(/\s+/);
  if (parts.length < 2) return "Please provide two team names.\nExample: /history argentina france";

  // Try splitting into two teams — handle multi-word names by trying different split points
  let teamA, teamB;
  for (let i = 1; i < parts.length; i++) {
    const a = resolveTeam(parts.slice(0, i).join(" "));
    const b = resolveTeam(parts.slice(i).join(" "));
    if (a && b) {
      teamA = a;
      teamB = b;
      break;
    }
  }

  if (!teamA || !teamB) return `Could not resolve both teams from "${esc(args)}". Try: /history brazil france`;
  if (teamA.id === teamB.id) return "Both inputs resolve to the same team.";

  const [first, second] = [teamA, teamB].sort((a, b) => a.id.localeCompare(b.id));
  const record = historicalMatchups.find((h) => h.team_a === first.id && h.team_b === second.id);

  const upcoming = matches.find(
    (m) =>
      (m.home_team_id === teamA.id && m.away_team_id === teamB.id) ||
      (m.home_team_id === teamB.id && m.away_team_id === teamA.id)
  );

  const lines: string[] = [
    `${first.flag_emoji} <b>${esc(first.name)}</b> vs ${second.flag_emoji} <b>${esc(second.name)}</b>`,
    "",
  ];

  if (!record) {
    lines.push("These teams have never met at a FIFA World Cup.");
  } else {
    lines.push(esc(record.summary));
    lines.push("");
    lines.push(`Matches: ${record.total_matches}`);
    lines.push(`${esc(first.name)} wins: ${record.team_a_wins}`);
    lines.push(`Draws: ${record.draws}`);
    lines.push(`${esc(second.name)} wins: ${record.team_b_wins}`);
    lines.push(`Goals: ${record.total_goals_team_a} – ${record.total_goals_team_b}`);

    if (record.meetings.length > 0) {
      lines.push("");
      lines.push("<b>Meetings:</b>");
      for (const m of record.meetings) {
        const pens = m.penalty_score ? ` (pens ${m.penalty_score})` : "";
        lines.push(`  ${m.year} ${esc(m.round)}: ${esc(m.score)}${pens}`);
      }
    }
  }

  if (upcoming) {
    lines.push("");
    lines.push(`<b>Upcoming 2026:</b> ${upcoming.date} ${upcoming.time_utc} UTC`);
    lines.push(`  ${esc(venueName(upcoming.venue_id))} (${esc(upcoming.round)})`);
  }

  return lines.join("\n");
}

function cmdVisa(args: string): string {
  if (!args) return "Usage: /visa &lt;team&gt;\nExample: /visa england";

  const resolved = resolveTeam(args);
  if (!resolved) return `Team "${esc(args)}" not found.`;

  const info = visaInfo.find((v) => v.team_id === resolved.id);
  if (!info) return `No visa data available for ${resolved.flag_emoji} ${esc(resolved.name)}.`;

  const lines: string[] = [
    `${resolved.flag_emoji} <b>${esc(resolved.name)} — Visa Info</b>`,
    "",
    `Nationality: ${esc(info.nationality)}`,
    `Passport: ${esc(info.passport_country)}`,
    "",
  ];

  for (const req of info.entry_requirements) {
    lines.push(`<b>${req.country}:</b> ${esc(req.requirement)}`);
    lines.push(`  ${esc(req.document)} (${req.max_stay_days} days)`);
    if (req.note) lines.push(`  ${esc(req.note)}`);
    lines.push("");
  }

  return lines.join("\n");
}

function cmdFanzones(args: string): string {
  if (!args) return "Usage: /fanzones &lt;city&gt;\nExample: /fanzones miami";

  const query = args.toLowerCase();
  let results = fanZones.filter((fz) => fz.city.toLowerCase().includes(query));

  if (results.length === 0) {
    const matchingVenue = venues.find(
      (v) => v.city.toLowerCase().includes(query) || v.name.toLowerCase().includes(query)
    );
    if (matchingVenue) {
      results = fanZones.filter((fz) => fz.venue_id === matchingVenue.id);
    }
  }

  if (results.length === 0) return `No fan zones found for "${esc(args)}".`;

  const lines: string[] = [
    `<b>Fan Zones — ${esc(args)}</b>`,
    `${results.length} location(s) found`,
    "",
  ];

  for (const fz of results) {
    lines.push(`<b>${esc(fz.name)}</b>`);
    lines.push(`${esc(fz.location)}, ${esc(fz.city)}`);
    if (fz.address) lines.push(`${esc(fz.address)}`);
    lines.push(`Capacity: ${fz.capacity.toLocaleString()} | ${fz.free_entry ? "Free entry" : "Paid entry"}`);
    lines.push(`Hours: ${esc(fz.hours)}`);
    if (fz.highlights) lines.push(esc(fz.highlights));
    lines.push("");
  }

  return lines.join("\n");
}

function cmdNews(args: string): string {
  if (news.length === 0) return "No news articles available yet. Check back soon!";

  const validCategories = new Set([
    "roster", "venue", "schedule", "injury", "analysis",
    "transfer", "qualifying", "fan-content", "logistics", "general",
  ]);

  let filtered = news;
  let filterLabel = "";

  if (args) {
    // Try team resolution first
    const resolved = resolveTeam(args);
    if (resolved) {
      filtered = news.filter((n) => n.related_teams.includes(resolved.id));
      filterLabel = ` — ${resolved.flag_emoji} ${resolved.name}`;
    } else if (validCategories.has(args.toLowerCase())) {
      // Fall back to category match
      const cat = args.toLowerCase();
      filtered = news.filter((n) => n.categories.includes(cat as any));
      filterLabel = ` — ${cat}`;
    } else {
      return `No match for "${esc(args)}". Try a team name or category (${[...validCategories].join(", ")}).`;
    }
  }

  if (filtered.length === 0) {
    return `No news found${filterLabel}. Try /news without a filter.`;
  }

  const top = filtered.slice(0, 5);
  const lines: string[] = [
    `<b>WC2026 News${esc(filterLabel)}</b>`,
    "",
  ];

  for (const n of top) {
    lines.push(`<b>${esc(n.title)}</b>`);
    lines.push(esc(n.summary));
    lines.push(`${esc(n.source)} · ${n.date} · <a href="${esc(n.url)}">Read more</a>`);
    lines.push("");
  }

  if (filtered.length > 5) {
    lines.push(`Showing 5 of ${filtered.length} articles.`);
  }

  return lines.join("\n");
}

function cmdInjuries(args: string): string {
  let filtered = injuries;
  let filterLabel = "";

  if (args) {
    const resolved = resolveTeam(args);
    if (resolved) {
      filtered = injuries.filter((i) => i.team_id === resolved.id);
      filterLabel = ` — ${resolved.flag_emoji} ${resolved.name}`;
    } else {
      const validStatuses = ["out", "doubtful", "recovering", "fit"];
      if (validStatuses.includes(args.toLowerCase())) {
        filtered = injuries.filter((i) => i.status === args.toLowerCase());
        filterLabel = ` — ${args.toLowerCase()}`;
      } else {
        return `No match for "${esc(args)}". Try a team name or status (out, doubtful, recovering, fit).`;
      }
    }
  }

  if (filtered.length === 0) {
    return `No injuries found${filterLabel}. ${args ? "Try /injuries without a filter." : "All tracked players appear fit."}`;
  }

  const statusEmoji: Record<string, string> = { out: "🔴", doubtful: "🟡", recovering: "🟠", fit: "🟢" };

  const lines: string[] = [
    `<b>Injury Report${esc(filterLabel)}</b>`,
    `${filtered.length} player(s) tracked`,
    "",
  ];

  for (const i of filtered) {
    const team = teams.find((t) => t.id === i.team_id);
    const flag = team?.flag_emoji ?? "";
    lines.push(`${statusEmoji[i.status] ?? "⚪"} <b>${esc(i.player)}</b> (${flag} ${esc(team?.name ?? i.team_id)})`);
    lines.push(`  ${esc(i.injury)}`);
    lines.push(`  Status: ${i.status} · Return: ${esc(i.expected_return)}`);
    lines.push("");
  }

  return lines.join("\n");
}

function cmdOdds(args: string): string {
  const category = args?.toLowerCase() || "winner";

  if (category === "winner" || category === "favorites") {
    const lines: string[] = [
      "<b>Tournament Winner Odds</b>",
      `Source: ${esc(tournamentOdds.source)}`,
      "",
    ];
    for (const o of tournamentOdds.tournament_winner) {
      const team = teams.find((t) => t.id === o.team_id);
      lines.push(`${team?.flag_emoji ?? ""} ${esc(team?.name ?? o.team_id)} — ${o.odds} (${o.implied_probability})`);
    }
    return lines.join("\n");
  }

  if (category === "golden_boot" || category === "boot" || category === "goals") {
    const lines: string[] = [
      "<b>Golden Boot Favorites</b>",
      "",
    ];
    for (const o of tournamentOdds.golden_boot) {
      const team = teams.find((t) => t.id === o.team_id);
      lines.push(`${team?.flag_emoji ?? ""} <b>${esc(o.player)}</b> (${esc(team?.name ?? o.team_id)}) — ${o.odds}`);
    }
    return lines.join("\n");
  }

  if (category.startsWith("group")) {
    const groupLetter = category.replace("group", "").replace(/\s+/g, "").toUpperCase();
    let preds = tournamentOdds.group_predictions;
    if (groupLetter) {
      preds = preds.filter((g) => g.group === groupLetter);
    }
    if (preds.length === 0) return `No group prediction found for "${esc(args)}". Try: /odds group A`;

    const lines: string[] = [
      `<b>Group Predictions${groupLetter ? ` — Group ${groupLetter}` : ""}</b>`,
      "",
    ];
    for (const g of preds) {
      const favs = g.favorites.map((f) => { const t = teams.find((t) => t.id === f); return t ? `${t.flag_emoji} ${t.name}` : f; }).join(", ");
      const dh = (() => { const t = teams.find((t) => t.id === g.dark_horse); return t ? `${t.flag_emoji} ${t.name}` : g.dark_horse; })();
      lines.push(`<b>Group ${g.group}</b>`);
      lines.push(`  Favorites: ${esc(favs)}`);
      lines.push(`  Dark horse: ${esc(dh)}`);
      lines.push(`  ${esc(g.narrative)}`);
      lines.push("");
    }
    return lines.join("\n");
  }

  if (category === "dark_horses" || category === "dark" || category === "darkhorses") {
    const lines: string[] = [
      "<b>Dark Horse Picks</b>",
      "",
    ];
    for (const d of tournamentOdds.dark_horses) {
      const team = teams.find((t) => t.id === d.team_id);
      lines.push(`${team?.flag_emoji ?? ""} <b>${esc(team?.name ?? d.team_id)}</b>`);
      lines.push(`  ${esc(d.reason)}`);
      lines.push("");
    }
    return lines.join("\n");
  }

  return [
    "<b>Odds Categories</b>",
    "",
    "/odds winner — Tournament winner odds",
    "/odds golden_boot — Golden Boot favorites",
    "/odds group A — Group predictions (A-L)",
    "/odds dark_horses — Dark horse picks",
  ].join("\n");
}

function cmdStandings(args: string): string {
  let targetGroups = groups;
  let filterLabel = "";

  if (args) {
    const gid = args.toUpperCase();
    targetGroups = groups.filter((g) => g.id === gid);
    if (targetGroups.length === 0) return `Group "${esc(args)}" not found. Valid groups: A through L.`;
    filterLabel = ` — Group ${gid}`;
  }

  const lines: string[] = [
    `<b>Group Power Rankings${esc(filterLabel)}</b>`,
    "",
  ];

  for (const g of targetGroups) {
    const groupTeams = g.teams
      .map((tid) => teams.find((t) => t.id === tid))
      .filter(Boolean) as typeof teams;

    const ranked = groupTeams.map((t) => {
      const winnerOdds = tournamentOdds.tournament_winner.find((o) => o.team_id === t.id);
      const ranking = t.fifa_ranking ?? 100;
      const oddsBoost = winnerOdds
        ? Math.max(0, 50 - parseFloat(winnerOdds.implied_probability))
        : 50;
      return { ...t, powerScore: ranking + oddsBoost, winnerOdds };
    }).sort((a, b) => a.powerScore - b.powerScore);

    const groupPred = tournamentOdds.group_predictions.find((gp) => gp.group === g.id);

    lines.push(`<b>Group ${g.id}</b>`);
    for (let i = 0; i < ranked.length; i++) {
      const t = ranked[i];
      const rankStr = t.fifa_ranking ? `#${t.fifa_ranking}` : "—";
      const oddsStr = t.winnerOdds ? ` · ${t.winnerOdds.odds}` : "";
      lines.push(`  ${i + 1}. ${t.flag_emoji} ${esc(t.name)} (${rankStr}${oddsStr})`);
    }
    if (groupPred) {
      lines.push(`  💡 ${esc(groupPred.narrative)}`);
    }
    lines.push("");
  }

  if (!args) {
    lines.push("Filter by group: /standings A");
  }

  return lines.join("\n");
}

function cmdBracket(args: string): string {
  const knockoutRounds = [
    "Round of 32", "Round of 16", "Quarter-final", "Semi-final",
    "Third-place play-off", "Final",
  ];

  function describePlaceholder(p: string | undefined): string {
    if (!p) return "TBD";
    if (p.startsWith("W")) return `W${p.slice(1)}`;
    if (p.startsWith("L")) return `L${p.slice(1)}`;
    if (/^[12][A-L]$/.test(p)) {
      return p[0] === "1" ? `1st ${p[1]}` : `2nd ${p[1]}`;
    }
    if (p.startsWith("3")) return `3rd ${p.slice(1)}`;
    return p;
  }

  const knockoutMatches = matches.filter((m) =>
    knockoutRounds.includes(m.round)
  );

  // Determine which round(s) to show
  let targetRound = "";
  if (args) {
    const q = args.toLowerCase();
    const roundMap: Record<string, string> = {
      "r32": "Round of 32", "32": "Round of 32", "round of 32": "Round of 32",
      "r16": "Round of 16", "16": "Round of 16", "round of 16": "Round of 16",
      "qf": "Quarter-final", "quarter": "Quarter-final", "quarterfinal": "Quarter-final", "quarter-final": "Quarter-final",
      "sf": "Semi-final", "semi": "Semi-final", "semifinal": "Semi-final", "semi-final": "Semi-final",
      "3rd": "Third-place play-off", "third": "Third-place play-off", "third-place": "Third-place play-off",
      "final": "Final", "f": "Final",
    };
    targetRound = roundMap[q] ?? "";
    if (!targetRound) return `Round "${esc(args)}" not found. Try: r32, r16, qf, sf, final`;
  }

  if (targetRound) {
    const roundMatches = knockoutMatches.filter((m) => m.round === targetRound);
    if (roundMatches.length === 0) return `No matches found for ${esc(targetRound)}.`;

    const lines: string[] = [
      `<b>${esc(targetRound)}</b>`,
      `${roundMatches.length} match(es)`,
      "",
    ];

    for (const m of roundMatches) {
      const home = m.home_team_id ? teamName(m.home_team_id) : describePlaceholder(m.home_placeholder);
      const away = m.away_team_id ? teamName(m.away_team_id) : describePlaceholder(m.away_placeholder);
      const venue = venueName(m.venue_id);
      lines.push(`M${m.match_number}: ${esc(home)} vs ${esc(away)}`);
      lines.push(`  ${esc(m.date)} ${m.time_utc} UTC · ${esc(venue)}`);
      lines.push("");
    }

    return lines.join("\n");
  }

  // Default: show key dates + bracket entry points from each group
  const lines: string[] = [
    "<b>Knockout Bracket</b>",
    "",
    "<b>Key Dates:</b>",
    "  R32: June 29 – July 3",
    "  R16: July 4 – 7",
    "  QF: July 9 – 11",
    "  SF: July 14 – 15",
    "  3rd: July 18",
    "  Final: July 19 (MetLife Stadium)",
    "",
    "<b>Group → R32 Entry:</b>",
  ];

  for (const g of groups) {
    const winnerId = `1${g.id}`;
    const runnerUpId = `2${g.id}`;
    const winnerMatch = knockoutMatches.find(
      (m) => m.home_placeholder === winnerId || m.away_placeholder === winnerId
    );
    const runnerUpMatch = knockoutMatches.find(
      (m) => m.home_placeholder === runnerUpId || m.away_placeholder === runnerUpId
    );
    const winStr = winnerMatch ? `M${winnerMatch.match_number}` : "?";
    const runStr = runnerUpMatch ? `M${runnerUpMatch.match_number}` : "?";
    lines.push(`  Group ${g.id}: 1st → ${winStr}, 2nd → ${runStr}`);
  }

  lines.push("");
  lines.push("Filter by round: /bracket r32, /bracket qf, /bracket final");

  return lines.join("\n");
}

function cmdSchedule(): string {
  const today = new Date().toISOString().slice(0, 10);
  const threeDaysOut = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);

  const upcoming = matches.filter((m) => m.date >= today && m.date <= threeDaysOut);

  if (upcoming.length === 0) {
    // Show next 5 matches regardless of date
    const next = matches.filter((m) => m.date >= today).slice(0, 5);
    if (next.length === 0) return "No upcoming matches scheduled.";

    const lines: string[] = ["<b>Next Matches</b>", ""];
    for (const m of next) {
      lines.push(`${esc(m.date)} ${m.time_utc} UTC`);
      lines.push(`  ${esc(teamName(m.home_team_id))} vs ${esc(teamName(m.away_team_id))}`);
      lines.push(`  ${esc(venueName(m.venue_id))} (${esc(m.round)})`);
      lines.push("");
    }
    return lines.join("\n");
  }

  const lines: string[] = ["<b>Schedule — Next 3 Days</b>", ""];

  let currentDate = "";
  for (const m of upcoming) {
    if (m.date !== currentDate) {
      if (currentDate) lines.push("");
      lines.push(`<b>${esc(m.date)}</b>`);
      currentDate = m.date;
    }
    lines.push(`  ${m.time_utc} UTC — ${esc(teamName(m.home_team_id))} vs ${esc(teamName(m.away_team_id))}`);
    lines.push(`  ${esc(venueName(m.venue_id))}`);
  }

  return lines.join("\n");
}

// ── Route commands ──

function handleCommand(command: string, args: string): string {
  switch (command) {
    case "/start":
    case "/help":
      return cmdStart();
    case "/brief":
      return cmdBrief();
    case "/news":
      return cmdNews(args);
    case "/team":
      return cmdTeam(args);
    case "/matches":
      return cmdMatches(args);
    case "/group":
      return cmdGroup(args);
    case "/city":
      return cmdCity(args);
    case "/venue":
      return cmdVenue(args);
    case "/history":
      return cmdHistory(args);
    case "/visa":
      return cmdVisa(args);
    case "/fanzones":
      return cmdFanzones(args);
    case "/injuries":
      return cmdInjuries(args);
    case "/odds":
      return cmdOdds(args);
    case "/standings":
      return cmdStandings(args);
    case "/bracket":
      return cmdBracket(args);
    case "/schedule":
      return cmdSchedule();
    default:
      return `Unknown command. Type /help to see available commands.`;
  }
}

// ── Webhook handler ──

export default async function (req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(200).json({ ok: true, method: "GET not supported. This is a Telegram webhook endpoint." });
  }

  if (!TOKEN) {
    return res.status(500).json({ error: "TELEGRAM_BOT_TOKEN not configured." });
  }

  try {
    const update = req.body;
    const message = update?.message;

    if (!message?.text || !message?.chat?.id) {
      return res.status(200).json({ ok: true });
    }

    const { command, args } = parseCommand(message.text);

    if (!command.startsWith("/")) {
      return res.status(200).json({ ok: true });
    }

    const response = handleCommand(command, args);
    await sendMessage(message.chat.id, response);
  } catch {
    // Always return 200 to Telegram to prevent retries
  }

  return res.status(200).json({ ok: true });
}
