# Stripe setup — confirmed commercial decisions

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
