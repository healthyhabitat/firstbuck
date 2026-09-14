import type { IdeaInput, OfferPack, PriceBand, ProjectStatus } from "./types";

/** Simple deterministic hash for seeding template choices */
export function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(arr: readonly T[], seed: number, salt = 0): T {
  return arr[(seed + salt) % arr.length];
}

function cleanIdea(raw: string): string {
  return raw.trim().replace(/\s+/g, " ").replace(/[.!?]+$/, "");
}

const PRESERVE_CASE: Record<string, string> = {
  b2b: "B2B",
  os: "OS",
  ai: "AI",
  pdf: "PDF",
  faq: "FAQ",
  linkedin: "LinkedIn",
  notion: "Notion",
  gumroad: "Gumroad",
  ios: "iOS",
  api: "API",
  seo: "SEO",
  ui: "UI",
  ux: "UX",
  figma: "Figma",
  gpt: "GPT",
  saas: "SaaS",
};

const SMALL_WORDS = new Set(["for", "of", "and", "the", "a", "an", "to", "in", "on", "or"]);

function titleWord(w: string, index = 0): string {
  if (w.includes("-")) {
    return w.split("-").map((p, i) => titleWord(p, index + i)).join("-");
  }
  const lower = w.toLowerCase();
  if (PRESERVE_CASE[lower]) return PRESERVE_CASE[lower];
  if (index > 0 && SMALL_WORDS.has(lower)) return lower;
  if (/[0-9]/.test(w) && /^[A-Za-z0-9]+$/.test(w)) return w.toUpperCase();
  return w.length ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w;
}

function titleCase(s: string): string {
  return s
    .split(/\s+/)
    .filter(Boolean)
    .map((w, i) => titleWord(w, i))
    .join(" ");
}

function singular(w: string): string {
  const lower = w.toLowerCase();
  if (lower.endsWith("ies") && lower.length > 4) return w.slice(0, -3) + "y";
  if (/(sses|shes|ches|xes)$/i.test(w)) return w.slice(0, -2);
  if (lower.endsWith("s") && !lower.endsWith("ss") && lower.length > 3) return w.slice(0, -1);
  return w;
}

function toInfinitive(verb: string): string {
  const v = verb.toLowerCase();
  if (["this", "that", "was", "its", "use", "get", "has", "his", "is", "as"].includes(v)) {
    return v === "is" ? "be" : v;
  }
  if (v === "are") return "be";
  if (v.endsWith("ies") && v.length > 4) return v.slice(0, -3) + "y";
  if (/(ses|zes|xes|ches|shes)$/.test(v) && v.length > 4) return v.slice(0, -2);
  if (v.endsWith("s") && !v.endsWith("ss") && v.length > 3) return v.slice(0, -1);
  return v;
}

