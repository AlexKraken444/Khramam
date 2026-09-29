import { test } from 'node:test';
import assert from 'node:assert/strict';
import { localDay, readBlessings, receiveBlessing } from '../app/blessings.ts';

test('first blessing persists and cannot be repeated or reversed today', () => {
  const first = receiveBlessing(readBlessings(null), '2026-09-29');
  assert.deepEqual(first, { count: 1, lastDay: '2026-09-29' });
  const restored = readBlessings(JSON.stringify(first));
  assert.deepEqual(receiveBlessing(restored, '2026-09-29'), first);
  assert.deepEqual(receiveBlessing(restored, '2026-09-28'), first);
});

test('new calendar day grants exactly one further blessing', () => {
  const old = { count: 12, lastDay: '2026-12-31' };
  const next = receiveBlessing(old, '2027-01-01');
  assert.deepEqual(next, { count: 13, lastDay: '2027-01-01' });
  assert.deepEqual(receiveBlessing(next, '2027-01-01'), next);
});

test('uses local calendar day and safely handles invalid storage', () => {
  assert.equal(localDay(new Date(2026, 8, 29, 23, 59)), '2026-09-29');
  for (const raw of ['broken', 'null', '{"count":-1,"lastDay":"x"}']) {
    assert.deepEqual(readBlessings(raw), { count: 0, lastDay: '' });
  }
});
