import Link from "next/link";

const benefits = [
  {
    title: "Offer name + promise",
    body: "A sellable title and one sentence buyers instantly understand.",
  },
  {
    title: "Deliverables & price",
    body: "3–5 concrete buyer outcomes plus a $1 / $5 / $9 recommendation with rationale.",
  },
  {
    title: "3 ready-to-post launch messages",
    body: "Sales blurb, X post, and IndieHackers/Reddit draft — plus Gumroad copy when you unlock.",
  },
  {
    title: "24-hour checklist",
    body: "Five steps from blank page to first sale attempt — today, not someday.",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:pb-24 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300">
            <span aria-hidden>⚡</span> Micro-offers for makers
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-amber-50 sm:text-5xl sm:leading-[1.1]">
            Paste a rough idea.
            <span className="block bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Get a $1–$9 offer you can sell tonight.
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
            FirstBuck turns side-project notes into a complete micro-offer pack:
            name, promise, deliverables, launch copy, and a 24-hour checklist —
            so you can chase your first dollar instead of polishing forever.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/create"
              className="inline-flex w-full items-center justify-center rounded-xl bg-amber-500 px-8 py-3.5 text-base font-semibold text-[#070b14] shadow-[0_0_40px_-8px_rgba(245,158,11,0.55)] transition hover:bg-amber-400 sm:w-auto"
            >
              Generate my offer — free →
            </Link>
            <p className="text-sm text-slate-400">
              Free preview in this browser · Full unlock{" "}
              <span className="font-semibold text-amber-300">$1</span>
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-white/5 bg-[#0c1222]/50 px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-amber-50">
            Everything you need to list something tiny
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-slate-400">
            Not another endless roadmap. A pack you can paste into Gumroad before
            dinner.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-white/8 bg-[#070b14]/60 p-5"
              >
                <h3 className="font-semibold text-amber-200">{b.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center text-2xl font-bold text-amber-50">
            Three steps to your first buck
          </h2>
          <ol className="mt-8 space-y-4">
            {[
              "Paste your idea (audience optional). Pick status + price band.",
              "Get a full micro-offer pack in seconds — copy any block.",
              "List it, post it, DM five people. Learn by selling.",
            ].map((step, i) => (
              <li
                key={step}
                className="flex gap-4 rounded-2xl border border-white/8 bg-[#0c1222]/60 p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-[#070b14]">
                  {i + 1}
                </span>
                <p className="pt-1 text-slate-200">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pricing framing */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent p-8 text-center">
          <h2 className="text-2xl font-bold text-amber-50">
            Free preview. $1 to keep the full pack.
          </h2>
          <p className="mt-3 text-slate-300 leading-relaxed">
            Generate a watermarked preview free in this browser. Unlock Markdown
            download, Gumroad copy, remove the watermark, and get one regenerate
            — all for a single dollar. Same impulse-buy energy we preach.
          </p>
          <Link
            href="/create"
            className="mt-6 inline-flex rounded-xl bg-amber-500 px-8 py-3.5 text-base font-semibold text-[#070b14] hover:bg-amber-400"
          >
            Start free →
          </Link>
        </div>
      </section>
    </main>
  );
}
