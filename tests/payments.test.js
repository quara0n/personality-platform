import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {priceFor, validPaid, verifySignature, handlePurchase, handleWebhook, formEncode, plusGate} from '../lib/payments.js';

const USER = '11111111-2222-3333-4444-555555555555';
const env = {STRIPE_SECRET_KEY: 'sk_test_x', STRIPE_WEBHOOK_SECRET: 'whsec_x', SUPABASE_URL: 'https://sb.test', SUPABASE_ANON_KEY: 'anon', SUPABASE_SERVICE_ROLE_KEY: 'service', SITE_URL: 'https://kaleidotest.com'};

/** Fakes Stripe and Supabase; records every call. `owned` is what the purchases table returns. */
function fake({owned = [], session = {}, refuseVipps = false} = {}) {
  const calls = [];
  globalThis.fetch = async (url, init = {}) => {
    calls.push({url: String(url), init});
    const ok = body => ({ok: true, status: 200, json: async () => body, text: async () => JSON.stringify(body)});
    if (url.endsWith('/auth/v1/user')) return init.headers.Authorization === 'Bearer good' ? ok({id: USER, email: 'a@b.no'}) : {ok: false, status: 401, json: async () => ({})};
    if (url.includes('/rest/v1/purchases?select')) return ok(owned.map(tier => ({tier})));
    if (url.includes('/rest/v1/purchases?payment_intent')) return {ok: true, status: 204, json: async () => null, text: async () => ''};
    if (url.includes('/rest/v1/purchases?on_conflict')) return {ok: true, status: 201, json: async () => null, text: async () => ''};
    if (url.endsWith('/v1/checkout/sessions')) {
      if (refuseVipps && String(init.body).includes('vipps')) return {ok: false, status: 400, json: async () => ({error: {message: 'vipps not enabled'}})};
      return ok({url: 'https://checkout.stripe.com/c/pay/cs_test_1'});
    }
    if (url.includes('/v1/checkout/sessions/')) return ok(session);
    throw new Error('unexpected ' + url);
  };
  return calls;
}
const paid = (over = {}) => ({object: 'checkout.session', id: 'cs_test_abc', mode: 'payment', status: 'complete', payment_status: 'paid', client_reference_id: USER, metadata: {user_id: USER, tier: 'plus'}, currency: 'nok', amount_total: 7900, livemode: false, payment_intent: 'pi_1', ...over});

test('prices come from the fixed list, with the difference for an upgrade', () => {
  assert.deepEqual(priceFor('base', 'nok'), {item: 'base', amount: 4900});
  assert.deepEqual(priceFor('plus', 'usd'), {item: 'plus', amount: 799});
  assert.deepEqual(priceFor('plus', 'nok', 'base'), {item: 'upgrade', amount: 3000});
  assert.equal(priceFor('base', 'nok', 'base'), null);
  assert.equal(priceFor('base', 'nok', 'plus'), null);
  assert.equal(priceFor('gold', 'nok'), null);
  assert.equal(priceFor('base', 'eur'), null);
  assert.ok(validPaid('plus', 'nok', 3000) && validPaid('base', 'usd', 499));
  assert.ok(!validPaid('base', 'nok', 3000) && !validPaid('plus', 'nok', 100));
});

test('the form encoding nests like Stripe expects', () => {
  assert.equal(decodeURIComponent(formEncode({a: [{b: {c: 1}}], d: undefined}).toString()), 'a[0][b][c]=1');
});

test('checkout needs a signed-in user and sets the price on the server', async () => {
  fake();
  assert.equal((await handlePurchase({action: 'checkout', tier: 'base'}, 'bad', env)).status, 401);
  assert.equal((await handlePurchase({action: 'checkout', tier: 'base'}, 'good', {})).status, 503);
  const calls = fake();
  const out = await handlePurchase({action: 'checkout', tier: 'plus', market: 'NO', lang: 'no', amount: 1}, 'good', env);
  assert.equal(out.status, 200);
  assert.match(out.body.url, /^https:\/\/checkout\.stripe\.com/);
  const body = new URLSearchParams(calls.find(c => c.url.endsWith('/v1/checkout/sessions')).init.body);
  assert.equal(body.get('line_items[0][price_data][unit_amount]'), '7900');
  assert.equal(body.get('line_items[0][price_data][currency]'), 'nok');
  // The picture lists what the report holds, in the buyer's language.
  assert.match(body.get('line_items[0][price_data][product_data][images][0]'), /\/assets\/checkout\/plus-no\.jpg$/);
  assert.equal(body.get('client_reference_id'), USER);
  assert.equal(body.get('metadata[tier]'), 'plus');
  assert.equal(body.get('success_url'), 'https://kaleidotest.com/no?paid={CHECKOUT_SESSION_ID}#report');
  assert.match(body.get('custom_text[submit][message]'), /angreretten/);
  assert.equal(body.get('payment_method_types[0]'), null);
  assert.equal(body.get('managed_payments[enabled]'), 'false');
});

test('an owner of the 49 kr report pays the difference, and an owner of «plus» is not charged again', async () => {
  let calls = fake({owned: ['base']});
  await handlePurchase({action: 'checkout', tier: 'plus', market: 'US'}, 'good', env);
  assert.equal(new URLSearchParams(calls.at(-1).init.body).get('line_items[0][price_data][unit_amount]'), '300');
  calls = fake({owned: ['base', 'plus']});
  const out = await handlePurchase({action: 'checkout', tier: 'base', market: 'NO'}, 'good', env);
  assert.equal(out.status, 409);
  assert.equal(out.body.tier, 'plus');
  assert.ok(!calls.some(c => c.url.includes('checkout/sessions')));
});

