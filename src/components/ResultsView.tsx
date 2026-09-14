"use client";

import { ResultBlock } from "./ResultBlock";
import { UnlockBanner } from "./UnlockBanner";
import { useCheckout } from "@/hooks/useCheckout";
import { packToMarkdown } from "@/lib/generator";
import type { OfferPack } from "@/lib/types";

const NAV = [
  { href: "#offer", label: "Offer" },
  { href: "#deliverables", label: "Deliverables" },
  { href: "#copy", label: "Copy" },
  { href: "#checklist", label: "Checklist" },
] as const;

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
  const { busy, notice, unlock, ctaLabel } = useCheckout({
    paymentsConfigured,
    canMock,
  });

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

  const unlockBtn = (
    <button
      type="button"
      onClick={unlock}
      disabled={busy}
      className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-semibold text-[#070b14] transition hover:bg-amber-400 disabled:opacity-60"
    >
      {busy ? "Starting…" : "Unlock full pack — $1"}
    </button>
  );

  return (
    <div className="relative space-y-4 pb-24 print:space-y-3 print:pb-0">
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400/80">
            Your micro-offer
          </p>
          <h2 className="text-2xl font-bold text-amber-50 sm:text-3xl">
            {pack.offerName}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {unlocked ? (
            <button
              type="button"
              onClick={downloadMd}
              className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-sm font-medium text-amber-100 hover:bg-amber-500/20"
            >
              Download Markdown
            </button>
          ) : (
            <>
              <button
                type="button"
                disabled
                title="Unlock for $1 to download"
                className="cursor-not-allowed rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-500"
              >
                Download Markdown 🔒
              </button>
              {unlockBtn}
            </>
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

      {/* Section jump links */}
      <nav
        aria-label="Results sections"
        className="sticky top-0 z-20 -mx-1 flex gap-1 overflow-x-auto rounded-xl border border-white/8 bg-[#070b14]/90 p-1.5 backdrop-blur-md print:hidden"
      >
        {NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-amber-200"
          >
            {item.label}
          </a>
        ))}
      </nav>

      {!unlocked ? (
        <div className="print:hidden">
          <UnlockBanner
            paymentsConfigured={paymentsConfigured}
            canMock={canMock}
            onUnlock={unlock}
            busy={busy}
            notice={notice}
            ctaLabel={ctaLabel}
          />
        </div>
      ) : (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200 print:hidden">
          Full pack unlocked. Copy, download, and launch.
        </p>
      )}

      <div id="offer" className="scroll-mt-24 space-y-4">
        <ResultBlock title="One-sentence promise" copyText={pack.promise}>
          <p className="text-lg text-slate-100">{pack.promise}</p>
        </ResultBlock>

        <ResultBlock
          title={`Recommended price: $${pack.price}`}
          copyText={`$${pack.price} — ${pack.priceWhy}`}
        >
          <p>{pack.priceWhy}</p>
        </ResultBlock>
      </div>

      <div id="deliverables" className="scroll-mt-24">
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
      </div>

      <div id="copy" className="scroll-mt-24 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 print:hidden">
          3 ready-to-post launch messages
        </p>
        <ResultBlock title="1 · Sales-page blurb" copyText={pack.salesBlurb}>
          <p className="whitespace-pre-wrap">{pack.salesBlurb}</p>
        </ResultBlock>

        <ResultBlock title="2 · X / Twitter post" copyText={pack.twitterPost}>
          <pre className="whitespace-pre-wrap font-sans text-[15px]">
            {pack.twitterPost}
          </pre>
        </ResultBlock>

        <ResultBlock
          title="3 · IndieHackers / Reddit post"
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
          lockAction={!unlocked ? unlockBtn : undefined}
        >
          <pre className="whitespace-pre-wrap font-sans text-[15px]">
            {pack.gumroadDescription}
          </pre>
        </ResultBlock>
      </div>

      <div id="checklist" className="scroll-mt-24">
        <ResultBlock
          title="24-hour launch checklist"
          copyText={pack.launchChecklist
            .map((s, i) => `${i + 1}. ${s}`)
            .join("\n")}
        >
          <ol className="list-decimal space-y-2 pl-5">
            {pack.launchChecklist.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </ResultBlock>
      </div>

      {!unlocked ? (
        <p className="text-center text-xs text-slate-500 print:block">
          Made with FirstBuck
        </p>
      ) : null}

      {/* Sticky bottom actions */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#070b14]/95 px-4 py-3 backdrop-blur-md print:hidden">
        <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-2">
          <p className="truncate text-sm text-slate-400">
            {unlocked ? "Full pack unlocked" : "Preview · unlock to download"}
          </p>
          <div className="flex flex-wrap gap-2">
            {unlocked ? (
              <button
                type="button"
                onClick={downloadMd}
                className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-100 hover:bg-amber-500/20"
              >
                Download Markdown
              </button>
            ) : (
              <>
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-500"
                >
                  Download 🔒
                </button>
                <button
                  type="button"
                  onClick={unlock}
                  disabled={busy}
                  className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-[#070b14] hover:bg-amber-400 disabled:opacity-60"
                >
                  {busy ? "Starting…" : "Unlock full pack — $1"}
                </button>
              </>
            )}
          </div>
        </div>
        {notice && !unlocked ? (
          <p className="mx-auto mt-2 max-w-2xl text-center text-xs text-amber-200/90">
            {notice}
          </p>
        ) : null}
      </div>
    </div>
  );
}
