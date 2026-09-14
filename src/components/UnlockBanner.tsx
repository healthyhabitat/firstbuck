"use client";

import { useState } from "react";

export function UnlockBanner({
  paymentsConfigured,
  canMock,
}: {
  paymentsConfigured: boolean;
  canMock: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function unlock() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = (await res.json()) as {
        url?: string;
        error?: string;
        message?: string;
        mock?: boolean;
      };
      if (!res.ok) {
        setError(data.message ?? "Payments are not configured yet.");
        setBusy(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError("No checkout URL returned.");
    } catch {
      setError("Network error — try again.");
    }
    setBusy(false);
  }

  return (
    <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/15 to-orange-600/10 p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
        Free preview · unlock full pack
      </p>
      <h3 className="mt-1 text-xl font-bold text-amber-50">
        Get everything for $1
      </h3>
      <ul className="mt-3 space-y-1.5 text-sm text-slate-300">
        <li>✓ Markdown download of the full pack</li>
        <li>✓ Gumroad-ready product description</li>
        <li>✓ Remove the “Made with FirstBuck” mark</li>
        <li>✓ One free regenerate</li>
      </ul>
      {!paymentsConfigured && !canMock ? (
        <p className="mt-4 rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          Payments not configured. Set <code className="text-rose-200">STRIPE_SECRET_KEY</code>{" "}
          to enable $1 unlock.
        </p>
      ) : (
        <button
          type="button"
          onClick={unlock}
          disabled={busy}
          className="mt-5 w-full rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-[#070b14] transition hover:bg-amber-400 disabled:opacity-60"
        >
          {busy
            ? "Starting checkout…"
            : canMock && !paymentsConfigured
              ? "Unlock free (dev mock) →"
              : "Unlock full pack — $1 →"}
        </button>
      )}
      {error ? (
        <p className="mt-2 text-sm text-rose-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
