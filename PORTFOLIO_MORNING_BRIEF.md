# Portfolio Morning Brief — Mon Sep 14, 2026

**Goal this week:** clear the first $1 (then the next).  
**Rule:** do **not** configure all 6 Stripe projects before posting. Monetize the top 2, announce the portfolio, ship the rest later.

---

## Overnight ships (micro-$1 portfolio)

| # | Product | Live | Repo | One-line |
|---|---------|------|------|----------|
| 1 | **FirstBuck** | https://firstbuck-ten.vercel.app | https://github.com/healthyhabitat/firstbuck | Paste a rough idea → get a $1–$9 micro-offer pack (name, promise, deliverables, launch copy, 24h checklist). |
| 2 | **ReplyCalm** | https://replycalm.vercel.app | https://github.com/healthyhabitat/replycalm | Paste a rough/angry email → get 3 calm professional replies (firm / warm / brief) + subjects + don’t-say. |
| 3 | **RateDeck** | https://ratedeck.vercel.app | https://github.com/healthyhabitat/ratedeck | Skills + market + engagement → freelance rate card with formula, client email, and negotiation scripts. |
| 4 | **PostSprint** | https://postsprint-alpha.vercel.app | https://github.com/healthyhabitat/postsprint | Paste a changelog → 7-day social launch sprint (X posts, LinkedIn, Reddit/IH, thread, hashtags, CTAs). |
| 5 | **WaitlistKit** | https://waitlistkit-eight.vercel.app | https://github.com/healthyhabitat/waitlistkit | Paste a product idea → waitlist landing copy + CTA + social proof + 3-email sequence. |
| 6 | **ScopeGuard** | https://scopeguard-eta.vercel.app | https://github.com/healthyhabitat/scopeguard | Paste a messy client request → scoped proposal pack (scope, out-of-scope, timeline, price, email, red flags). |

Shared stack: Next.js App Router + deterministic generator + Stripe Checkout $1 unlock + Vercel. Free preview; full pack unlock = **$1**.

---

## Shared Stripe env pattern (every project)

Set these **per Vercel project** (same Stripe account is fine; secrets are project-scoped):

| Variable | Purpose |
|----------|---------|
| `STRIPE_SECRET_KEY` | Creates $1 Checkout sessions |
| `UNLOCK_COOKIE_SECRET` | Signs the httpOnly unlock cookie |
| `NEXT_PUBLIC_APP_URL` | Canonical URL for Checkout success/cancel redirects |

Optional (polish only): `OPENAI_API_KEY` on some apps.

**Prod tip:** without `STRIPE_SECRET_KEY`, unlock shows “payments being set up” (or similar). Dev uses `/api/unlock/mock` when Stripe is unset.

---

## Recommended launch order (first dollars this week)

1. **FirstBuck** — already polished; clearest impulse buy; use it to announce the portfolio itself.
2. **ReplyCalm** — urgent emotional use case; people pay when the email is sitting in drafts.
3. **RateDeck** — constant freelancing pain; good weekday traffic.
4. **PostSprint** — time it to your own ship announcements.
5. **WaitlistKit** — pre-launch makers; slightly colder funnel.
6. **ScopeGuard** — live at https://scopeguard-eta.vercel.app; still last for Stripe this morning.

**Monetize first this morning:** FirstBuck + ReplyCalm only.

---

## 45-minute morning sequence

Do **not** open all six Vercel env panels. Clock starts when coffee hits the desk.

