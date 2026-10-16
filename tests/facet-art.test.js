import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {facetArt, facetFigure} from '../app/facet-art.js';

test('facet pictures follow the woman/man choice and fall back to the default version', () => {
  assert.equal(facetArt('O1', 'male'), 'male/O1');
  assert.equal(facetArt('O3', 'female'), 'female/O3');
  assert.equal(facetArt('O3', ''), 'male/O3');
  assert.equal(facetArt('O1', 'none'), 'female/O1');
  assert.equal(facetArt('C2', ''), 'male/C2');
  assert.equal(facetArt('N1', 'male'), 'male/N1');
  assert.equal(Object.keys(facetFigure).length, 30);
  for (const code of Object.keys(facetFigure))
    for (const who of ['female', 'male'])
      assert.ok(existsSync(new URL(`../app/assets/design/facets/${who}/${code}.webp`, import.meta.url)), `${who}/${code}`);
});
