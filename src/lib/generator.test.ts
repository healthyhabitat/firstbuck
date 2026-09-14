import { describe, it, expect } from "vitest";
import {
  generateOfferPack,
  packToMarkdown,
  hashSeed,
  extractTheme,
  parseIdea,
  detectProductKind,
} from "./generator";
import type { IdeaInput, OfferPack } from "./types";

const base: IdeaInput = {
  idea: "A meal planner for busy parents who hate grocery waste",
  audience: "busy parents",
  status: "idea",
  priceBand: 5,
};

const notionFixture: IdeaInput = {
  idea:
    "A Notion template that helps freelance designers track client feedback rounds so revisions do not spiral.",
  audience: "freelance designers",
  status: "idea",
  priceBand: 5,
};

const linkedinFixture: IdeaInput = {
  idea:
    "A Chrome extension that drafts personalized LinkedIn comments for B2B founders so they can network without spending hours.",
  audience: "B2B founders",
  status: "wip",
  priceBand: 9,
};

const META =
  /micro-offer|zero-to-offer|cashflow signal|packaged a micro-offer|sellable micro-offer|turn your rough idea|notes app|without building software|swipe-file offer name|objection-handling faq|social proof prompt sheet|from idea to first sale|people who want a first sale this week/i;

function blob(pack: OfferPack): string {
  return [
    pack.offerName,
    pack.promise,
    pack.deliverables.join("\n"),
    pack.priceWhy,
    pack.salesBlurb,
    pack.twitterPost,
    pack.communityPost,
    pack.gumroadDescription,
    pack.launchChecklist.join("\n"),
  ].join("\n");
}

function assertSellsProduct(pack: OfferPack) {
  const text = blob(pack);
  expect(text).not.toMatch(META);
  expect(pack.offerName).not.toMatch(/\bBundle\b/i);
  expect(pack.offerName).not.toMatch(
    /^(Launch|Quick|Starter|Ready|First|Mini|Pocket|Sprint|Day-One|Ship)\b/i
  );
  expect(pack.promise.toLowerCase()).not.toMatch(/micro-offer|sellable package/);
  expect(pack.communityPost.toLowerCase()).not.toMatch(/packaged a micro-offer/);
  expect(pack.salesBlurb.toLowerCase()).not.toMatch(
    /ideas that never leave the notes app/
  );
}

describe("hashSeed", () => {
  it("is deterministic", () => {
    expect(hashSeed("abc")).toBe(hashSeed("abc"));
    expect(hashSeed("abc")).not.toBe(hashSeed("abd"));
  });
});

describe("extractTheme", () => {
  it("pulls meaningful words", () => {
    const t = extractTheme("an app to help freelancers invoice clients faster");
    expect(t.toLowerCase()).toMatch(/freelance|invoice|client/);
  });

  it("does not return format-only meta names", () => {
    const t = extractTheme(notionFixture.idea);
    expect(t.toLowerCase()).not.toMatch(/^notion template$/);
    expect(t.toLowerCase()).toMatch(/revision|feedback|round|client/);
  });
});

describe("detectProductKind", () => {
  it("detects Notion templates and Chrome extensions", () => {
    expect(detectProductKind(notionFixture.idea)).toBe("notion_template");
    expect(detectProductKind(linkedinFixture.idea)).toBe("chrome_extension");
  });
});

