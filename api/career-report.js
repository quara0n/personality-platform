// Vercel function: POST /api/career-report. See lib/career-llm.js.
import {handleCareerRequest} from '../lib/career-llm.js';
import {plusGate} from '../lib/payments.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); res.status(405).json({error: 'Use POST.'}); return; }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
  const auth = String(req.headers?.authorization || ''), token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const result = await plusGate(token) || await handleCareerRequest(body);
  res.setHeader('Cache-Control', 'no-store');
  res.status(result.status).json(result.body);
}