function sentenceCase(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function defaultAction(kind: ProductKind): string {
  switch (kind) {
    case "notion_template":
      return "run their work from a ready-to-duplicate Notion workspace";
    case "chrome_extension":
      return "handle the repetitive clicks in-browser";
    case "template":
      return "start from a proven template instead of a blank page";
    case "app":
      return "get the job done with a focused tool";
    default:
      return "get a focused result this week";
  }
}

function toGerund(verb: string): string {
  const v = toInfinitive(verb);
  if (v.endsWith("ie")) return v.slice(0, -2) + "ying";
  if (v.endsWith("e") && !v.endsWith("ee") && v !== "be") return v.slice(0, -1) + "ing";
  if (/[aeiou][b-df-hj-np-tv-z]$/.test(v) && v.length <= 4) return v + v[v.length - 1] + "ing";
  return v + "ing";
}

const STOP = new Set([
  "a", "an", "the", "for", "to", "of", "and", "or", "with", "that", "this",
  "my", "i", "want", "build", "make", "create", "help", "helps", "helping",
  "people", "users", "who", "can", "will", "just", "like", "from", "into",
  "about", "so", "they", "their", "your", "you", "do", "not", "dont", "does",
  "did", "is", "are", "be", "been", "being", "it", "its", "in", "on", "at",
  "by", "as", "if", "when", "while", "than", "then", "also", "using", "use",
  "used", "via", "without", "within", "which", "whose", "have", "has", "had",
  "get", "gets", "got", "let", "lets", "able", "them", "more", "most", "very",
  "really", "were", "was", "been",
]);

const FORMAT_WORDS = new Set([
  "notion", "template", "templates", "chrome", "extension", "extensions",
  "browser", "plugin", "plugins", "app", "apps", "tool", "tools", "saas",
  "platform", "website", "site", "spreadsheet", "airtable", "checklist",
  "playbook", "guide", "ebook", "pdf", "course", "workshop", "pack", "bundle",
  "kit", "system", "prompt", "prompts", "gpt", "dashboard", "software",
  "product", "digital", "online",
]);

const ADVERBS = new Set([
  "faster", "better", "easily", "automatically", "quickly", "simply",
  "effectively", "instantly",
]);

const WEAK_ADJECTIVES = new Set([
  "personalized", "personalised", "ready", "simple", "custom", "complete",
  "quick", "easy", "new", "best", "small", "tiny",
]);

export type ProductKind =
  | "notion_template"
  | "template"
  | "chrome_extension"
  | "spreadsheet"
  | "checklist"
  | "guide"
  | "course"
  | "prompt_pack"
  | "ebook"
  | "app"
  | "generic";

export function detectProductKind(idea: string): ProductKind {
  const l = idea.toLowerCase();
  if (/\bnotion\b/.test(l)) return "notion_template";
  if (/\bchrome\s*extension\b|\bbrowser\s*extension\b/.test(l)) return "chrome_extension";
  if (/\bextension\b/.test(l) && /\b(linkedin|chrome|browser|web)\b/.test(l)) {
    return "chrome_extension";
  }
  if (/\b(prompt pack|gpt prompts?|chatgpt prompts?)\b/.test(l)) return "prompt_pack";
  if (/\b(spreadsheet|google sheet|airtable)\b/.test(l)) return "spreadsheet";
  if (/\bchecklist\b/.test(l)) return "checklist";
  if (/\b(ebook|pdf)\b/.test(l)) return "ebook";
  if (/\b(playbook|guide)\b/.test(l)) return "guide";
  if (/\b(course|workshop)\b/.test(l)) return "course";
  if (/\btemplates?\b/.test(l)) return "template";
  if (/\b(extension|plugin)\b/.test(l)) return "chrome_extension";
  if (/\b(app|saas|dashboard|tool|planner)\b/.test(l)) return "app";
  return "generic";
}

function kindLabel(kind: ProductKind): string {
  switch (kind) {
    case "notion_template":
      return "Notion template";
    case "chrome_extension":
      return "Chrome extension";
    case "template":
      return "template pack";
    case "spreadsheet":
      return "spreadsheet";
    case "checklist":
      return "checklist";
    case "guide":
      return "guide";
    case "course":
      return "mini-course";
    case "prompt_pack":
      return "prompt pack";
    case "ebook":
      return "ebook";
    case "app":
      return "tool";
    default:
      return "kit";
  }
}

const AGENT_NOUN: Record<string, string> = {
  track: "Tracker",
  write: "Writer",
  draft: "Drafter",
  plan: "Planner",
  organize: "Organizer",
  manage: "Manager",
  generate: "Generator",
  automate: "Automation",
  invoice: "Kit",
  learn: "Guide",
  teach: "Guide",
  find: "Finder",
  search: "Search",
  capture: "Capture",
  collect: "Collector",
  review: "Reviewer",
  send: "Sender",
  remind: "Reminders",
  book: "Booker",
  schedule: "Scheduler",
  monitor: "Monitor",
  analyze: "Analyzer",
  summarise: "Summarizer",
  summarize: "Summarizer",
  translate: "Translator",
  record: "Log",
  log: "Log",
  share: "Share Kit",
  help: "Kit",
};

export interface ParsedIdea {
  raw: string;
  kind: ProductKind;
  kindLabel: string;
  audience: string;
  action: string;
  actionIng: string;
  soClause: string;
  outcome: string;
  pain: string;
  verb: string;
  objectPhrase: string;
  coreName: string;
  nameCandidates: string[];
}

function significantWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter(
      (w) =>
        w.length > 1 &&
        !STOP.has(w) &&
        !FORMAT_WORDS.has(w) &&
        !ADVERBS.has(w)
    );
}

function inferAudience(idea: string, audience?: string): string {
  if (audience?.trim()) return audience.trim();
  const lower = idea.toLowerCase();
  if (/writer|blog|content|newsletter/.test(lower)) return "writers and newsletter creators";
  if (/design|ui|figma/.test(lower)) return "designers shipping faster";
  if (/parent/.test(lower)) return "busy parents";
  if (/founder|startup|side.?project/.test(lower)) return "founders validating ideas";
  if (/developer|dev|code|api/.test(lower)) return "indie makers and solo developers";
  if (/market|seo|ads|growth/.test(lower)) return "marketers testing channels";
  if (/student|learn|course|tutor/.test(lower)) return "learners who want a shortcut";
  if (/freelance|client|agency/.test(lower)) return "freelancers landing new clients";
  if (/coach|consult/.test(lower)) return "coaches who want a repeatable system";
  return "busy people who want a done-for-you shortcut";
}

function splitOutcome(idea: string): { body: string; rawOutcome: string } {
  const soThat = idea.match(/^(.*?)\s+so that\s+(.+)$/i);
  if (soThat) return { body: soThat[1], rawOutcome: soThat[2].trim() };
  const soCan = idea.match(
    /^(.*?)\s+so\s+((?:they|you|users|clients|founders|designers|people)\s+.+)$/i
  );
  if (soCan) return { body: soCan[1], rawOutcome: soCan[2].trim() };
  const soNeg = idea.match(
    /^(.*?)\s+so\s+(.+?\s+(?:do not|don't|does not|doesn't)\s+.+)$/i
  );
  if (soNeg) return { body: soNeg[1], rawOutcome: soNeg[2].trim() };
  return { body: idea, rawOutcome: "" };
}