describe("generateOfferPack", () => {
  it("returns a complete pack", () => {
    const pack = generateOfferPack(base);
    expect(pack.offerName.length).toBeGreaterThan(3);
    expect(pack.promise.length).toBeGreaterThan(20);
    expect(pack.deliverables.length).toBeGreaterThanOrEqual(3);
    expect(pack.deliverables.length).toBeLessThanOrEqual(5);
    expect(pack.price).toBe(5);
    expect(pack.priceWhy.length).toBeGreaterThan(20);
    expect(pack.salesBlurb.split(/\s+/).filter(Boolean).length).toBeGreaterThanOrEqual(
      100
    );
    expect(pack.salesBlurb.split(/\s+/).filter(Boolean).length).toBeLessThanOrEqual(
      200
    );
    expect(pack.twitterPost).toContain("$5");
    expect(pack.communityPost).toContain(pack.offerName);
    expect(pack.gumroadDescription).toContain(pack.offerName);
    expect(pack.launchChecklist).toHaveLength(5);
    assertSellsProduct(pack);
  });

  it("is deterministic for same inputs", () => {
    const a = generateOfferPack(base);
    const b = generateOfferPack(base);
    expect(a.offerName).toBe(b.offerName);
    expect(a.promise).toBe(b.promise);
    expect(a.deliverables).toEqual(b.deliverables);
    expect(a.seed).toBe(b.seed);
  });

  it("varies by price band", () => {
    const p1 = generateOfferPack({ ...base, priceBand: 1 });
    const p9 = generateOfferPack({ ...base, priceBand: 9 });
    expect(p1.price).toBe(1);
    expect(p9.price).toBe(9);
    expect(p1.deliverables.length).toBeLessThanOrEqual(p9.deliverables.length);
  });

  it("infers audience when omitted", () => {
    const pack = generateOfferPack({
      idea: "Notion templates for freelance writers",
      status: "wip",
      priceBand: 9,
    });
    expect(pack.promise.toLowerCase()).toMatch(/writer|newsletter|maker|people/);
    expect(pack.promise.toLowerCase()).not.toMatch(/\bthi\b|thiing/);
    expect(pack.deliverables.join(" ").toLowerCase()).not.toMatch(/feedback rounds/);
    assertSellsProduct(pack);
  });

  it("rejects short ideas", () => {
    expect(() =>
      generateOfferPack({ idea: "ab", status: "idea", priceBand: 1 })
    ).toThrow(/at least 3/);
  });

  it("adapts checklist for shipped status", () => {
    const pack = generateOfferPack({ ...base, status: "shipped" });
    expect(pack.launchChecklist.some((s) => /slice|already built|export/i.test(s))).toBe(
      true
    );
  });
});

describe("Notion freelance designer fixture", () => {
  const pack = generateOfferPack(notionFixture);

  it("names the user's product, not a meta bundle", () => {
    expect(pack.offerName.toLowerCase()).toMatch(/revision|feedback|round|client/);
    expect(pack.offerName.toLowerCase()).not.toMatch(/notion template bundle|launch /);
    expect(pack.offerName).not.toMatch(/\bBundle\b/i);
  });

  it("promise is benefit-first for freelance designers", () => {
    expect(pack.promise.toLowerCase()).toMatch(/revision|spiral|feedback|round/);
    expect(pack.promise.toLowerCase()).toMatch(/designer/);
    expect(pack.promise.toLowerCase()).not.toMatch(
      /micro-offer|sellable package|under a day/
    );
  });

  it("deliverables are buyer artifacts of the Notion template", () => {
    const d = pack.deliverables.join(" ").toLowerCase();
    expect(d).toMatch(/notion/);
    expect(d).toMatch(/template|workspace/);
    expect(d).toMatch(/setup/);
    expect(d).toMatch(/example|workflow|client-share|share view|guest view/);
    expect(d).not.toMatch(/zero-to-offer|objection-handling faq|swipe-file/);
  });

  it("sales / social / gumroad copy sells the template to designers", () => {
    expect(pack.salesBlurb.toLowerCase()).toMatch(/designer|revision|feedback/);
    expect(pack.salesBlurb.toLowerCase()).not.toMatch(
      /ideas that never leave the notes app|cashflow signal/
    );
    expect(pack.gumroadDescription.toLowerCase()).toMatch(/designer/);
    expect(pack.gumroadDescription.toLowerCase()).not.toMatch(
      /first sale this week|6-month roadmap/
    );
    expect(pack.twitterPost.toLowerCase()).toMatch(
      /designer|revision|feedback|notion/
    );
    expect(pack.communityPost.toLowerCase()).toMatch(/launched/);
    expect(pack.communityPost.toLowerCase()).not.toMatch(/packaged a micro-offer/);
    assertSellsProduct(pack);
  });

  it("launch checklist is for listing that template", () => {
    const steps = pack.launchChecklist.join(" ").toLowerCase();
    expect(steps).toMatch(/gumroad|lemon/);
    expect(steps).toMatch(/notion|template|duplicate/);
    expect(steps).toMatch(/freelance designers|designer/);
  });
});

