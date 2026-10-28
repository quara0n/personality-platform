// Vercel function: POST /api/profile-email, sends the profile to the address typed in the box. See lib/profile-email.js.
import {handleProfileEmail} from '../lib/profile-email.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); res.status(405).json({error: 'Use POST.'}); return; }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
  const ip = String(req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  const result = await handleProfileEmail(body, ip, process.env);
  res.status(result.status).json(result.body);
}
