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

function titleCase(s: string): string {
  return s
    .split(/\s+/)
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

/** Extract a short noun-ish label from the idea for naming */
export function extractTheme(idea: string): string {
  const cleaned = cleanIdea(idea);
  const stop = new Set([
    "a",
    "an",
    "the",
    "for",
    "to",
    "of",
    "and",
    "or",
    "with",
    "that",
    "this",
    "my",
    "i",
    "want",
    "build",
    "make",
    "create",
    "app",
    "tool",
    "saas",
    "platform",
    "website",
    "site",
    "help",
    "people",
    "users",
    "who",
    "can",
    "will",
    "just",
    "like",
    "from",
    "into",
    "about",
  ]);
  const words = cleaned
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stop.has(w));
  if (words.length === 0) return "Starter Pack";
  // Prefer last meaningful chunk (often the product noun)
  const core = words.slice(0, 3).join(" ");
  return titleCase(core);
}

function inferAudience(idea: string, audience?: string): string {
  if (audience?.trim()) return audience.trim();
  const lower = idea.toLowerCase();
  if (/freelance|client|agency/.test(lower)) return "freelancers landing new clients";
  if (/developer|dev|code|api|saas/.test(lower)) return "indie makers and solo developers";
  if (/writer|blog|content|newsletter/.test(lower)) return "writers and newsletter creators";
  if (/design|ui|figma/.test(lower)) return "designers shipping faster";
  if (/market|seo|ads|growth/.test(lower)) return "marketers testing channels";
  if (/student|learn|course|tutor/.test(lower)) return "learners who want a shortcut";
  if (/founder|startup|side.?project/.test(lower)) return "founders validating ideas";
  if (/coach|consult/.test(lower)) return "coaches packaging their expertise";
  return "busy people who want a done-for-you shortcut";
}

const NAME_PREFIXES = [
  "Quick",
  "Starter",
  "Launch",
  "Ready",
  "First",
  "Mini",
  "Pocket",
  "Sprint",
  "Day-One",
  "Ship",
] as const;

const NAME_SUFFIXES = [
  "Kit",
  "Pack",
  "Blueprint",
  "Playbook",
  "Bundle",
  "Toolkit",
  "Checklist",
  "Template Pack",
  "Guide",
  "System",
] as const;

function buildOfferName(theme: string, seed: number, price: PriceBand): string {
  const prefix = pick(NAME_PREFIXES, seed, 1);
  const suffix = pick(NAME_SUFFIXES, seed, 3);
  // Keep names short and sellable
  const shortTheme =
    theme.split(" ").length > 2 ? theme.split(" ").slice(0, 2).join(" ") : theme;
  if (price === 1) return `${prefix} ${shortTheme} ${suffix}`.replace(/\s+/g, " ");
  if (price === 9) return `${shortTheme} ${suffix} Pro`.replace(/\s+/g, " ");
  return `${shortTheme} ${suffix}`.replace(/\s+/g, " ");
}

function buildPromise(
  offerName: string,
  audience: string,
  idea: string,
  seed: number
): string {
  const templates = [
    `Get a complete, sellable micro-offer from "${cleanIdea(idea)}" — ready for ${audience} in under a day.`,
    `${offerName}: turn your rough idea into a clear $1–$9 product ${audience} will buy today.`,
    `A ready-to-sell package that helps ${audience} get results from ${cleanIdea(idea).toLowerCase()} — without building a full product.`,
    `Ship a tiny paid offer for ${audience}: everything you need to go from idea to first sale in 24 hours.`,
  ];
  return pick(templates, seed, 5);
}

function deliverablesFor(
  status: ProjectStatus,
  price: PriceBand,
  theme: string,
  seed: number
): string[] {
  const base: string[][] = [
    [
      `1-page offer brief with positioning for ${theme}`,
      "Sales page copy (headline + bullets + CTA)",
      "Pricing recommendation with rationale",
      "3 ready-to-post launch messages (X + community)",
      "24-hour launch checklist",
    ],
    [
      `Notion/Markdown template pack for ${theme}`,
      "Buyer outcome statement + proof hooks",
      "Gumroad/Lemon Squeezy product description",
      "Email welcome sequence outline (3 emails)",
      "Launch-day schedule (hour by hour)",
    ],
    [
      `Swipe-file offer name + promise variations`,
      "Deliverable outline buyers can use immediately",
      "Objection-handling FAQ (5 answers)",
      "Social proof prompt sheet",
      "Post-purchase upsell teaser",
    ],
  ];
  const chosen = [...pick(base, seed, 7)];
  if (status === "idea") {
    chosen[0] = `Zero-to-offer worksheet that scopes ${theme} without building software`;
  } else if (status === "wip") {
    chosen[0] = `Scope-cut guide: strip your WIP to a sellable ${theme} slice`;
  } else {
    chosen[0] = `Repackage guide: turn what you shipped into a $1–$9 ${theme} micro-offer`;
  }
  if (price === 1) return chosen.slice(0, 3);
  if (price === 5) return chosen.slice(0, 4);
  return chosen.slice(0, 5);
}

