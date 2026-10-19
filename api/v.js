// Vercel function behind /v/<id> (rewrite in vercel.json): the shared video page. See lib/shares.js.
import {sharePage} from '../lib/shares.js';

export default async function handler(req, res) {
  const {status, html} = await sharePage(String(req.query.id || ''), process.env);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', status === 200 ? 'public, max-age=300, s-maxage=3600' : 'no-store');
  res.status(status).send(html);
}
