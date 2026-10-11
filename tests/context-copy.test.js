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
  assert.equal(c.ruleId, 'context-v1/C/work/high');
  assert.equal(contextCard({code: 'C', band: 'high'}, 'work', 'en').quote, 'You lay the tracks before the train leaves.');
});