function stripAudiencePrefix(text: string, audience: string): string {
  const tokens = text.trim().split(/\s+/);
  const audWords = new Set(
    audience
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2)
      .concat([
        "freelance",
        "freelancers",
        "designers",
        "founders",
        "parents",
        "writers",
        "people",
        "busy",
      ])
  );
  while (tokens.length > 1 && audWords.has(tokens[0].toLowerCase())) {
    tokens.shift();
  }
  return tokens.join(" ").replace(/^(?:to|that|which)\s+/i, "").trim();
}

function tidyOutcome(outcome: string): string {
  return outcome
    .replace(/^(they|you|users|clients|people|founders|designers)\s+can\s+/i, "")
    .replace(/^(they|you)\s+/i, "")
    .trim();
}

function derivePain(rawOutcome: string, idea: string): string {
  const tidy = tidyOutcome(rawOutcome);
  const no = tidy.match(/^(.+?)\s+(?:do not|don't|does not|doesn't)\s+(.+)$/i);
  if (no) {
    const noun = singular(no[1].trim());
    const rest = no[2].trim();
    if (/^spiral/.test(rest)) return `${noun} spirals`;
    return `${noun} ${rest}`;
  }
  const without = tidy.match(/\bwithout\s+(.+)$/i) || idea.match(/\bwithout\s+(.+)$/i);
  if (without) return without[1].trim();
  const hate = idea.match(
    /\bwho\s+(?:hate|hates|struggle with|struggling with)\s+(.+)$/i
  );
  if (hate) return hate[1].replace(/\s+so\s+.+$/i, "").trim();
  return tidy;
}

function leadNounPhrase(body: string): string {
  const withArticle = body.match(
    /^(?:a|an|the)\s+([\w-]+(?:\s+[\w-]+){0,3})\s+(?:that|which|to|for|who)\b/i
  );
  if (withArticle) return withArticle[1].trim();
  const noArticle = body.match(
    /^([\w-]+(?:\s+[\w-]+){0,3})\s+(?:that|which|to|for|who)\b/i
  );
  return noArticle ? noArticle[1].trim() : "";
}

function isFormatOnly(phrase: string): boolean {
  const words = phrase.toLowerCase().split(/\s+/).filter(Boolean);
  return words.length > 0 && words.every((w) => FORMAT_WORDS.has(w) || STOP.has(w));
}

function shortAudienceLabel(audience: string): string {
  const words = audience.trim().split(/\s+/);
  if (words.length <= 2) return titleCase(audience);
  const last = words[words.length - 1];
  return titleCase(last);
}

function scoreName(n: string): number {
  let s = 0;
  if (/\b(Tracker|Drafter|Writer|Planner|Organizer|Manager|Generator|Automation|Scheduler|Checklist)\b/i.test(n)) {
    s += 4;
  }
  if (/\bOS\b/.test(n)) {
    // Prefer concrete product nouns over meta "OS" branding
    s += WEAK_ADJECTIVES.has(n.split(/\s+/)[0].toLowerCase()) ? -1 : 1;
  }
  if (/\bKit\b/.test(n)) s += 1;
  const hits = n.match(/linkedin|feedback|revision|round|comment|reply|invoice|meal|notion/gi);
  if (hits) s += hits.length * 2;
  if (/^(Launch|Quick|Starter|Ready|First|Mini|Pocket|Sprint|Ship)\b/i.test(n)) s -= 5;
  if (/\bBundle\b/i.test(n)) s -= 5;
  if (n.split(/\s+/).length > 5) s -= 1;
  return s;
}

