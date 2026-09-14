# Open items — morning checklist for James

## Must-do before real revenue

1. **Stripe live keys**
   - Create product mentally as “FirstBuck Full Pack Unlock” ($1)
   - Set `STRIPE_SECRET_KEY` (live) in Vercel env
   - Set `UNLOCK_COOKIE_SECRET` to a long random string
   - Set `NEXT_PUBLIC_APP_URL` to the production domain
   - Run a $1 test purchase end-to-end; confirm cookie + success page

2. **Domain**
   - Point custom domain at Vercel project
   - Update `NEXT_PUBLIC_APP_URL`
   - Confirm HTTPS + cookie `Secure` flag works

3. **Smoke test**
   - Landing loads
   - Free generation works
   - Gumroad section locked; Markdown disabled
   - Unlock → success → full pack + download
   - Print stylesheet looks OK

## Launch posts (use MARKETING.md)

- [ ] X launch + reply with link
- [ ] IndieHackers “I launched”
- [ ] Reddit r/SideProject
- [ ] 10 personal DMs to makers

## Nice-to-have this week

- [ ] OG image (`/og.png`)
- [ ] Vercel Analytics or Plausible
- [ ] Rate-limit `/api/generate` (Upstash / simple IP)
- [ ] Optional `OPENAI_API_KEY` for blurb polish
- [ ] Refund policy one-liner in footer

## Known stubs / behaviors

- Without `STRIPE_SECRET_KEY` in **production**, unlock shows “payments not configured”
- Mock unlock (`/api/unlock/mock`) only works when `NODE_ENV=development`
- OpenAI polish is optional and silently falls back to templates
- Regenerate is one-time per browser session (sessionStorage)

## Support / ops

- Watch Stripe Dashboard for the first 20 payments
- Keep GitHub Issues open for copy-quality feedback
