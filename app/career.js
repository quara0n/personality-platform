// «Din jobb, din profil» (prototype): eight questions about work, one at a time, then a chapter that
// links the answers with the facet scores. The layout and behaviour live in tailored-chapter.js, shared
// with «Hverdagsliv og relasjoner» (life.js); this file gives the job chapter its copy and texts.
import {questions, isComplete, optionLabel, answerTopic, buildCareer, careerRequest, OTHER_MAX} from './career-copy.js';
import {createTailoredChapter} from './tailored-chapter.js';

export const CAREER_KEY = 'fem-career-v1';
const ROLE_ART = new Set(['knowledge', 'care', 'service', 'practical', 'creative', 'own', 'student']);
const asList = v => Array.isArray(v) ? v : v ? [v] : [];

const briefcase = '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 12h18M10.5 12v2h3v-2"/></svg>';

const chapter = createTailoredChapter({
  name: 'career',
  key: CAREER_KEY,
  copy: {questions, isComplete, optionLabel, answerTopic, build: buildCareer, request: careerRequest, OTHER_MAX},
  icon: briefcase,
  // The AI partner card with the robot, as in Everyday life (Rune, 2026-10-17).
  aiCard: true,
  // Rune's question mockup (2026-10-17): the chapter opens straight on the questions, with the picture
  // and the answer pictures cropped from it. Other answers show a logo piece.
  jumpIn: true,
  questionArt: () => 'assets/design/career/question-hero.webp',
  optionArt: (qid, value) => qid === 'role' && ROLE_ART.has(value) ? `assets/design/career/${value}.webp` : '',
  text: ({tr}) => ({
    title: tr('Your work, your profile', 'Din jobb, din profil'),
    badge: tr('Tailored · prototype', 'Tilpasset deg · prototype'),
    progress: tr('About your work', 'Om jobben din'),
    otherLabel: qid => qid === 'role' ? tr('Your job (optional)', 'Yrket ditt (valgfritt)') : tr('Specify (optional)', 'Utdyp (valgfritt)'),
    otherPlaceholder: qid => qid === 'role' ? tr('For example chiropractor', 'For eksempel kiropraktor') : tr('A few words, no names', 'Noen få ord, ingen navn'),
    contextEyebrow: tr('Your job context', 'Din jobbkontekst')
  }),
  // The job, how you work with others and any lead role.
  contextParts: (a, language) => {
    const lead = asList(a.lead)[0];
    return [optionLabel('role', asList(a.role)[0], language, a), answerTopic('with', asList(a.with)[0], language, a), ...(lead && lead !== 'no' ? [answerTopic('lead', lead, language, a)] : [])];
  },
  // When no answer clearly clashes with a facet, «demanding» shows the strongest drain instead.
  main: [['good', ({tr}) => tr('This can work well', 'Dette kan fungere godt')], ['hard', ({tr}) => tr('This can be demanding', 'Dette kan bli krevende'), 'drain']],
  side: [['energy', ({tr}) => tr('Your energy', 'Din energi')]],
  deep: ['drain', 'lead', 'next', 'lookfor'],
  hideEmpty: ['drain'],
  weekOrder: ['hard', 'drain', 'good', 'energy'],
  titles: ({tr, esc, language}, answers) => {
    const goalValue = asList(answers.goal)[0], goalText = goalValue === 'other' ? (answers.other?.goal || '').trim() : optionLabel('goal', goalValue, language).toLowerCase();
    return {
      drain: tr('What drains you, and why', 'Det som tapper deg, og hvorfor'),
      lead: tr('When you lead', 'Når du leder'),
      next: goalText ? tr(`Your next step: ${esc(goalText)}`, `Ditt neste steg: ${esc(goalText)}`) : tr('Your next step', 'Ditt neste steg'),
      lookfor: tr('Look for this in your next job', 'Se etter dette i neste jobb')
    };
  }
});

export const careerHtml = chapter.html;
export const careerContextHtml = chapter.contextHtml;
export const initCareer = chapter.init;
export const clearCareer = chapter.clear;
export const careerWeekText = chapter.weekText;