function buildNameCandidates(
  verb: string,
  objectPhrase: string,
  outcome: string,
  lead: string,
  pain: string,
  audience: string,
  raw: string
): string[] {
  const names: string[] = [];
  const seen = new Set<string>();
  const add = (n: string) => {
    const cleaned = n.replace(/\s+/g, " ").trim();
    if (!cleaned) return;
    const words = cleaned.split(" ");
    if (words.length < 2 || words.length > 6) return;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) return;
    if (/bundle|micro-offer/i.test(cleaned)) return;
    if (isFormatOnly(cleaned)) return;
    seen.add(key);
    names.push(cleaned);
  };

  const lemma = toInfinitive(verb);
  const agent = AGENT_NOUN[lemma] || "Kit";
  const obj = significantWords(objectPhrase);
  const out = significantWords(outcome);

  if (obj.length >= 1) {
    const pair = obj.slice(-2).map((w, i, arr) => (i === arr.length - 1 ? singular(w) : w));
    add(titleCase(`${pair.join(" ")} ${agent}`));
  }
  if (obj.length >= 2) {
    add(titleCase(`${obj[0]} ${singular(obj[obj.length - 1])} ${agent}`));
    if (!WEAK_ADJECTIVES.has(obj[0])) {
      add(titleCase(`${obj[0]} ${singular(obj[1])} OS`));
    }
  }
  const outcomeLooksLikeNoun = Boolean(
    outcome && !/^(they|you|users|clients|people|founders|designers)\s+can\b/i.test(outcome)
      && !/^(network|spend|spending)\b/i.test(outcome)
  );
  if (outcomeLooksLikeNoun && out.length && obj.length) {
    add(titleCase(`${singular(out[0])} ${singular(obj[obj.length - 1])} ${agent}`));
  }
  if (outcomeLooksLikeNoun && out.length >= 1 && obj.length >= 2) {
    add(titleCase(`${singular(out[0])} ${singular(obj[obj.length - 2])} ${agent}`));
  }

  if (lead && !isFormatOnly(lead)) {
    add(titleCase(lead));
    if (pain) {
      const painWords = significantWords(pain);
      if (painWords.includes("waste")) add(titleCase(`No-Waste ${lead}`));
      else if (painWords.length) add(titleCase(`${painWords[0]} ${lead}`));
    }
  }

  if (lemma === "invoice" || obj.includes("invoice") || obj.includes("invoices")) {
    add("Client Invoice Kit");
    add("Freelance Invoice Kit");
  }

  // Checklist / feed-swap ideas: keep product-like names even though "checklist" is a format word
  if (/\bchecklist\b/i.test(objectPhrase) || /\bchecklist\b/i.test(raw)) {
    const topic = significantWords(
      objectPhrase.replace(/\bchecklist\b/gi, " ")
    ).slice(-2);
    if (topic.length) {
      add(titleCase(`${topic.join(" ")} Checklist`));
      add(titleCase(`${topic.join(" ")} Tracker`));
    } else {
      add("Daily Checklist");
    }
  }
  if (/\bjob\s+search\b/i.test(objectPhrase) || /\bjob\s+search\b/i.test(raw)) {
    add("Daily Job Search Checklist");
    add("Job Search Focus Kit");
  }

  const aud = shortAudienceLabel(audience);
  const base = [...names];
  for (const n of base) {
    if (aud && !n.toLowerCase().includes(aud.split(" ")[0].toLowerCase())) {
      const suffixed = `${n} for ${aud}`;
      if (suffixed.split(" ").length <= 6) add(suffixed);
    }
  }

  if (names.length === 0) {
    const fallback = significantWords(raw).slice(0, 3);
    if (fallback.length >= 2) add(titleCase(`${fallback.join(" ")} Kit`));
    else if (aud) add(titleCase(`${aud} Kit`));
  }
  if (names.length === 0) add("Product Kit");

  names.sort((a, b) => scoreName(b) - scoreName(a) || a.localeCompare(b));
  return names;
}

function actionFromLead(lead: string): string {
  const words = lead.toLowerCase().split(/\s+/);
  if (words.length >= 2 && /planner$/.test(words[1])) return `plan ${words[0]}s`;
  if (words.length >= 2 && /tracker$/.test(words[1])) return `track ${words[0]}s`;
  if (words.length >= 2 && /manager$/.test(words[1])) return `manage ${words[0]}s`;
  if (words.length >= 2 && /writer$/.test(words[1])) return `write ${words[0]}s`;
  return "";
}