test('the Vipps button asks for Vipps with the preview header and falls back when Stripe refuses', async () => {
  let calls = fake();
  await handlePurchase({action: 'checkout', tier: 'base', market: 'NO', method: 'vipps'}, 'good', {...env, STRIPE_VIPPS: 'on'});
  let s = calls.filter(c => c.url.endsWith('/v1/checkout/sessions'));
  assert.equal(s.length, 1);
  assert.equal(new URLSearchParams(s[0].init.body).get('payment_method_types[0]'), 'vipps');
  assert.match(s[0].init.headers['Stripe-Version'], /vipps_preview=v1/);
  calls = fake({refuseVipps: true});
  const out = await handlePurchase({action: 'checkout', tier: 'base', market: 'NO', method: 'vipps'}, 'good', {...env, STRIPE_VIPPS: 'on'});
  assert.equal(out.status, 200);
  s = calls.filter(c => c.url.endsWith('/v1/checkout/sessions'));
  assert.equal(new URLSearchParams(s.at(-1).init.body).get('payment_method_types[0]'), null);
  // Without STRIPE_VIPPS=on, Vipps is never asked for.
  calls = fake();
  await handlePurchase({action: 'checkout', tier: 'base', market: 'NO', method: 'vipps'}, 'good', env);
  assert.ok(!calls.find(c => c.url.endsWith('/v1/checkout/sessions')).init.headers['Stripe-Version']);
});

test('confirm stores only a paid session that belongs to the user and has the right amount', async () => {
  let calls = fake({session: paid(), owned: ['plus']});
  let out = await handlePurchase({action: 'confirm', session: 'cs_test_abc'}, 'good', env);
  assert.deepEqual(out.body, {tier: 'plus', paid: true, amount: 79, currency: 'NOK'});
  const insert = calls.find(c => c.url.includes('on_conflict=id'));
  assert.equal(JSON.parse(insert.init.body).amount, 7900);
  assert.match(insert.init.headers.Prefer, /ignore-duplicates/);
  calls = fake({session: paid({client_reference_id: '99999999-2222-3333-4444-555555555555'})});
  assert.equal((await handlePurchase({action: 'confirm', session: 'cs_test_abc'}, 'good', env)).status, 403);
  for (const bad of [{payment_status: 'unpaid'}, {amount_total: 100}, {currency: 'eur'}, {metadata: {user_id: USER, tier: 'gold'}}]) {
    calls = fake({session: paid(bad)});
    await handlePurchase({action: 'confirm', session: 'cs_test_abc'}, 'good', env);
    assert.ok(!calls.some(c => c.url.includes('on_conflict')), JSON.stringify(bad));
  }
  assert.equal((await handlePurchase({action: 'confirm', session: '../x'}, 'good', env)).status, 400);
});

test('the webhook checks Stripe\'s signature before storing anything', async () => {
  const raw = JSON.stringify({type: 'checkout.session.completed', data: {object: paid()}});
  const t = Math.floor(Date.now() / 1000), sig = createHmac('sha256', env.STRIPE_WEBHOOK_SECRET).update(`${t}.${raw}`).digest('hex');
  assert.ok(verifySignature(raw, `t=${t},v1=${sig}`, env.STRIPE_WEBHOOK_SECRET));
  assert.ok(!verifySignature(raw + ' ', `t=${t},v1=${sig}`, env.STRIPE_WEBHOOK_SECRET));
  assert.ok(!verifySignature(raw, `t=${t - 3600},v1=${sig}`, env.STRIPE_WEBHOOK_SECRET));
  let calls = fake();
  assert.equal((await handleWebhook(raw, `t=${t},v1=bad`, env)).status, 400);
  assert.ok(!calls.some(c => c.url.includes('on_conflict')));
  calls = fake();
  assert.equal((await handleWebhook(raw, `t=${t},v1=${sig}`, env)).status, 200);
  assert.equal(calls.filter(c => c.url.includes('on_conflict')).length, 1);
});

test('a full refund removes the purchase, and the old success link cannot bring it back', async () => {
  const sign = raw => {const t = Math.floor(Date.now() / 1000); return `t=${t},v1=${createHmac('sha256', env.STRIPE_WEBHOOK_SECRET).update(`${t}.${raw}`).digest('hex')}`;};
  const refund = refunded => JSON.stringify({type: 'charge.refunded', data: {object: {object: 'charge', refunded, payment_intent: 'pi_1'}}});
  let calls = fake();
  assert.equal((await handleWebhook(refund(true), sign(refund(true)), env)).status, 200);
  const del = calls.find(c => c.init.method === 'DELETE');
  assert.match(del.url, /purchases\?payment_intent=eq\.pi_1$/);
  calls = fake();
  await handleWebhook(refund(false), sign(refund(false)), env);
  assert.ok(!calls.some(c => c.init.method === 'DELETE'), 'a partial refund keeps the report');
  calls = fake({session: paid({payment_intent: {id: 'pi_1', latest_charge: {refunded: true}}})});
  await handlePurchase({action: 'confirm', session: 'cs_test_abc'}, 'good', env);
  assert.match(calls.find(c => c.url.includes('/v1/checkout/sessions/')).url, /expand\[\]=payment_intent\.latest_charge/);
  assert.ok(!calls.some(c => c.url.includes('on_conflict')));
});

test('AI writing needs a «plus» purchase once payments are on', async () => {
  assert.equal(await plusGate('', {}), null);
  fake();
  assert.equal((await plusGate('bad', env)).status, 401);
  fake({owned: ['base']});
  assert.equal((await plusGate('good', env)).status, 402);
  fake({owned: ['plus']});
  assert.equal(await plusGate('good', env), null);
});
