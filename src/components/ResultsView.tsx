"use client";

import { ResultBlock } from "./ResultBlock";
import { UnlockBanner } from "./UnlockBanner";
import { packToMarkdown } from "@/lib/generator";
import type { OfferPack } from "@/lib/types";

export function ResultsView({
  pack,
  unlocked,
  paymentsConfigured,
  canMock,
  onRegenerate,
  canRegenerate,
  regenerating,
}: {
  pack: OfferPack;
  unlocked: boolean;
  paymentsConfigured: boolean;
  canMock: boolean;
  onRegenerate?: () => void;
  canRegenerate?: boolean;
  regenerating?: boolean;
}) {
  function downloadMd() {
    const md = packToMarkdown(pack);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${pack.offerName.replace(/[^\w]+/g, "-").toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4 print:space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400/80">
            Your micro-offer
          </p>
          <h2 className="text-2xl font-bold text-amber-50 sm:text-3xl">
            {pack.offerName}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {unlocked ? (
            <button
              type="button"
              onClick={downloadMd}
              className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-sm font-medium text-amber-100 hover:bg-amber-500/20"
            >
              Download Markdown
            </button>
          ) : (
            <button
              type="button"
              disabled
              title="Unlock for $1 to download"
              className="cursor-not-allowed rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-500"
            >
              Download Markdown 🔒
            </button>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:border-white/20"
          >
            Print
          </button>
          {unlocked && canRegenerate && onRegenerate ? (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={regenerating}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:border-white/20 disabled:opacity-50"
            >
              {regenerating ? "Regenerating…" : "Regenerate (1×)"}
            </button>
          ) : null}
        </div>
      </div>

      {!unlocked ? (
        <div className="print:hidden">
          <UnlockBanner
            paymentsConfigured={paymentsConfigured}
            canMock={canMock}
          />
        </div>
      ) : (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200 print:hidden">
          Full pack unlocked. Copy, download, and launch.
        </p>
      )}

      <ResultBlock title="One-sentence promise" copyText={pack.promise}>
        <p className="text-lg text-slate-100">{pack.promise}</p>
      </ResultBlock>

      <ResultBlock
        title="Buyer deliverables"
        copyText={pack.deliverables.map((d) => `• ${d}`).join("\n")}
      >
        <ul className="list-disc space-y-2 pl-5">
          {pack.deliverables.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </ResultBlock>

      <ResultBlock
        title={`Recommended price: $${pack.price}`}
        copyText={`$${pack.price} — ${pack.priceWhy}`}
      >
        <p>{pack.priceWhy}</p>
      </ResultBlock>

      <ResultBlock title="Sales-page blurb" copyText={pack.salesBlurb}>
        <p className="whitespace-pre-wrap">{pack.salesBlurb}</p>
      </ResultBlock>

      <ResultBlock title="X / Twitter post" copyText={pack.twitterPost}>
        <pre className="whitespace-pre-wrap font-sans text-[15px]">
          {pack.twitterPost}
        </pre>
      </ResultBlock>

      <ResultBlock
        title="IndieHackers / Reddit post"
        copyText={pack.communityPost}
      >
        <pre className="whitespace-pre-wrap font-sans text-[15px]">
          {pack.communityPost}
        </pre>
      </ResultBlock>

      <ResultBlock
        title="Gumroad description"
        copyText={unlocked ? pack.gumroadDescription : undefined}
        locked={!unlocked}
        lockHint="Unlock for $1 to reveal the Gumroad-ready product description."
      >
        <pre className="whitespace-pre-wrap font-sans text-[15px]">
          {pack.gumroadDescription}
        </pre>
      </ResultBlock>

      <ResultBlock
        title="24-hour launch checklist"
        copyText={pack.launchChecklist.map((s, i) => `${i + 1}. ${s}`).join("\n")}
      >
        <ol className="list-decimal space-y-2 pl-5">
          {pack.launchChecklist.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </ResultBlock>

      {!unlocked ? (
        <p className="text-center text-xs text-slate-500 print:block">
          Made with FirstBuck
        </p>
      ) : null}
    </div>
  );
}