export function parseIdea(idea: string, audienceHint?: string): ParsedIdea {
  const raw = cleanIdea(idea);
  const kind = detectProductKind(raw);
  const audience = inferAudience(raw, audienceHint);
  const { body, rawOutcome } = splitOutcome(raw);
  const pain = derivePain(rawOutcome, raw);
  const soClause = rawOutcome ? `so ${rawOutcome}` : "";
  const outcome = tidyOutcome(rawOutcome);

  let action = "";
  const helps = body.match(/\bhelps?\s+(.+)$/i);
  const thatClause = body.match(/\b(?:that|which)\s+(?:helps?\s+)?(.+)$/i);
  const toHelp = body.match(/\bto\s+help\s+(.+)$/i);

  if (helps) action = stripAudiencePrefix(helps[1], audience);
  else if (toHelp) action = stripAudiencePrefix(toHelp[1], audience);
  else if (thatClause) action = stripAudiencePrefix(thatClause[1], audience);

  action = action
    .replace(/\s+\bfor\s+.+$/i, "")
    .replace(/\s+\bwho\s+.+$/i, "")
    .trim();

  // "replaces the LinkedIn feed with a daily job search checklist"
  // → benefit-first: "run a daily job search checklist instead of the LinkedIn feed"
  const replaceWith = action.match(
    /^replac(?:e|es|ing)\s+(.+?)\s+with\s+(.+)$/i
  );
  if (replaceWith) {
    const from = replaceWith[1].trim();
    const to = replaceWith[2].trim();
    action = `run ${to} instead of ${from}`;
  }

  const lead = leadNounPhrase(body);
  let usedDefault = false;
  if (!action) action = actionFromLead(lead);
  if (!action) {
    action = defaultAction(kind);
    usedDefault = true;
  }

  const parts = action.split(/\s+/);
  let verb = parts[0] || "use";
  let objectPhrase = parts.slice(1).join(" ");
  objectPhrase = objectPhrase
    .split(/\s+/)
    .filter((w) => !ADVERBS.has(w.toLowerCase()))
    .join(" ")
    .trim();

  const nextLemma = parts.length > 1 ? toInfinitive(parts[1]) : "";
  if (
    !usedDefault &&
    STOP.has(verb.toLowerCase()) &&
    nextLemma &&
    AGENT_NOUN[nextLemma]
  ) {
    verb = parts[1];
    objectPhrase = parts.slice(2).join(" ");
  }

  const lemma = usedDefault ? "use" : toInfinitive(verb);
  const rest = objectPhrase;
  if (!usedDefault) {
    action = rest ? `${lemma} ${rest}` : lemma;
  }
  const actionIng = usedDefault
    ? action
    : rest
      ? `${toGerund(lemma)} ${rest}`
      : toGerund(lemma);

  // Prefer the replacement target for names (job search checklist > LinkedIn feed)
  const replaceTarget = raw.match(/\breplac(?:e|es|ing)\s+.+?\s+with\s+(.+)$/i);
  const nameObject = replaceTarget
    ? replaceTarget[1].trim()
    : usedDefault
      ? ""
      : objectPhrase;
  const nameVerb = replaceTarget
    ? ""
    : usedDefault
      ? ""
      : lemma;
  const nameLead = replaceTarget ? replaceTarget[1].trim() : lead;

  const nameCandidates = buildNameCandidates(
    nameVerb,
    nameObject,
    outcome,
    nameLead,
    pain,
    audience,
    raw
  );
  const coreName = nameCandidates[0] ?? "Product Kit";

  return {
    raw,
    kind,
    kindLabel: kindLabel(kind),
    audience,
    action,
    actionIng,
    soClause,
    outcome,
    pain,
    verb: lemma,
    objectPhrase,
    coreName,
    nameCandidates,
  };
}

/** Extract a short product-name core from the idea */
export function extractTheme(idea: string): string {
  return parseIdea(idea).coreName;
}

function buildOfferName(parsed: ParsedIdea, seed: number): string {
  const pool = parsed.nameCandidates.length
    ? parsed.nameCandidates
    : [parsed.coreName];
  const max = Math.max(...pool.map(scoreName));
  const top = pool.filter((n) => scoreName(n) >= max - 1);
  return pick(top.length ? top : pool, seed, 1);
}

function buildPromise(offerName: string, parsed: ParsedIdea, seed: number): string {
  const { audience, action, soClause, pain } = parsed;
  const templates: string[] = [];
  if (pain && pain.split(/\s+/).length <= 8) {
    templates.push(`Stop ${pain}: ${offerName} helps ${audience} ${action}.`);
  }
  if (soClause) {
    templates.push(`${offerName} helps ${audience} ${action} ${soClause}.`);
  }
  if (pain && !soClause) {
    templates.push(
      `${offerName} helps ${audience} ${action} without ${pain}.`
    );
  }
  templates.push(
    `${offerName} gives ${audience} a focused way to ${action}${
      pain ? ` — without ${pain}` : ""
    }.`
  );
  templates.push(
    `Give ${audience} a simple way to ${action}${
      soClause ? ` — ${soClause}` : pain ? ` without ${pain}` : ""
    }.`
  );
  const chosen = pick(templates, seed, 5).replace(/\s+/g, " ").trim();
  return /[.!?]$/.test(chosen) ? chosen : `${chosen}.`;
}

