import { NextResponse } from "next/server";
import { generateOffer } from "@/lib/generate-offer";
import { isUnlocked } from "@/lib/unlock";
import type { IdeaInput, PriceBand, ProjectStatus } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<IdeaInput>;
    const idea = (body.idea ?? "").trim();
    if (idea.length < 3) {
      return NextResponse.json(
        { error: "Idea must be at least 3 characters." },
        { status: 400 }
      );
    }

    const status = (body.status ?? "idea") as ProjectStatus;
    const priceBand = (Number(body.priceBand) || 5) as PriceBand;
    if (![1, 5, 9].includes(priceBand)) {
      return NextResponse.json({ error: "Invalid price band." }, { status: 400 });
    }

    const pack = await generateOffer({
      idea,
      audience: body.audience?.trim() || undefined,
      status,
      priceBand,
    });

    const unlocked = await isUnlocked();

    const publicPack = unlocked
      ? pack
      : {
          ...pack,
          gumroadDescription: "",
        };

    return NextResponse.json({ pack: publicPack, unlocked });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
