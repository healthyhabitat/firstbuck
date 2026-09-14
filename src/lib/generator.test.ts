import { describe, it, expect } from "vitest";
import {
  generateOfferPack,
  packToMarkdown,
  hashSeed,
  extractTheme,
} from "./generator";
import type { IdeaInput } from "./types";

const base: IdeaInput = {
  idea: "A meal planner for busy parents who hate grocery waste",
  audience: "busy parents",
  status: "idea",
  priceBand: 5,
};

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
    expect(pack.salesBlurb.split(/\s+/).length).toBeGreaterThanOrEqual(100);
    expect(pack.salesBlurb.split(/\s+/).length).toBeLessThanOrEqual(200);
    expect(pack.twitterPost).toContain("$5");
    expect(pack.communityPost).toContain(pack.offerName);
    expect(pack.gumroadDescription).toContain(pack.offerName);
    expect(pack.launchChecklist).toHaveLength(5);
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

describe("packToMarkdown", () => {
  it("includes key sections", () => {
    const md = packToMarkdown(generateOfferPack(base));
    expect(md).toContain("# ");
    expect(md).toContain("## Buyer deliverables");
    expect(md).toContain("## Gumroad description");
    expect(md).toContain("## 24-hour launch checklist");
  });
});
