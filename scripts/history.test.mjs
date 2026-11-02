import assert from 'node:assert/strict';
import test from 'node:test';
import { chronological } from '../src/lib/history.ts';

test('timeline orders whole entries from oldest to newest without changing their descriptions', () => {
  const data = [{year:2025, items:['latest']}, {year:2012,items:['founding']}, {year:2020,items:['milestone']}];
  const ordered = chronological(data);
  assert.deepEqual(ordered.map(x=>x.year), [2012,2020,2025]);
  assert.deepEqual(ordered.map(x=>x.items), [['founding'],['milestone'],['latest']]);
  assert.deepEqual(data.map(x=>x.year), [2025,2012,2020]);
  assert.equal(ordered[0],data[1]);
});
test('empty, single year and same-year entries keep all content', () => {
  assert.deepEqual(chronological([]), []);
  const rows = [{year:2020,items:['first']},{year:2020,items:['second']}];
  assert.deepEqual(chronological(rows),rows);
  assert.deepEqual(chronological([rows[0]]),[rows[0]]);
});
