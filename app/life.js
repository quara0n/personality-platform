// «Hverdagsliv og relasjoner»: eight questions about everyday life and the people close to you, one at
// a time, then a chapter that links the answers with the facet scores. Same layout and behaviour as the
// job chapter (tailored-chapter.js); this file gives it its copy and texts.
import {questions, visibleQuestions, isComplete, optionLabel, answerTopic, buildLife, lifeRequest, OTHER_MAX} from './life-copy.js';
import {createTailoredChapter} from './tailored-chapter.js';

export const LIFE_KEY = 'fem-life-v1';
const asList = v => Array.isArray(v) ? v : v ? [v] : [];

const house = '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/></svg>';

const chapter = createTailoredChapter({
  name: 'life',
  key: LIFE_KEY,
  copy: {questions, visibleQuestions, isComplete, optionLabel, answerTopic, build: buildLife, request: lifeRequest, OTHER_MAX},
  icon: house,
  // The AI button is shown as Rune's «Din personlige AI-partner» card (mockup 2026-10-17).
  aiCard: true,
  text: ({tr}) => ({
    title: tr('Your everyday life, your relationships', 'Din hverdag, dine relasjoner'),
    badge: tr('Tailored', 'Tilpasset deg'),
    progress: tr('About your everyday life', 'Om hverdagen din'),
    otherLabel: () => tr('Specify (optional)', 'Utdyp (valgfritt)'),
    otherPlaceholder: () => tr('A few words, no names', 'Noen få ord, ingen navn'),
    contextEyebrow: tr('Your everyday life', 'Din hverdag')
  }),
  // Who you share everyday life with, the children's ages and the relationship you want to look after.
  contextParts: (a, language) => {
    const kids = visibleQuestions(a).some(q => q.id === 'kids') ? asList(a.kids).map(v => optionLabel('kids', v, language, a)).join(language === 'no' ? ' og ' : ' and ') : '';
    const focus = asList(a.focus)[0], household = asList(a.household)[0];
    // «Partner · Partneren din» says the same thing twice, so the partner focus is left out when you live with one.
    const sameAsHome = focus === 'partner' && ['partner', 'family'].includes(household);
    return [optionLabel('household', household, language, a), kids && (language === 'no' ? `barn: ${kids.toLowerCase()}` : `children: ${kids.toLowerCase()}`), focus && focus !== 'none' && !sameAsHome ? answerTopic('focus', focus, language, a) : ''];
  },
  // «The people close to you» shows the strongest disagreement point when no closeness rule fits.
  main: [
    ['good', ({tr}) => tr('What helps you', 'Dette hjelper deg')],
    ['hard', ({tr}) => tr('This can be demanding', 'Dette kan bli krevende'), 'drain'],
    ['close', ({tr}) => tr('You and the people close to you', 'Deg og de nærmeste'), 'conflict']
  ],
  side: [['energy', ({tr}) => tr('Your energy', 'Din energi')]],
  deep: ['conflict', 'drain', 'next'],
  hideEmpty: ['conflict', 'drain'],
  weekOrder: ['hard', 'close', 'conflict', 'drain', 'good', 'energy'],
  titles: ({tr, esc, language}, answers) => {
    const goalValue = asList(answers.goal)[0], goalText = goalValue === 'other' ? (answers.other?.goal || '').trim() : optionLabel('goal', goalValue, language).toLowerCase();
    return {
      conflict: tr('When you disagree', 'Når dere er uenige'),
      drain: tr('What drains you, and why', 'Det som tapper deg, og hvorfor'),
      next: goalText ? tr(`Your next step: ${esc(goalText)}`, `Ditt neste steg: ${esc(goalText)}`) : tr('Your next step', 'Ditt neste steg')
    };
  }
});

export const lifeHtml = chapter.html;
export const lifeContextHtml = chapter.contextHtml;
export const initLife = chapter.init;
export const clearLife = chapter.clear;
