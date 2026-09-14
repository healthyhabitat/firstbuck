# FirstBuck

**Paste a rough side-project idea → get a complete $1–$9 micro-offer you can sell within 24 hours.**

FirstBuck is a polished micro-product for indie makers: generate an offer name, promise, deliverables, pricing rationale, sales blurb, social posts, Gumroad copy, and a launch checklist — without needing an AI API key.

- **Live:** https://firstbuck-ten.vercel.app
- **Repo:** https://github.com/healthyhabitat/firstbuck
- **Stack:** Next.js App Router, TypeScript, Tailwind CSS, Stripe Checkout
- **Monetization:** First generation free (limited). Full pack unlock = **$1**.

## Features

- Landing page that sells FirstBuck itself
- Idea form: idea (required), audience, status (idea/WIP/shipped), price band ($1/$5/$9)
- Results pack with copy buttons, Markdown download (unlocked), print-friendly layout
- Deterministic copywriting engine (no API required); optional `OPENAI_API_KEY` polish
- Stripe Checkout unlock + signed httpOnly cookie; dev mock unlock when Stripe unset

## Run locally

```bash
npm install
cp .env.example .env.local
# Optional: add STRIPE_SECRET_KEY + UNLOCK_COOKIE_SECRET
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without Stripe keys, unlock uses a **development-only mock** (`/api/unlock/mock`). In production with no Stripe key, the UI shows “payments not configured.”

## Scripts

| Command        | Description                |
|----------------|----------------------------|
| `npm run dev`  | Local development server   |
| `npm run build`| Production build           |
| `npm run start`| Serve production build     |
| `npm test`     | Unit tests (Vitest)        |
| `npm run lint` | ESLint                     |

## Environment variables

See [`.env.example`](./env.example). Never commit secrets.

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_APP_URL` | Recommended | Canonical URL for redirects |
| `STRIPE_SECRET_KEY` | Prod payments | Creates $1 Checkout sessions |
| `UNLOCK_COOKIE_SECRET` | Recommended | Signs the unlock cookie |
| `OPENAI_API_KEY` | Optional | Polishes sales blurb |

## Deploy (Vercel)

```bash
npx vercel --yes
# Set env vars in Vercel dashboard: STRIPE_SECRET_KEY, UNLOCK_COOKIE_SECRET, NEXT_PUBLIC_APP_URL
```

## Docs in this repo

- [PLAN.md](./PLAN.md) — problem, audience, GTM, metrics, risks
- [MARKETING.md](./MARKETING.md) — ready-to-post drafts + PH checklist
- [OPEN_ITEMS.md](./OPEN_ITEMS.md) — morning checklist for shipping live payments

## License

MIT — ship something tiny and charge a dollar.
