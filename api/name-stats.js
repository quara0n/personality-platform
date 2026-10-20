// Vercel function: GET /api/name-stats, aggregate counts of profile characters. See lib/name-stats.js.
import {nameStats} from '../lib/name-stats.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); res.status(405).json({error: 'Use GET.'}); return; }
  const result = await nameStats(process.env);
  res.setHeader('Cache-Control', result.status === 200 ? 'public, s-maxage=900, stale-while-revalidate=3600' : 'no-store');
  res.status(result.status).json(result.body);
}
