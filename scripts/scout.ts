#!/usr/bin/env npx tsx

/**
 * WC26 Scout Agent
 *
 * Fetches World Cup 2026 news from RSS feeds and Reddit,
 * summarizes with Claude Haiku, and writes structured data to src/data/news.ts.
 *
 * Usage: npx tsx scripts/scout.ts
 * Env: ANTHROPIC_API_KEY (required)
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import RssParser from "rss-parser";

import { teams } from "../src/data/teams.js";
import type { NewsItem, NewsCategory } from "../src/types/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const NEWS_FILE = resolve(__dirname, "../src/data/news.ts");

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  console.error("Error: ANTHROPIC_API_KEY environment variable is required");
  process.exit(1);
}

// ── WC2026 relevance keywords ──────────────────────────────────────

const WC_KEYWORDS = [
  "world cup 2026", "wc 2026", "wc2026", "fifa 2026",
  "world cup 26", "copa del mundo 2026",
  "united 2026", "united states mexico canada",
  // Host cities / venues
  "metlife stadium", "sofi stadium", "at&t stadium", "azteca",
  "hard rock stadium", "nrg stadium", "gillette stadium",
  "lumen field", "mercedes-benz stadium", "lincoln financial",
  "arrowhead stadium", "bmo field", "bc place",
  // General WC terms when combined with football context
  "world cup qualif", "world cup roster", "world cup squad",
  "world cup draw", "world cup group", "world cup venue",
  "world cup ticket", "world cup schedule", "world cup fixture",
];

function isWC2026Relevant(title: string, description: string): boolean {
  const text = `${title} ${description}`.toLowerCase();
  return WC_KEYWORDS.some((kw) => text.includes(kw));
}

// ── Deterministic ID ───────────────────────────────────────────────

function makeId(url: string): string {
  return createHash("sha256").update(url).digest("hex").slice(0, 12);
}

// ── RSS feed fetching ──────────────────────────────────────────────

interface RawArticle {
  title: string;
  url: string;
  date: string; // YYYY-MM-DD
  description: string;
  source: string;
}

async function fetchRSS(feedUrl: string, source: string): Promise<RawArticle[]> {
  const parser = new RssParser();
  try {
    const feed = await parser.parseURL(feedUrl);
    return (feed.items ?? [])
      .filter((item) => item.title && item.link)
      .map((item) => ({
        title: item.title!,
        url: item.link!,
        date: item.pubDate
          ? new Date(item.pubDate).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10),
        description: item.contentSnippet ?? item.content ?? "",
        source,
      }));
  } catch (err) {
    console.warn(`Warning: Failed to fetch RSS from ${feedUrl}:`, (err as Error).message);
    return [];
  }
}

// ── Reddit fetching ────────────────────────────────────────────────

interface RedditPost {
  data: {
    title: string;
    url: string;
    permalink: string;
    created_utc: number;
    selftext: string;
    score: number;
    is_self: boolean;
  };
}

async function fetchReddit(endpoint: string, source: string, minScore: number): Promise<RawArticle[]> {
  try {
    const res = await fetch(endpoint, {
      headers: { "User-Agent": "wc26-scout/1.0" },
    });
    if (!res.ok) {
      console.warn(`Warning: Reddit returned ${res.status} for ${endpoint}`);
      return [];
    }
    const json = await res.json() as { data?: { children?: RedditPost[] } };
    const posts = json.data?.children ?? [];
    return posts
      .filter((p) => p.data.score >= minScore)
      .map((p) => ({
        title: p.data.title,
        url: p.data.is_self
          ? `https://reddit.com${p.data.permalink}`
          : p.data.url,
        date: new Date(p.data.created_utc * 1000).toISOString().slice(0, 10),
        description: p.data.selftext?.slice(0, 500) ?? "",
        source,
      }));
  } catch (err) {
    console.warn(`Warning: Failed to fetch Reddit ${endpoint}:`, (err as Error).message);
    return [];
  }
}

// ── Claude Haiku summarization ─────────────────────────────────────

const VALID_CATEGORIES: NewsCategory[] = [
  "roster", "venue", "schedule", "injury", "analysis",
  "transfer", "qualifying", "fan-content", "logistics", "general",
];

const TEAM_IDS = teams
  .filter((t) => t.code !== "TBD")
  .map((t) => t.id);

interface HaikuResult {
  summary: string;
  categories: NewsCategory[];
  related_teams: string[];
}

async function summarizeWithHaiku(article: RawArticle): Promise<HaikuResult> {
  const prompt = `You are analyzing a news article about FIFA World Cup 2026. Return a JSON object with exactly these fields:

- "summary": A 1-2 sentence summary of the article's key point about the World Cup.
- "categories": An array of 1-3 categories from this list: ${VALID_CATEGORIES.join(", ")}
- "related_teams": An array of team IDs (lowercase 3-letter) from this list that the article mentions: ${TEAM_IDS.join(", ")}. Empty array if no specific teams mentioned.

Article title: ${article.title}
Article text: ${article.description.slice(0, 1000)}
Source: ${article.source}

Respond with ONLY the JSON object, no markdown formatting.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`Warning: Claude API returned ${res.status}: ${errText.slice(0, 200)}`);
      return fallbackResult(article);
    }

    const data = await res.json() as {
      content: Array<{ type: string; text?: string }>;
    };

    const text = data.content?.[0]?.text ?? "";
    const parsed = JSON.parse(text) as HaikuResult;

    return {
      summary: parsed.summary || article.title,
      categories: (parsed.categories || ["general"]).filter((c) =>
        VALID_CATEGORIES.includes(c)
      ) as NewsCategory[],
      related_teams: (parsed.related_teams || []).filter((t) =>
        TEAM_IDS.includes(t)
      ),
    };
  } catch (err) {
    console.warn(`Warning: Haiku summarization failed for "${article.title}":`, (err as Error).message);
    return fallbackResult(article);
  }
}

function fallbackResult(article: RawArticle): HaikuResult {
  return {
    summary: article.title,
    categories: ["general"],
    related_teams: [],
  };
}

// ── Load existing news ─────────────────────────────────────────────

function loadExistingNews(): NewsItem[] {
  try {
    const content = readFileSync(NEWS_FILE, "utf-8");
    // Extract the array content between the brackets
    const match = content.match(/export const news: NewsItem\[\] = (\[[\s\S]*\]);/);
    if (!match) return [];
    // Use Function constructor to safely evaluate the array literal
    return JSON.parse(match[1]) as NewsItem[];
  } catch {
    return [];
  }
}

// ── Write news file ────────────────────────────────────────────────

function writeNewsFile(items: NewsItem[]): void {
  const content = `import type { NewsItem } from "../types/index.js";

export const news: NewsItem[] = ${JSON.stringify(items, null, 2)};
`;
  writeFileSync(NEWS_FILE, content, "utf-8");
}

// ── Main pipeline ──────────────────────────────────────────────────

async function main() {
  console.log("🔍 WC26 Scout Agent starting...\n");

  // 1. Load existing news
  const existing = loadExistingNews();
  const existingUrls = new Set(existing.map((n) => n.url));
  console.log(`📋 Loaded ${existing.length} existing articles`);

  // 2. Fetch from all sources in parallel
  console.log("📡 Fetching from sources...");
  const [espn, bbc, redditWC, redditSoccer] = await Promise.all([
    fetchRSS("https://www.espn.com/espn/rss/soccer/news", "ESPN"),
    fetchRSS("https://feeds.bbci.co.uk/sport/football/rss.xml", "BBC Sport"),
    fetchReddit(
      "https://www.reddit.com/r/worldcup/hot.json?limit=25",
      "Reddit r/worldcup",
      50
    ),
    fetchReddit(
      "https://www.reddit.com/r/soccer/search.json?q=world+cup+2026&sort=new&limit=25&restrict_sr=on",
      "Reddit r/soccer",
      50
    ),
  ]);

  console.log(`  ESPN: ${espn.length} items`);
  console.log(`  BBC Sport: ${bbc.length} items`);
  console.log(`  Reddit r/worldcup: ${redditWC.length} items`);
  console.log(`  Reddit r/soccer: ${redditSoccer.length} items`);

  // 3. Combine and filter
  const allArticles = [...espn, ...bbc, ...redditWC, ...redditSoccer];

  // Reddit r/worldcup posts are assumed relevant; others need keyword match
  const relevant = allArticles.filter((a) => {
    if (a.source.startsWith("Reddit r/worldcup")) return true;
    return isWC2026Relevant(a.title, a.description);
  });

  // 4. Dedup against existing
  const newArticles = relevant.filter((a) => !existingUrls.has(a.url));
  console.log(`\n🆕 ${newArticles.length} new relevant articles (after dedup)`);

  if (newArticles.length === 0) {
    console.log("✅ No new articles to process. Done.");
    return;
  }

  // 5. Limit to ~20 per run
  const batch = newArticles.slice(0, 20);
  console.log(`📝 Processing ${batch.length} articles with Claude Haiku...\n`);

  // 6. Summarize each article
  const now = new Date().toISOString();
  const newItems: NewsItem[] = [];

  for (const article of batch) {
    const result = await summarizeWithHaiku(article);
    newItems.push({
      id: makeId(article.url),
      title: article.title,
      date: article.date,
      source: article.source,
      url: article.url,
      summary: result.summary,
      categories: result.categories.length > 0 ? result.categories : ["general"],
      related_teams: result.related_teams,
      fetched_at: now,
    });
    console.log(`  ✓ ${article.title.slice(0, 60)}...`);
  }

  // 7. Merge, prune old (>30 days), sort by date desc
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000)
    .toISOString()
    .slice(0, 10);

  const merged = [...newItems, ...existing]
    .filter((n) => n.date >= thirtyDaysAgo)
    .sort((a, b) => b.date.localeCompare(a.date));

  // 8. Write
  writeNewsFile(merged);
  console.log(`\n✅ Wrote ${merged.length} articles to src/data/news.ts`);
  console.log(`   (${newItems.length} new, ${merged.length - newItems.length} existing, pruned items older than ${thirtyDaysAgo})`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
