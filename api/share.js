// Vercel function: POST /api/share (create, delete, delete-all). See lib/shares.js.
import {handleShare} from '../lib/shares.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); res.status(405).json({error: 'Use POST.'}); return; }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const result = await handleShare(body, token, process.env);
  res.status(result.status).json(result.body);
}
