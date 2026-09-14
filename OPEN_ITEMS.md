# Open items — morning checklist for James

**Live:** https://firstbuck-ten.vercel.app  
**Repo:** https://github.com/healthyhabitat/firstbuck

## Must-do before real revenue

1. **Env vars (must-have)**
   - `STRIPE_SECRET_KEY` (live) in Vercel
   - `UNLOCK_COOKIE_SECRET` — long random string
   - `NEXT_PUBLIC_APP_URL` = `https://firstbuck-ten.vercel.app` (or custom domain)
   - Run a $1 test purchase end-to-end; confirm cookie + success page

2. **Post MARKETING drafts** (after keys work)
   - Use [MARKETING.md](./MARKETING.md) — links already point at production
   - [ ] X launch + reply with link
   - [ ] IndieHackers “I launched”
   - [ ] Reddit r/SideProject
   - [ ] 10 personal DMs to makers

3. **Domain** (optional once live URL works)
   - Point custom domain at Vercel project
   - Update `NEXT_PUBLIC_APP_URL`
   - Confirm HTTPS + cookie `Secure` flag works

4. **Smoke test**
   - Landing loads at https://firstbuck-ten.vercel.app
   - Free generation works
   - Gumroad section locked; Markdown disabled
   - Unlock → success → full pack + download
   - Print stylesheet looks OK

## Nice-to-have this week

- [ ] OG image (`/og.png`)
- [ ] Vercel Analytics or Plausible
- [ ] Rate-limit `/api/generate` (Upstash / simple IP)
- [ ] Optional `OPENAI_API_KEY` for blurb polish
- [ ] Refund policy one-liner in footer

## Known stubs / behaviors

- Without `STRIPE_SECRET_KEY` in **production**, unlock CTA shows a friendly “payments being set up” message (never env var names)
- Mock unlock (`/api/unlock/mock`) only works when `NODE_ENV=development`
- OpenAI polish is optional and silently falls back to templates
- Regenerate is one-time per browser session (sessionStorage)

## Support / ops

- Watch Stripe Dashboard for the first 20 payments
- Keep GitHub Issues open for copy-quality feedback