function priceWhy(price: PriceBand, audience: string, status: ProjectStatus): string {
  if (price === 1) {
    return `At $1, impulse-buy friction is near zero — perfect for proving demand with ${audience}. ${
      status === "idea"
        ? "You're selling clarity and a head start, not a finished product."
        : "Low price = more feedback loops before you raise it."
    }`;
  }
  if (price === 5) {
    return `$5 sits in the "coffee money" zone: serious enough that buyers expect a crisp deliverable, cheap enough that ${audience} won't overthink. Strong default for templates, checklists, and playbooks.`;
  }
  return `$9 signals a premium micro-tool: buyers expect polish and immediate utility. Ideal when you already have WIP or a shipped asset to wrap. Still an impulse buy for motivated ${audience}.`;
}

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function buildSalesBlurb(
  offerName: string,
  promise: string,
  audience: string,
  deliverables: string[],
  price: PriceBand,
  idea: string
): string {
  const d1 = deliverables[0] ?? "a clear offer brief";
  const d2 = deliverables[1] ?? "launch copy";
  let blurb = `Tired of ideas that never leave the notes app? ${offerName} is built for ${audience} who want cashflow signal — not another endless build.

${promise}

Inside you get ${d1.toLowerCase()}, ${d2.toLowerCase()}, and a 24-hour path to your first sale. No bloated course. No "build in public for 6 months." Just a tight micro-offer you can list on Gumroad tonight.

Based on: ${cleanIdea(idea)}.

Grab it for $${price} and ship something people can buy today.`;
  // Keep ~120–180 words
  let words = wordCount(blurb);
  if (words < 120) {
    blurb += ` If it resonates, raise the price tomorrow. If it doesn't, you learned for less than lunch.`;
  }
  words = wordCount(blurb);
  if (words > 180) {
    const parts = blurb.split(/\s+/);
    blurb = parts.slice(0, 175).join(" ") + ".";
  }
  return blurb.trim();
}

function buildTwitter(
  offerName: string,
  promise: string,
  price: PriceBand,
  seed: number
): string {
  const hooks = [
    `I turned a rough idea into a $${price} offer in one sitting.`,
    `Shipping a $${price} micro-offer today:`,
    `Stop building. Start selling something tiny.`,
    `$${price} offer live — because validation beats vibes.`,
  ];
  const hook = pick(hooks, seed, 11);
  return `${hook}

${offerName}
${promise}

$${price} · link in reply / bio

#buildinpublic #indiehackers`;
}

function buildCommunityPost(
  offerName: string,
  promise: string,
  deliverables: string[],
  price: PriceBand,
  audience: string,
  idea: string
): string {
  const bullets = deliverables.map((d) => `• ${d}`).join("\n");
  return `I just packaged a micro-offer for ${audience}.

**${offerName}** ($${price})
${promise}

What's inside:
${bullets}

Origin idea: ${cleanIdea(idea)}

Looking for feedback: Does the promise feel clear? Would you pay $${price}? What's missing?

Happy to share the listing once live.`;
}

function buildGumroad(
  offerName: string,
  promise: string,
  deliverables: string[],
  price: PriceBand,
  audience: string
): string {
  const bullets = deliverables.map((d) => `- ${d}`).join("\n");
  return `# ${offerName}

**${promise}**

Built for ${audience}.

## You'll get
${bullets}

## Who it's for
People who want a first sale this week — not a 6-month roadmap.

## Who it's not for
Anyone looking for a full SaaS, agency retainer, or "done for you forever" service.

## Price
$${price} — impulse-buy pricing so you can validate fast.

After purchase you'll receive the files instantly. Questions? Reply to the receipt email.`;
}

function launchChecklist(status: ProjectStatus, price: PriceBand): string[] {
  const common = [
    `Create a Gumroad (or Lemon Squeezy) product at $${price} with your offer name + blurb`,
    "Paste the sales-page blurb and attach a simple PDF/Markdown of the deliverables",
    "Post the X/Twitter draft, then share the community post on IndieHackers or r/SideProject",
    "DM 5 people in your audience with a one-liner + link (ask for honest feedback, not pity buys)",
    "End of day: note views, clicks, sales — decide keep / iterate / kill tomorrow morning",
  ];
  if (status === "idea") {
    common[1] =
      "Write a 2-page PDF: problem → promise → 3 steps → CTA. Ship ugly; ship today.";
  } else if (status === "shipped") {
    common[1] =
      "Export a slice of what you already built (template, checklist, export) — don't rebuild.";
  }
  return common;
}

/**
 * Deterministic offer pack generator — works with zero API keys.
 * Same inputs → same outputs (stable for demos & tests).
 */
export function generateOfferPack(input: IdeaInput): OfferPack {
  const idea = cleanIdea(input.idea);
  if (!idea || idea.length < 3) {
    throw new Error("Idea must be at least 3 characters.");
  }
  const audience = inferAudience(idea, input.audience);
  const theme = extractTheme(idea);
  const seedStr = `${idea}|${audience}|${input.status}|${input.priceBand}`;
  const seed = hashSeed(seedStr);
  const price = input.priceBand;
  const offerName = buildOfferName(theme, seed, price);
  const promise = buildPromise(offerName, audience, idea, seed);
  const deliverables = deliverablesFor(input.status, price, theme, seed);
  const priceWhyText = priceWhy(price, audience, input.status);
  const salesBlurb = buildSalesBlurb(
    offerName,
    promise,
    audience,
    deliverables,
    price,
    idea
  );
  const twitterPost = buildTwitter(offerName, promise, price, seed);
  const communityPost = buildCommunityPost(
    offerName,
    promise,
    deliverables,
    price,
    audience,
    idea
  );
  const gumroadDescription = buildGumroad(
    offerName,
    promise,
    deliverables,
    price,
    audience
  );
  const launchChecklistSteps = launchChecklist(input.status, price);

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
