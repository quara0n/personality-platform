// Vercel function: POST /api/career-report. See lib/career-llm.js.
import {handleCareerRequest} from '../lib/career-llm.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); res.status(405).json({error: 'Use POST.'}); return; }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
  const result = await handleCareerRequest(body);
  res.setHeader('Cache-Control', 'no-store');
  res.status(result.status).json(result.body);
}
