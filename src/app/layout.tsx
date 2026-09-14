import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FirstBuck — Turn a rough idea into a $1–$9 offer in minutes",
  description:
    "Paste a side-project idea. Get a complete micro-offer: name, promise, deliverables, sales copy, social posts, and a 24-hour launch checklist. Free preview. Full pack $1.",
  openGraph: {
    title: "FirstBuck — ship a micro-offer today",
    description:
      "From rough idea to sellable $1–$9 pack in minutes. Free preview in your browser.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FirstBuck",
    description: "Paste an idea → get a $1–$9 micro-offer you can sell in 24 hours.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <nav className="print:hidden border-b border-white/5 bg-[#070b14]/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
              <Link
                href="/"
                className="text-sm font-bold tracking-tight text-amber-100"
              >
                First<span className="text-amber-500">Buck</span>
              </Link>
              <div className="flex items-center gap-4 text-sm">
                <Link
                  href="/create"
                  className="text-slate-300 transition hover:text-amber-200"
                >
                  Create
                </Link>
                <Link
                  href="/create"
                  className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-[#070b14] hover:bg-amber-400"
                >
                  Get started — free
                </Link>
              </div>
            </div>
          </nav>
          <div className="flex-1">{children}</div>
          <footer className="print:hidden border-t border-white/5 py-8 text-center text-xs text-slate-500">
            <p>
              FirstBuck · Turn rough ideas into impulse-buy offers ·{" "}
              <a
                href="https://github.com/healthyhabitat/firstbuck"
                className="text-slate-400 underline-offset-2 hover:text-amber-300 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
