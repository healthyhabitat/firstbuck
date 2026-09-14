"use client";

import { useState } from "react";
import type { PriceBand, ProjectStatus } from "@/lib/types";

export interface FormValues {
  idea: string;
  audience: string;
  status: ProjectStatus;
  priceBand: PriceBand;
}

export function IdeaForm({
  onSubmit,
  loading,
  initial,
}: {
  onSubmit: (values: FormValues) => void;
  loading?: boolean;
  initial?: Partial<FormValues>;
}) {
  const [idea, setIdea] = useState(initial?.idea ?? "");
  const [audience, setAudience] = useState(initial?.audience ?? "");
  const [status, setStatus] = useState<ProjectStatus>(initial?.status ?? "idea");
  const [priceBand, setPriceBand] = useState<PriceBand>(initial?.priceBand ?? 5);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (idea.trim().length < 3) {
      setError("Give me a bit more — at least a rough sentence.");
      return;
    }
    setError(null);
    onSubmit({ idea: idea.trim(), audience: audience.trim(), status, priceBand });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="idea" className="mb-1.5 block text-sm font-medium text-slate-200">
          Your rough idea <span className="text-amber-400">*</span>
        </label>
        <textarea
          id="idea"
          name="idea"
          required
          rows={4}
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g. A Notion dashboard that helps freelancers track invoices and late payments"
          className="w-full resize-y rounded-xl border border-white/10 bg-[#070b14] px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          disabled={loading}
        />
        {error ? (
          <p className="mt-1.5 text-sm text-rose-400" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor="audience"
          className="mb-1.5 block text-sm font-medium text-slate-200"
        >
          Audience <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <input
          id="audience"
          name="audience"
          type="text"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="e.g. freelancers who hate chasing invoices"
          className="w-full rounded-xl border border-white/10 bg-[#070b14] px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          disabled={loading}
        />
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-slate-200">Status</legend>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              ["idea", "Idea"],
              ["wip", "WIP"],
              ["shipped", "Shipped"],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm font-medium transition ${
                status === value
                  ? "border-amber-500/60 bg-amber-500/15 text-amber-100"
                  : "border-white/10 bg-[#070b14] text-slate-400 hover:border-white/20"
              }`}
            >
              <input
                type="radio"
                name="status"
                value={value}
                checked={status === value}
                onChange={() => setStatus(value)}
                className="sr-only"
                disabled={loading}
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-slate-200">
          Price band
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {([1, 5, 9] as const).map((p) => (
            <label
              key={p}
              className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm font-medium transition ${
                priceBand === p
                  ? "border-amber-500/60 bg-amber-500/15 text-amber-100"
                  : "border-white/10 bg-[#070b14] text-slate-400 hover:border-white/20"
              }`}
            >
              <input
                type="radio"
                name="priceBand"
                value={p}
                checked={priceBand === p}
                onChange={() => setPriceBand(p)}
                className="sr-only"
                disabled={loading}
              />
              ${p}
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-base font-semibold text-[#070b14] transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#070b14]/30 border-t-[#070b14]" />
            Crafting your micro-offer…
          </>
        ) : (
          "Generate my $1–$9 offer →"
        )}
      </button>
    </form>
  );
}
