// Vercel function: POST /api/purchase (status, checkout, confirm). See lib/payments.js.
import {handlePurchase} from '../lib/payments.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); res.status(405).json({error: 'Use POST.'}); return; }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const result = await handlePurchase(body, token, process.env, req.headers);
  res.status(result.status).json(result.body);
}
