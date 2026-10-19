// Vercel function: POST /api/stripe-webhook. Stripe signs the raw body, so it is read as a stream and never parsed
// before the signature is checked. See lib/payments.js.
import {handleWebhook} from '../lib/payments.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); res.status(405).json({error: 'Use POST.'}); return; }
  const chunks = [];
  for await (const chunk of req) chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  let raw = Buffer.concat(chunks).toString('utf8');
  // If the runtime already read the stream, use the unparsed body it kept (a parsed object would fail the signature).
  if (!raw && (typeof req.body === 'string' || Buffer.isBuffer(req.body))) raw = String(req.body);
  const result = await handleWebhook(raw, req.headers['stripe-signature']);
  res.status(result.status).json(result.body);
}
