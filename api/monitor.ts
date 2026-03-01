// Consolidated endpoint for the WC26 Monitor dashboard.
// Returns news, injuries, and odds in a single response to stay within
// the Vercel Hobby 12-function limit.
import { handler, news, injuries, tournamentOdds, teams } from "./_helpers.js";

function teamName(id: string): string {
  const t = teams.find((t) => t.id === id);
  return t ? `${t.flag_emoji} ${t.name}` : id;
}

export default handler(async (_req, res) => {
  const activeInjuries = injuries.filter((i) => i.status !== "fit");

  const oddsWithNames = {
    last_updated: tournamentOdds.last_updated,
    source: tournamentOdds.source,
    tournament_winner: tournamentOdds.tournament_winner.map((o) => ({ ...o, team_name: teamName(o.team_id) })),
    golden_boot: tournamentOdds.golden_boot.map((o) => ({ ...o, team_name: teamName(o.team_id) })),
    dark_horses: tournamentOdds.dark_horses.map((d) => ({ ...d, team_name: teamName(d.team_id) })),
    group_predictions: tournamentOdds.group_predictions.map((g) => ({
      ...g,
      favorite_names: g.favorites.map(teamName),
      dark_horse_name: teamName(g.dark_horse),
    })),
  };

  res.json({
    news: news.slice(0, 20),
    injuries: {
      injuries: activeInjuries,
      summary: {
        out: activeInjuries.filter((i) => i.status === "out").length,
        doubtful: activeInjuries.filter((i) => i.status === "doubtful").length,
        recovering: activeInjuries.filter((i) => i.status === "recovering").length,
      },
    },
    odds: oddsWithNames,
  });
});
