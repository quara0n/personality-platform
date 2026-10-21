// Measurement (Rune 2026-10-21): Google Analytics 4, Google Ads conversions and Microsoft Clarity, only after the
// visitor says yes in the consent banner (ekomloven § 3-15). Nothing from Google or Microsoft loads before that, so
// this is Consent Mode v2 in its basic form: the tags start with consent granted, or not at all.
// The IDs are public and come from the Vercel environment through config.js (GA4_ID, CLARITY_ID, GOOGLE_ADS_ID,
// GOOGLE_ADS_PURCHASE_LABEL). Without any of them there is no banner and no tracking.
// Never send answers, scores, the profile name, email or user ID: events carry only the funnel step and, for
// purchases, the tier, amount and Stripe session id.

const CONSENT = 'kaleido-consent';
const cfg = () => window.FEM_CONFIG || {};
const ids = () => ({ga: cfg().ga4Id || '', ads: cfg().adsId || '', label: cfg().adsPurchaseLabel || '', clarity: cfg().clarityId || ''});
const valid = {ga: /^G-[A-Z0-9]+$/, ads: /^AW-\d+$/, label: /^[\w-]+$/, clarity: /^[a-z0-9]+$/};
/** The configured services, with malformed IDs dropped so nothing odd is put into a script URL. */
function services() {
  const all = ids(), out = {};
  for (const k in all) if (valid[k].test(all[k])) out[k] = all[k];
  return out;
}
export const configured = () => Boolean(services().ga || services().ads || services().clarity);
/** 'granted', 'denied' or '' when the visitor has not chosen yet. */
export function consent() { try { return localStorage.getItem(CONSENT) || ''; } catch { return ''; } }
const granted = () => configured() && consent() === 'granted';

let started = false;
function addScript(src) { const s = document.createElement('script'); s.async = true; s.src = src; document.head.append(s); }
// Pages people read their results on are masked in Clarity recordings, so no scores or report text leave the browser.
const PRIVATE = /^(results|report|account|combos|signin|demo)/;
const route = () => (location.hash || '#home').slice(1) || 'home';
function maskMain() { document.querySelector('main')?.setAttribute('data-clarity-mask', PRIVATE.test(route()) ? 'True' : 'False'); }
function pageView() {
  maskMain();
  if (!granted() || !window.gtag || !services().ga) return;
  // Hash routes become paths so GA4 reports them as pages; the query string (e.g. ?paid=cs_…) is never sent.
  const path = `${location.pathname.replace(/\/$/, '')}/${route().split('/')[0]}`;
  window.gtag('event', 'page_view', {page_location: `${location.origin}${path}`, page_path: path, page_title: document.title});
}

function start() {
  if (started || !granted()) return;
  started = true;
  const {ga, ads, clarity} = services();
  if (ga || ads) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {ad_storage: 'granted', analytics_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'denied'});
    window.gtag('js', new Date());
    if (ga) window.gtag('config', ga, {send_page_view: false, allow_google_signals: false});
    if (ads) window.gtag('config', ads, {allow_ad_personalization_signals: false});
    addScript(`https://www.googletagmanager.com/gtag/js?id=${ga || ads}`);
  }
  if (clarity) {
    window.clarity = window.clarity || function clarityQ() { (window.clarity.q = window.clarity.q || []).push(arguments); };
    window.clarity('consent');
    addScript(`https://www.clarity.ms/tag/${clarity}`);
  }
  pageView();
}

/** A funnel step: test_start, test_complete, login, share, begin_checkout or purchase. */
export function track(name, params = {}) {
  if (!granted()) return;
  const {ga, ads, label} = services();
  if (window.gtag && ga) window.gtag('event', name, params);
  if (window.gtag && ads && label && name === 'purchase') window.gtag('event', 'conversion', {send_to: `${ads}/${label}`, value: params.value, currency: params.currency, transaction_id: params.transaction_id});
  if (window.clarity) window.clarity('event', name);
}
/** Once per tab and `key`, e.g. «login» for a signed-in visit, or a purchase per Stripe session. */
export function trackOnce(name, params, key = name) {
  try { if (sessionStorage.getItem(`kaleido-ev-${key}`)) return; sessionStorage.setItem(`kaleido-ev-${key}`, '1'); } catch {}
  track(name, params);
}

function choose(value) {
  try { localStorage.setItem(CONSENT, value); } catch {}
  document.querySelector('.d-consent')?.remove();
  // Saying no after a yes cannot unload the scripts already running, so the page reloads without them.
  if (value === 'denied' && started) { location.reload(); return; }
  start();
}

/** The consent banner, shown until the visitor chooses. `again` reopens it from the footer link. */
export function consentBanner(tr, again = false) {
  if (!configured() || (!again && consent())) return;
  document.querySelector('.d-consent')?.remove();
  const box = document.createElement('section');
  box.className = 'd-consent no-print';
  box.setAttribute('aria-label', tr('Cookies', 'Informasjonskapsler'));
  box.innerHTML = `<p><b>${tr('May we measure how Kaleido is used?', 'Kan vi måle hvordan Kaleido brukes?')}</b> ${tr('With your yes we use Google Analytics, Google Ads and Microsoft Clarity to see which pages work and whether our ads lead anywhere. They set cookies. Your answers and results are never sent.', 'Sier du ja, bruker vi Google Analytics, Google Ads og Microsoft Clarity for å se hvilke sider som fungerer og om annonsene våre virker. De setter informasjonskapsler. Svarene og resultatene dine sendes aldri.')} <a href="#privacy">${tr('Read more', 'Les mer')}</a></p><div class="d-consent-actions"><button type="button" class="button secondary" data-consent="denied">${tr('Only necessary', 'Bare nødvendige')}</button><button type="button" class="button" data-consent="granted">${tr('Accept', 'Godta')}</button></div>`;
  box.addEventListener('click', e => { const b = e.target.closest('[data-consent]'); if (b) choose(b.dataset.consent); });
  document.body.append(box);
}

/** Starts the tags if the visitor already said yes, and reports each route as a page view. */
export function initAnalytics(tr) {
  if (!configured()) return;
  start();
  consentBanner(tr);
  window.addEventListener('hashchange', pageView);
}