function deliverablesFor(
  parsed: ParsedIdea,
  offerName: string,
  price: PriceBand,
  seed: number
): string[] {
  const { kind, audience, action, actionIng, kindLabel: format, pain, raw } = parsed;
  const byKind: Record<ProductKind, string[][]> = {
    notion_template: /client|feedback|revision|round/i.test(raw)
      ? [
          [
            `Ready-to-duplicate Notion template: ${offerName}`,
            "5-minute setup guide (duplicate, share settings, first client)",
            "Worked example with a sample client and 3 feedback rounds filled in",
            "Client-share view so reviewers comment without seeing your internals",
            "Round-lock SOP: when extra tweaks become a new billed round",
          ],
          [
            `${offerName} Notion workspace (databases, views, and page templates)`,
            `Setup guide for ${audience}: duplicate, rename, invite`,
            "Example workflows they can copy for a live project",
            "Client-share / guest view for reviewers",
            "Comment-triage checklist inside the template",
          ],
        ]
      : [
          [
            `Ready-to-duplicate Notion template: ${offerName}`,
            `5-minute setup guide for ${audience} (duplicate, rename, share)`,
            "Worked example with sample pages filled in",
            "Shareable / guest view so collaborators see only what they need",
            `Usage SOP: how ${audience} run this week after week`,
          ],
        ],
    chrome_extension: [
      [
        `${offerName} Chrome extension (installable zip + icons)`,
        "Install and permissions one-pager",
        `Default presets for ${
          /linkedin/i.test(raw) && /comment|reply|draft/i.test(raw)
            ? "the comments and replies"
            : "the actions"
        } ${audience} use most`,
        "Keyboard shortcut cheatsheet",
        `3 before/after examples of ${actionIng}`,
      ],
      [
        `Unpackaged ${offerName} extension build ready to sideload or submit`,
        "Quick-start: install in Chrome in under 3 minutes",
        `Prompt / snippet presets covering common ${
          /linkedin/i.test(raw) && /comment|reply|draft/i.test(raw)
            ? "LinkedIn reply tones"
            : "use cases"
        }`,
        "Shortcut and popup cheatsheet",
        `Sample workflows for ${audience}`,
      ],
    ],
    template: [
      [
        `${offerName} template file (ready to duplicate)`,
        `Setup guide for ${audience}`,
        `Worked example covering how to ${action}`,
        "Blank + filled versions so buyers see the end state",
        "One-page usage SOP",
      ],
    ],
    spreadsheet: [
      [
        `${offerName} spreadsheet (Google Sheets / Excel)`,
        "Tab-by-tab setup guide",
        "Sample data row so formulas make sense immediately",
        "Dashboard / summary view",
        "Printable cheat sheet",
      ],
    ],
    checklist: [
      [
        `${offerName} checklist (printable + Notion/Markdown)`,
        `How ${audience} should run it the first time`,
        `Worked example of ${actionIng}`,
        "Done/not-done legend and time boxes",
        "One-page recap card",
      ],
    ],
    guide: [
      [
        `${offerName} guide (PDF / Markdown)`,
        `Step-by-step walkthrough for ${audience} to ${action}`,
        "Worked example with real-shaped numbers",
        "Templates or scripts from the guide, copied out as files",
        "Quick-reference recap",
      ],
    ],
    course: [
      [
        `${offerName} lesson pack (video outline + notes)`,
        "Workbook for the exercises",
        `Checklists ${audience} use while ${actionIng}`,
        "Resource list / swipe examples",
        "30-day practice plan",
      ],
    ],
    prompt_pack: [
      [
        `${offerName} prompt pack (copy-paste ready)`,
        "When-to-use notes for each prompt",
        "Filled example outputs",
        `Remix guide for ${audience}`,
        "One-page prompt cheatsheet",
      ],
    ],
    ebook: [
      [
        `${offerName} ebook (PDF)`,
        `Action chapter so ${audience} can ${action} the same day`,
        "Worksheets / templates from the book as separate files",
        "Examples and before/after snapshots",
        "Quick-start recap",
      ],
    ],
    app: [
      /planner|meal|grocery/i.test(raw)
        ? [
            `${offerName} weekly plan template`,
            `Matching grocery list so ${pain || "waste"} drops`,
            `Sunday setup guide for ${audience} (about 20 minutes)`,
            "Leftover / repeat-meal cheat sheet",
            "Sample week filled in so you can copy it",
          ]
        : [
            `${offerName} — the working tool buyers open first`,
            `Quick-start so ${audience} can ${action} on day one`,
            "Sample workspace / demo data",
            "Keyboard / UI cheatsheet",
            "Short troubleshooting FAQ for using the product",
          ],
    ],
    generic: [
      [
        `${offerName}: the core file ${audience} open first`,
        `Quick-start guide to ${action}`,
        "Worked example with realistic sample data",
        "Cheat sheet of the 7 steps to get the outcome",
        "Usage FAQ (how to use it, not how to buy it)",
      ],
    ],
  };

  const pool = byKind[kind];
  const chosen = [...pick(pool, seed, 7)];
  const n = price === 1 ? 3 : price === 5 ? 4 : 5;
  return chosen.slice(0, n).map((d) => d.replace(/\s+/g, " ").trim());
}