| Min | Action |
|-----|--------|
| **0–5** | Open Stripe dashboard once. Confirm one product/price at **$1** (or reuse existing). Copy `STRIPE_SECRET_KEY`. Generate one long random `UNLOCK_COOKIE_SECRET` (same secret can be reused across apps if you want speed). |
| **5–15** | **Vercel → FirstBuck only:** set `STRIPE_SECRET_KEY`, `UNLOCK_COOKIE_SECRET`, `NEXT_PUBLIC_APP_URL=https://firstbuck-ten.vercel.app`. Redeploy / wait for env to apply. |
| **15–25** | **Vercel → ReplyCalm only:** same three vars with `NEXT_PUBLIC_APP_URL=https://replycalm.vercel.app`. Redeploy. |
| **25–30** | Smoke test: generate → unlock → pay $1 (or Stripe test mode if still validating) on FirstBuck, then ReplyCalm. Confirm cookie unlock + Markdown. |
| **30–40** | Post portfolio tweet (see below) + one FirstBuck-specific reply/thread. Drop links in 1–2 Discord/Slack maker channels. Do **not** write six launch posts. |
| **40–45** | Log: Stripe live? FirstBuck paid? ReplyCalm paid? Next session = RateDeck Stripe + one IH/Reddit post. Leave PostSprint / WaitlistKit / ScopeGuard env for tomorrow. |

**Defer:** configuring RateDeck, PostSprint, WaitlistKit, ScopeGuard Stripe. Screenshots of all six dashboards. Perfect branding.

---

## First-$1 prioritization (why this order)

| Priority | Product | Why first |
|----------|---------|-----------|
| 1 | FirstBuck | Polished, meta-relevant (“sell something tiny”), shareable output. |
| 2 | ReplyCalm | High-emotion moments convert; buyer already feels the pain. |
| 3 | RateDeck | Pricing anxiety is always on; easy demo in a tweet. |
| 4–6 | PostSprint → WaitlistKit → ScopeGuard | Strong products; weaker “pay *today*” urgency — monetize after top 2 clear a dollar. |

---

## PORTFOLIO_README

### Overnight portfolio — six $1 micro-tools

Shipped overnight: a family of tiny Next.js products that turn a paste into a paste-ready pack, unlocked for **$1** via Stripe.

| Product | Live | What you get for $1 |
|---------|------|---------------------|
| FirstBuck | https://firstbuck-ten.vercel.app | Micro-offer pack you can list tonight |
| ReplyCalm | https://replycalm.vercel.app | 3 calm reply tones + subjects |
| RateDeck | https://ratedeck.vercel.app | Rate card + client email + scripts |
| PostSprint | https://postsprint-alpha.vercel.app | 7-day social launch sprint |
| WaitlistKit | https://waitlistkit-eight.vercel.app | Waitlist landing + 3 emails |
| ScopeGuard | https://scopeguard-eta.vercel.app | Scoped freelance proposal pack |

Repos: https://github.com/healthyhabitat/{firstbuck,replycalm,ratedeck,postsprint,waitlistkit,scopeguard}

### Copy-paste tweet (portfolio announce)

```
Shipped overnight: 6 micro-$1 tools for makers & freelancers.

Paste → pack → unlock for a dollar.

• FirstBuck — idea → sellable micro-offer
• ReplyCalm — rough email → 3 calm replies
• RateDeck — skills → rate card
• PostSprint — changelog → 7-day launch posts
• WaitlistKit — idea → waitlist + 3 emails
• ScopeGuard — messy brief → scoped proposal
  https://scopeguard-eta.vercel.app

Start here: https://firstbuck-ten.vercel.app
```

Shorter alt:

```
Overnight ship: a portfolio of $1 unlock tools (offer packs, calm email replies, rate cards, launch sprints, waitlists).

First dollars start with FirstBuck → https://firstbuck-ten.vercel.app
```

---

## Open / blockers

- [ ] Stripe env on **FirstBuck** + **ReplyCalm** only (this morning)
- [x] ScopeGuard live: https://scopeguard-eta.vercel.app — still last in monetize order
- [ ] RateDeck Stripe after first paid unlock elsewhere
- [ ] Optional: gist or local-only notes (this file lives at `/workspace/portfolio-notes/PORTFOLIO_MORNING_BRIEF.md`)

---

*Generated for James — Mon Sep 14, 2026. Local only; no GitHub push required.*
