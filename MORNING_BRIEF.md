# FirstBuck — Morning brief for James

**Read this first.** Everything you need to go live and post is here.

| | |
|---|---|
| **Live app** | https://firstbuck-ten.vercel.app |
| **Repo** | https://github.com/healthyhabitat/firstbuck |
| **OG image** | https://firstbuck-ten.vercel.app/og.png |

---

## What shipped (done overnight)

- Next.js app: landing, `/create` generator, results pack, Markdown download, print styles
- Deterministic copy engine (works **without** OpenAI); optional `OPENAI_API_KEY` polish
- Stripe Checkout **$1 unlock** + signed httpOnly cookie (`UNLOCK_COOKIE_SECRET`)
- Marketing drafts in [MARKETING.md](./MARKETING.md) (inlined below with live URL)
- Open Graph / Twitter card image + metadata wired to production URL
- Deployed on Vercel: https://firstbuck-ten.vercel.app

---

## How to make the first $1 (ordered)

### 1. Stripe keys

1. Open [Stripe API keys](https://dashboard.stripe.com/apikeys).
2. Copy the **Secret key** (`sk_live_…` for real money, or `sk_test_…` to dry-run).
3. You do **not** need a publishable key for the current Checkout flow (server-only session create). Skip `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` unless you add Elements later.

### 2. Unlock cookie secret

Generate a long random string, e.g.:

```bash
openssl rand -hex 32
```

### 3. Paste into Vercel

Project → **Settings → Environment Variables** (Production + Preview):

| Exact name | Value |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_…` (or `sk_test_…`) |
| `UNLOCK_COOKIE_SECRET` | long random string from step 2 |
| `NEXT_PUBLIC_APP_URL` | `https://firstbuck-ten.vercel.app` |

Optional (not required for first $1):

| Exact name | Value |
|---|---|
| `OPENAI_API_KEY` | only if you want blurb polish |
| `STRIPE_WEBHOOK_SECRET` | only if you add webhooks later |

**Redeploy** after saving env vars (Deployments → … → Redeploy) so Production picks them up.

### 4. Test purchase

1. Open https://firstbuck-ten.vercel.app/create  
2. Generate a free pack.  
3. Click **Unlock** → complete Stripe Checkout ($1 or test card `4242…`).  
4. Land on `/success` → cookie set → full pack + Markdown download + Gumroad section visible.  
5. Confirm payment in [Stripe Dashboard](https://dashboard.stripe.com/payments).

### 5. Then post

Use the copy-paste drafts below (live URL already filled). Order: **X → IndieHackers → Reddit**, then a few personal DMs.

---

## Exact env vars (checklist)

```
STRIPE_SECRET_KEY=sk_live_...          # required for real unlock
UNLOCK_COOKIE_SECRET=<long-random>     # required for signed cookie
NEXT_PUBLIC_APP_URL=https://firstbuck-ten.vercel.app
```

Publishable key: **not used** by current code. Do not block launch on it.

---

## Copy-paste launch posts

### X / Twitter

```
I built FirstBuck overnight.

Paste a rough side-project idea → get a $1–$9 micro-offer pack:
• name + promise
• deliverables
• sales blurb + social posts
• 24h launch checklist

First generation free. Full pack = $1.

Because validation beats vibes.

https://firstbuck-ten.vercel.app
```

**Thread hook (optional follow-up):**

```
Most “ideas” die in Notes.

Not because they’re bad —
because there’s no tiny thing to sell tomorrow.

I shipped FirstBuck to fix that.
```

### IndieHackers

**Title:** I launched FirstBuck — idea → $1–$9 micro-offer in minutes ($1 unlock)

**Body:**

```
Hey IH 👋

Problem: I kept “building” instead of selling. I wanted something that forces a tiny, listable offer.

**FirstBuck** takes a rough idea and returns:
- Offer name + one-sentence promise
- Buyer deliverables
- Price band rationale ($1/$5/$9)
- Sales blurb, X + community posts, Gumroad copy
- 24-hour launch checklist

Stack: Next.js, templated copy engine (works without an API key), Stripe $1 unlock.

Would love feedback:
1. Is the promise clear in 5 seconds?
2. Would you pay $1 for the full pack after a free gen?
3. What’s the weakest section of the output?

Link: https://firstbuck-ten.vercel.app
```

### Reddit — r/SideProject

**Title:** FirstBuck — turn a rough idea into a sellable $1–$9 micro-offer (free first gen)

**Body:**

```
Built this for myself: I had too many half-ideas and zero listed products.

You paste an idea → get a complete micro-offer pack (name, promise, deliverables, copy, checklist). First generation free; $1 unlocks Markdown + Gumroad blurb.

Not raising a fund. Just trying to help people make a first dollar this week.

Happy to generate one live if you drop an idea in the comments.

Link: https://firstbuck-ten.vercel.app
```

More drafts / reply templates: [MARKETING.md](./MARKETING.md).

---

## Blocked without you vs done

| Done (no action needed) | Blocked on you |
|---|---|
| App live on Vercel | Paste `STRIPE_SECRET_KEY` + `UNLOCK_COOKIE_SECRET` + `NEXT_PUBLIC_APP_URL` in Vercel |
| Generator + unlock UX | Redeploy after env vars |
| OG / social preview image | Run a real $1 (or test) purchase |
| Marketing copy ready | Post X / IH / Reddit |
| Repo on GitHub `main` | Optional: custom domain |

Without Stripe env vars, production shows a friendly “payments being set up” message (never leaks env names). Free generation still works.

---

## Suggested 30-minute morning sequence

| Min | Action |
|-----|--------|
| 0–5 | Open this brief + live site; confirm landing + `/create` work |
| 5–12 | Add the 3 env vars in Vercel → Redeploy |
| 12–18 | Test unlock end-to-end (test or live $1) |
| 18–25 | Post X launch (+ thread hook reply) |
| 25–30 | Post IndieHackers + queue Reddit draft for later today |

Then: 5–10 personal DMs to makers. Watch Stripe for the first payments.

---

**Primary checklist:** this file. Secondary: [OPEN_ITEMS.md](./OPEN_ITEMS.md) (points here).