function priceWhy(
  price: PriceBand,
  audience: string,
  kindLabelText: string,
  status: ProjectStatus
): string {
  if (price === 1) {
    return `At $1, impulse-buy friction is near zero — ${audience} can try the ${kindLabelText} on the next real job. ${
      status === "idea"
        ? "Ship the thinnest useful version; the price matches an unfinished-but-usable file."
        : "Low price = more people using it and telling you what to fix before you raise it."
    }`;
  }
  if (price === 5) {
    return `$5 sits in the "coffee money" zone: serious enough that ${audience} expect a crisp ${kindLabelText}, cheap enough that they won't overthink. Strong default when the artifact is a template, checklist, or focused tool.`;
  }
  return `$9 signals a premium micro-tool: ${audience} expect polish and immediate utility from this ${kindLabelText}. Still an impulse buy if the promise is specific and the files work on first open.`;
}

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function normalizeParagraph(p: string): string {
  return p
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Drop near-duplicate paragraphs (e.g. product line repeating the promise). */
function dedupeParagraphs(text: string): string {
  const paras = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  const kept: string[] = [];
  for (const p of paras) {
    const norm = normalizeParagraph(p);
    const dup = kept.some((k) => {
      const kn = normalizeParagraph(k);
      if (kn === norm) return true;
      if (norm.length >= 40 && kn.includes(norm.slice(0, Math.floor(norm.length * 0.65)))) {
        return true;
      }
      if (kn.length >= 40 && norm.includes(kn.slice(0, Math.floor(kn.length * 0.65)))) {
        return true;
      }
      return false;
    });
    if (!dup) kept.push(p);
  }
  return kept.join("\n\n");
}

function buildSalesBlurb(
  offerName: string,
  _promise: string,
  parsed: ParsedIdea,
  deliverables: string[],
  price: PriceBand
): string {
  const { audience, action, pain, kindLabel: format, soClause } = parsed;
  const d1 = deliverables[0] ?? `the ${format}`;
  const d2 = deliverables[1] ?? "a setup guide";
  const d3 = deliverables[2] ?? "a worked example";
  // problem → product → what's inside → CTA (never paste promise; that caused duplicates)
  const problem = pain
    ? `${sentenceCase(audience)} know the cost of ${pain}.`
    : `${sentenceCase(audience)} are tired of doing this the hard way.`;
  const product = soClause
    ? `${offerName} is the ${format} that helps ${audience} ${action} ${soClause}.`
    : pain
      ? `${offerName} is the ${format} that helps ${audience} ${action} without ${pain}.`
      : `${offerName} is the ${format} that helps ${audience} ${action}.`;
  const inside = `Inside: ${d1}. Plus ${d2}, and ${d3}. Open it, use it this week, and keep the rest of your week.`;
  const cta = `No bloated suite. No endless setup. A $${price} ${format} that does one job well.

Built for ${audience}. Grab ${offerName} for $${price} and use it today.`;

  let blurb = dedupeParagraphs(`${problem}\n\n${product}\n\n${inside}\n\n${cta}`);

  if (wordCount(blurb) < 120) {
    blurb += ` If it saves you one evening, it has already paid for itself.`;
  }
  if (wordCount(blurb) < 120) {
    blurb += ` Pass it to a colleague in the same boat when you're done.`;
  }
  if (wordCount(blurb) > 180) {
    const parts = blurb.split(/\s+/);
    blurb = parts.slice(0, 175).join(" ") + ".";
  }
  return blurb.trim();
}

function buildTwitter(
  offerName: string,
  promise: string,
  price: PriceBand,
  parsed: ParsedIdea,
  seed: number
): string {
  const { audience, action, pain, kindLabel: format } = parsed;
  const hooks = [
    `${sentenceCase(audience)}: ${pain ? `stop ${pain}` : "this is for you"}.`,
    `New: ${offerName} — a $${price} ${format} to ${action}.`,
    `I made a ${format} so ${audience} can ${action}.`,
    pain
      ? `${pain.charAt(0).toUpperCase() + pain.slice(1)} don't have to be the job.`
      : `${offerName} is live for ${audience}.`,
  ];
  const hook = pick(hooks, seed, 11);
  const tags =
    parsed.kind === "notion_template"
      ? "#Notion #Freelance"
      : parsed.kind === "chrome_extension"
        ? /linkedin/i.test(parsed.raw)
          ? "#ChromeExtension #LinkedIn"
          : "#ChromeExtension #indiehackers"
        : "#indiehackers";
  return `${hook}

${offerName}
${promise}

$${price} · link in reply / bio

${tags}`;
}

function buildCommunityPost(
  offerName: string,
  promise: string,
  deliverables: string[],
  price: PriceBand,
  parsed: ParsedIdea
): string {
  const bullets = deliverables.map((d) => `• ${d}`).join("\n");
  return `I just launched ${offerName} for ${parsed.audience}.

**${offerName}** ($${price})
${promise}

What's inside:
${bullets}

Would this help you ${parsed.action}? What's missing?

Happy to share the listing once live.`;
}

function buildGumroad(
  offerName: string,
  promise: string,
  deliverables: string[],
  price: PriceBand,
  parsed: ParsedIdea
): string {
  const bullets = deliverables.map((d) => `- ${d}`).join("\n");
  const notFor =
    parsed.kind === "notion_template"
      ? "Teams that already live in Jira/Asana, or anyone who doesn't use Notion."
      : parsed.kind === "chrome_extension"
        ? "People who don't use Chrome, or who never want help drafting posts/comments."
        : `Anyone expecting a custom done-for-you service instead of a $${price} ${parsed.kindLabel}.`;
  const whoFor = parsed.soClause
    ? `${sentenceCase(parsed.audience)} who need to ${parsed.action} ${parsed.soClause}.`
    : `${sentenceCase(parsed.audience)} who need to ${parsed.action}.`;
  return `# ${offerName}

**${promise}**

Built for ${parsed.audience}.

## You'll get
${bullets}

## Who it's for
${whoFor}

## Who it's not for
${notFor}

## Price
$${price} — priced so you can use it on the next job, not "someday."

After purchase you'll receive the files instantly. Questions? Reply to the receipt email.`;
}

function fileAttach(parsed: ParsedIdea): string {
  if (parsed.kind === "notion_template") {
    return "Attach the Notion duplicate link plus a 1-page setup PDF — this is what buyers download";
  }
  if (parsed.kind === "chrome_extension") {
    return "Attach the extension zip plus an install README — this is what buyers download";
  }
  return `Attach a simple file of the ${parsed.kindLabel} — this is what buyers download`;
}

function launchChecklist(
  status: ProjectStatus,
  price: PriceBand,
  parsed: ParsedIdea,
  offerName: string
): string[] {
  let makeFiles: string;
  if (status === "idea") {
    makeFiles =
      parsed.kind === "notion_template"
        ? "Build the thinnest duplicate-ready Notion template today (one database, one client-share view, one example). Ship ugly; ship today."
        : parsed.kind === "chrome_extension"
          ? "Ship a load-unpacked Chrome extension MVP that does the one job in the promise. Zip it with a README."
          : `Package the core ${parsed.kindLabel} as a file buyers can use today. Ship ugly; ship today.`;
  } else if (status === "shipped") {
    makeFiles = `Export a slice of what you already built that matches the listing — don't rebuild. ${fileAttach(parsed)}.`;
  } else {
    makeFiles = `Cut your WIP to the deliverables list and export that slice only — don't wait for feature-complete. ${fileAttach(parsed)}.`;
  }

  return [
    `Create a Gumroad (or Lemon Squeezy) product named "${offerName}" at $${price} with your blurb`,
    makeFiles,
    `Paste the sales-page blurb. Post the X/Twitter draft, then share the community post where ${parsed.audience} hang out`,
    `DM 5 ${parsed.audience} with a one-liner + link (ask for honest feedback, not pity buys)`,
    "End of day: note views, clicks, sales — decide keep / iterate / kill tomorrow morning",
  ];
}

/**
 * Deterministic offer pack generator — works with zero API keys.
 * Same inputs → same outputs (stable for demos & tests).
 * Always sells the USER's idea as the product, never FirstBuck's "package a micro-offer" thesis.
 */
export function generateOfferPack(input: IdeaInput): OfferPack {
  const idea = cleanIdea(input.idea);
  if (!idea || idea.length < 3) {
    throw new Error("Idea must be at least 3 characters.");
  }
  const parsed = parseIdea(idea, input.audience);
  const seedStr = `${idea}|${parsed.audience}|${input.status}|${input.priceBand}`;
  const seed = hashSeed(seedStr);
  const price = input.priceBand;
  const offerName = buildOfferName(parsed, seed);
  const promise = buildPromise(offerName, parsed, seed);
  const deliverables = deliverablesFor(parsed, offerName, price, seed);
  const priceWhyText = priceWhy(price, parsed.audience, parsed.kindLabel, input.status);
  const salesBlurb = buildSalesBlurb(
    offerName,
    promise,
    parsed,
    deliverables,
    price
  );
  const twitterPost = buildTwitter(offerName, promise, price, parsed, seed);
  const communityPost = buildCommunityPost(
    offerName,
    promise,
    deliverables,
    price,
    parsed
  );
  const gumroadDescription = buildGumroad(
    offerName,
    promise,
    deliverables,
    price,
    parsed
  );
  const launchChecklistSteps = launchChecklist(
    input.status,
    price,
    parsed,
    offerName
  );

  return {
    offerName,
    promise,
    deliverables,
    price,
    priceWhy: priceWhyText,
    salesBlurb,
    twitterPost,
    communityPost,
    gumroadDescription,
    launchChecklist: launchChecklistSteps,
    generatedAt: new Date().toISOString(),
    seed: seed.toString(16),
  };
}

/** Markdown export of a full pack */
export function packToMarkdown(pack: OfferPack): string {
  return `# ${pack.offerName}

> ${pack.promise}

**Recommended price:** $${pack.price}
**Why:** ${pack.priceWhy}

## Buyer deliverables
${pack.deliverables.map((d) => `- ${d}`).join("\n")}

## Sales page blurb
${pack.salesBlurb}

## X / Twitter
${pack.twitterPost}

## IndieHackers / Reddit
${pack.communityPost}

## Gumroad description
${pack.gumroadDescription}

## 24-hour launch checklist
${pack.launchChecklist.map((s, i) => `${i + 1}. ${s}`).join("\n")}

---
Generated with FirstBuck · ${pack.generatedAt}
`;
}
