// Profile name, e.g. "The Curious Planner" / "Den nysgjerrige planleggeren": a shareable label that
// describes the scores, not a type. Built from the same two traits as "Your combination": the noun
// comes from the trait furthest from the middle, the adjective from the second one. One trait out
// gives the noun alone; none out gives a balanced name. [English, Norwegian bokmål]; editorial copy,
// no MBTI letters or names. Flagged for the same professional review as the combination sentences.
import {standouts} from './combination-copy.js';

const adjectives = {
  O: {high: ['Curious', 'nysgjerrige'], low: ['Down-to-Earth', 'jordnære']},
  C: {high: ['Structured', 'strukturerte'], low: ['Flexible', 'fleksible']},
  E: {high: ['Outgoing', 'utadvendte'], low: ['Quiet', 'stillferdige']},
  A: {high: ['Considerate', 'omtenksomme'], low: ['Direct', 'direkte']},
  N: {high: ['Sensitive', 'følsomme'], low: ['Calm', 'rolige']}
};

// Definite form in Norwegian; all are common gender, so "Den <adjective> <noun>" always fits.
const nouns = {
  O: {high: ['Explorer', 'utforskeren'], low: ['Realist', 'realisten']},
  C: {high: ['Planner', 'planleggeren'], low: ['Improviser', 'improvisatoren']},
  E: {high: ['Enthusiast', 'entusiasten'], low: ['Observer', 'observatøren']},
  A: {high: ['Supporter', 'støttespilleren'], low: ['Challenger', 'utfordreren']},
  N: {high: ['Watcher', 'vokteren'], low: ['Anchor', 'klippen']}
};

const balanced = ['The All-Rounder', 'Den allsidige'];
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

/** Name, the traits it rests on (furthest from the middle first) and a rule id for traceability. */
export function profileName(domains, language) {
  const no = language === 'no' ? 1 : 0, out = standouts(domains);
  const rule = out.map(d => `${d.code}${d.band[0]}`).join('') || 'balanced';
  if (!out.length) return {name: balanced[no], traits: [], ruleId: `profile-name-v1/${rule}`};
  const [core, second] = out, noun = nouns[core.code][core.band][no];
  const name = !second ? (no ? cap(noun) : `The ${noun}`)
    : no ? `Den ${adjectives[second.code][second.band][1]} ${noun}` : `The ${adjectives[second.code][second.band][0]} ${noun}`;
  return {name, traits: out, ruleId: `profile-name-v1/${rule}`};
}

export {adjectives, nouns};
