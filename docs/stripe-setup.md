# Stripe setup — confirmed commercial decisions

## Current integration (2026-10-18)

Stripe Checkout (hosted page) is built in: `lib/payments.js`, `api/purchase.js`, `api/stripe-webhook.js`,
`supabase/migrations/20261018000000_purchases.sql`. Payments switch on when `STRIPE_SECRET_KEY` is set in Vercel.

- Prices are fixed on the server (no Stripe Price objects needed): Fordypning 49 kr / $4.99, Fordypning + tilpasset
  79 kr / $7.99, and the upgrade from 49 kr to «plus» 30 kr / $3.00. The browser only sends the tier and the market.
- Card, Apple Pay and Google Pay come from Stripe's dynamic payment methods (switched on under Settings → Payment
  methods). Vipps (Norway, NOK) is a private preview at Stripe: request access, then set `STRIPE_VIPPS=on`. The Vipps
  button opens a Vipps-only page; if Stripe refuses, the normal page opens.
- A purchase counts only after the server has read a paid Checkout Session (webhook `checkout.session.completed`
  / `checkout.session.async_payment_succeeded`, or `confirm` when the buyer returns) and checked user, tier,
  amount and currency. Rows are keyed by the session id, so repeats are ignored. Test purchases (`livemode=false`)
  do not count once live keys are in.
- Metadata holds only the Supabase user id and the tier, never answers or scores.
- Norway: the consent to immediate delivery is shown above the pay button in Checkout (`custom_text.submit`).
- The report (#report) needs a purchase when payments are on; #demo stays open. The AI endpoint is not yet gated
  on the server.

Vercel environment (Production and Preview): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
`SUPABASE_SERVICE_ROLE_KEY` (server only, never in config.js), optional `STRIPE_VIPPS=on`; `SUPABASE_URL` and
`SUPABASE_ANON_KEY` are already set. Webhook endpoint: `https://kaleidotest.com/api/stripe-webhook` with the two
events above. Test locally with `node scripts/payment-check.cjs` (browser) and `npm test` (server logic).

Before live payments: Rune's go-ahead, live keys and a live webhook, receipts on in Stripe, the privacy text
updated from «when payment is switched on», and the AI endpoint gated on «plus».

## History

Confirmed by Rune on 2026-10-11: one report, one-time purchase, Norway NOK 99 and USA USD 9.99, Stripe. On 2026-10-13 Rune changed the prices to NOK 49 and USD 4.99. Both work/career and everyday life are included. These are fixed market prices, not live foreign-exchange conversions.

## Current access and behavior

The Stripe integration is connected to the user-approved 5 sandbox. One product, two one-time prices and two hosted test links exist; their IDs are recorded below. The app displays the selected market price and opens the full report free of charge. The test links are not wired into the app and paid delivery is not enabled.

## Payment and delivery acceptance criteria

Live sale requires a server-side checkout with a fixed allowlist mapping market to verified Stripe price; never accept a browser-supplied amount. The server must verify completed payment and the expected product/currency/amount, process repeat notifications idempotently, and deliver durable report access with a supported recovery path. A success redirect alone must never unlock a purchase. Keep assessment answers out of Stripe metadata. Test cancellation, failed payment, repeated webhook, refreshed success page, mismatched market/price and later access to the purchased report. The current browser-only report preview is not an entitlement system.

Live account access and secure payment delivery remain external dependencies. Seller identity, receipts/refund/support terms, tax setup, secure runtime credentials and hosting/storage for paid delivery must be completed with that account before real checkout is enabled. Do not ask for secret API keys in chat or commit them to this repository.

## Sandbox catalog created 2026-10-11
User explicitly approved account `acct_1UPOcsDrHYnGVSpC` (5 sandbox), livemode=false.
- Product: `prod_VQFE3Y4xdSBpwL`
- NOK 99 one-time price: `price_1UPOjiDrHYnGVSpCvfLLyPnq`
- USD 9.99 one-time price: `price_1UPOjpDrHYnGVSpCR0pzpsQC`
- NOK test link: https://buy.stripe.com/test_4gMfZhcQCfNz7AzaVq8N200 (`plink_1UPOk5DrHYnGVSpC07bVkGee`)
- USD test link: https://buy.stripe.com/test_bJefZhdUGgRDaMLfbG8N201 (`plink_1UPOkCDrHYnGVSpCZRfyFHRV`)
Both links explicitly state test-only, no paid report access. No payment completed yet. Links are not wired into the app. Automatic tax is disabled; tax setup remains undecided. Required signed webhook handling and paid fulfillment are not implemented. No live payment is enabled.
**Outdated after 2026-10-13:** the sandbox prices and test links above are still NOK 99 / USD 9.99. Stripe prices cannot be edited, so new one-time prices for NOK 49 and USD 4.99 (and new test links) must be created in the 5 sandbox and their IDs recorded here. The old prices should then be archived.

This supersedes earlier notes that Stripe was not connected or the catalog was empty.
