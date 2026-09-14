import { generateOfferPack } from "./generator";
import type { IdeaInput, OfferPack } from "./types";

/**
 * Generate an offer pack. Uses deterministic engine always.
 * If OPENAI_API_KEY is set, optionally polish the sales blurb (best-effort).
 * Polish must still sell the USER's product to the stated audience — never FirstBuck meta copy.
 */
export async function generateOffer(input: IdeaInput): Promise<OfferPack> {
  const pack = generateOfferPack(input);
  const key = process.env.OPENAI_API_KEY;
  if (!key) return pack;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 280,
        messages: [
          {
            role: "system",
            content:
              "You polish sales blurbs for the USER's product (the idea they typed). Sell that product to the stated audience. Never mention micro-offers, packaging an offer, FirstBuck, cashflow signal, turning an idea into a product, or listing something on Gumroad as a meta-lesson. Return ONLY the improved blurb, 120-180 words, no markdown fences.",
          },
          {
            role: "user",
            content: `Idea: ${input.idea}\nAudience: ${input.audience ?? "the buyers of this product"}\nProduct name: ${pack.offerName}\nPromise: ${pack.promise}\nBlurb:\n${pack.salesBlurb}`,
          },
        ],
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return pack;
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const polished = data.choices?.[0]?.message?.content?.trim();
    if (polished && polished.length > 80) {
      return { ...pack, salesBlurb: polished };
    }
  } catch {
    // graceful fallback — templated pack is fine
  }
  return pack;
}