describe("LinkedIn Chrome extension fixture", () => {
  const pack = generateOfferPack(linkedinFixture);

  it("names the extension, not a Chrome Extension Bundle", () => {
    expect(pack.offerName.toLowerCase()).toMatch(
      /linkedin|comment|reply|draft|network/
    );
    expect(pack.offerName.toLowerCase()).not.toMatch(
      /chrome extension bundle|launch /
    );
    expect(pack.offerName).not.toMatch(/\bBundle\b/i);
  });

  it("promise is about networking time for B2B founders", () => {
    expect(pack.promise.toLowerCase()).toMatch(
      /founder|linkedin|comment|network|hour/
    );
    expect(pack.promise.toLowerCase()).not.toMatch(/micro-offer|sellable package/);
  });

  it("promise is natural and benefit-first, not a mechanical rewrite", () => {
    const p = pack.promise.toLowerCase();
    expect(p).not.toMatch(/who need to .+ without the usual mess/);
    expect(p).not.toMatch(/is a chrome extension for .+ who need to/);
    // Benefit framing: help / give / stop / without / so …
    expect(p).toMatch(/helps?|gives?|stop |without|so they/);
  });

  it("sales blurb never duplicates the same paragraph twice", () => {
    const paras = pack.salesBlurb
      .split(/\n\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
    const norm = (s: string) =>
      s
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    const normalized = paras.map(norm);
    expect(new Set(normalized).size).toBe(normalized.length);

    // Promise text must not reappear as its own blurb paragraph
    const promiseNorm = norm(pack.promise);
    expect(normalized.some((n) => n === promiseNorm)).toBe(false);

    // Structure: problem → product → what's inside → CTA
    expect(pack.salesBlurb.toLowerCase()).toMatch(/inside:/);
    expect(pack.salesBlurb.toLowerCase()).toMatch(/grab .+ for \$9/);
    expect(paras.length).toBeGreaterThanOrEqual(4);
  });

  it("deliverables are extension artifacts buyers receive", () => {
    const d = pack.deliverables.join(" ").toLowerCase();
    expect(d).toMatch(/extension|chrome/);
    expect(d).toMatch(/install|preset|shortcut|zip|sideload|quick-start/);
    expect(d).not.toMatch(/zero-to-offer|objection-handling faq|swipe-file/);
  });

  it("copy is paste-ready to sell the extension to founders", () => {
    expect(pack.salesBlurb.toLowerCase()).toMatch(/founder|linkedin|comment/);
    expect(pack.gumroadDescription.toLowerCase()).toMatch(/founder|linkedin/);
    expect(pack.twitterPost.toLowerCase()).toMatch(/founder|linkedin|comment|extension/);
    expect(pack.communityPost.toLowerCase()).not.toMatch(/packaged a micro-offer/);
    expect(pack.launchChecklist.join(" ").toLowerCase()).toMatch(
      /extension|zip|chrome|readme/
    );
    assertSellsProduct(pack);
  });
});

describe("parseIdea", () => {
  it("extracts action and outcome from the Notion idea", () => {
    const p = parseIdea(notionFixture.idea, notionFixture.audience);
    expect(p.kind).toBe("notion_template");
    expect(p.action.toLowerCase()).toMatch(/track|feedback|round/);
    expect(p.outcome.toLowerCase()).toMatch(/revision|spiral/);
    expect(p.pain.toLowerCase()).toMatch(/revision|spiral/);
  });

  it("reframes replace-X-with-Y into a benefit-first action", () => {
    const p = parseIdea(
      "A Chrome extension that replaces the LinkedIn feed with a daily job search checklist",
      "job seekers"
    );
    expect(p.action.toLowerCase()).toMatch(/job search checklist/);
    expect(p.action.toLowerCase()).toMatch(/instead of/);
    expect(p.action.toLowerCase()).not.toMatch(/^replace /);
    expect(p.coreName.toLowerCase()).toMatch(/job search|checklist/);
    expect(p.coreName.toLowerCase()).not.toMatch(/feed os/);
  });
});

describe("packToMarkdown", () => {
  it("includes key sections", () => {
    const md = packToMarkdown(generateOfferPack(base));
    expect(md).toContain("# ");
    expect(md).toContain("## Buyer deliverables");
    expect(md).toContain("## Gumroad description");
    expect(md).toContain("## 24-hour launch checklist");
  });
});
