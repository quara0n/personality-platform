import test from 'node:test';
import assert from 'node:assert/strict';
import {contextCard, contextCards} from '../app/context-copy.js';

test('every trait, band and chapter has a card in both languages', () => {
  for (const code of ['O', 'C', 'E', 'A', 'N']) for (const chapter of ['work', 'life']) for (const band of ['low', 'middle', 'high']) {
    const c = contextCards[code][chapter][band];
    for (const field of ['quote', 'text', 'try']) {
      assert.equal(c[field].length, 2, `${code}/${chapter}/${band}/${field}`);
      assert.ok(c[field].every(s => s.trim().length > 10), `${code}/${chapter}/${band}/${field}`);
      assert.notEqual(c[field][0], c[field][1]);
    }
  }
});

test('contextCard picks the band and language and keeps a rule id', () => {
  const c = contextCard({code: 'C', band: 'high'}, 'work', 'no');
  assert.equal(c.quote, 'Du legger skinnene før toget kjører.');
  assert.equal(c.ruleId, 'context-v2/C/work/high');
  assert.equal(contextCard({code: 'C', band: 'high'}, 'work', 'en').quote, 'You lay the tracks before the train leaves.');
});

import {outerCards, strengthLists, contextLevel} from '../app/context-levels.js';

test('five levels: outer cards and strength lists exist for every trait and chapter in both languages', () => {
  for (const code of ['O', 'C', 'E', 'A', 'N']) for (const chapter of ['work', 'life']) {
    for (const level of ['veryLow', 'veryHigh']) {
      const c = outerCards[code][chapter][level];
      for (const field of ['quote', 'text', 'try']) {
        assert.equal(c[field].length, 2, `${code}/${chapter}/${level}/${field}`);
        assert.ok(c[field].every(s => s.trim().length > 10));
        assert.notEqual(c[field][0], c[field][1]);
      }
    }
    for (const level of ['veryLow', 'low', 'middle', 'high', 'veryHigh']) {
      const l = strengthLists[code][chapter][level];
      for (const side of ['good', 'hard']) {
        assert.equal(l[side].length, 3, `${code}/${chapter}/${level}/${side}`);
        assert.ok(l[side].every(x => x.length === 2 && x[0].trim() && x[1].trim()), `${code}/${chapter}/${level}/${side}`);
      }
    }
  }
});

test('the outer levels need both the percentile and the matching band', () => {
  assert.equal(contextLevel({band: 'low', percentile: 9}), 'veryLow');
  assert.equal(contextLevel({band: 'low', percentile: 10}), 'low');
  assert.equal(contextLevel({band: 'high', percentile: 91}), 'veryHigh');
  assert.equal(contextLevel({band: 'high', percentile: 90}), 'high');
  assert.equal(contextLevel({band: 'high', mean: 4.8}), 'high');
  const c = contextCard({code: 'E', band: 'low', percentile: 4}, 'life', 'no');
  assert.equal(c.quote, 'Din idé om en god fest har tre gjester.');
  assert.equal(c.ruleId, 'context-v2/E/life/veryLow');
  assert.equal(c.good.length, 3);
  assert.equal(c.art, 'life-E');
  assert.equal(contextCard({code: 'E', band: 'middle', percentile: 50}, 'work', 'en').hard[0], 'Not always aware what drains you');
});
