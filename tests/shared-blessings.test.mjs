import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { CLAIM_SCRIPT, dayInMoscow, getBlessings } from '../app/api/blessings/store.ts';

const originalFetch = globalThis.fetch;
const originalUrl = process.env.KV_REST_API_URL;
const originalToken = process.env.KV_REST_API_TOKEN;
afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalUrl === undefined) delete process.env.KV_REST_API_URL; else process.env.KV_REST_API_URL = originalUrl;
  if (originalToken === undefined) delete process.env.KV_REST_API_TOKEN; else process.env.KV_REST_API_TOKEN = originalToken;
});

test('shared storage protocol: visitors see the same total and daily claims are idempotent', async () => {
  process.env.KV_REST_API_URL = 'https://redis.example.test';
  process.env.KV_REST_API_TOKEN = 'test-token';
  const state = new Map();
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://redis.example.test');
    assert.equal(options.headers.Authorization, 'Bearer test-token');
    assert.equal(options.cache, 'no-store');
    const command = JSON.parse(options.body);
    let result;
    if (command[0] === 'MGET') result = command.slice(1).map(key => state.get(key) ?? null);
    else {
      assert.equal(command[0], 'EVAL');
      assert.equal(command[1], CLAIM_SCRIPT);
      assert.equal(command[2], 2);
      const [, , , total, daily, ttl] = command;
      assert.equal(ttl, 172800);
      if (!state.has(daily)) {
        state.set(total, (state.get(total) ?? 0) + 1);
        state.set(daily, '1');
      }
      result = [state.get(total), 1];
    }
    return Response.json({ result });
  };
  const now = new Date('2026-09-29T12:00:00Z');
  assert.equal((await getBlessings('alice', false, now)).total, 0);
  await Promise.all(Array.from({ length: 10 }, () => getBlessings('alice', true, now)));
  assert.deepEqual(await getBlessings('bob', false, now), { total: 1, blessed: false, day: '2026-09-29' });
  await getBlessings('bob', true, now);
  assert.equal((await getBlessings('alice', false, now)).total, 2);
  assert.equal((await getBlessings('alice', true, new Date('2026-09-29T21:00:00Z'))).total, 3);
});

test('day boundary is Moscow midnight regardless of client clock', () => {
  assert.equal(dayInMoscow(new Date('2026-12-31T20:59:59Z')), '2026-12-31');
  assert.equal(dayInMoscow(new Date('2026-12-31T21:00:00Z')), '2027-01-01');
});

test('storage failures never become a fabricated zero or successful blessing', async () => {
  process.env.KV_REST_API_URL = 'https://redis.example.test';
  process.env.KV_REST_API_TOKEN = 'test-token';
  globalThis.fetch = async () => Response.json({ error: 'unavailable' }, { status: 503 });
  await assert.rejects(getBlessings('alice', true), /unavailable/);
  globalThis.fetch = async () => Response.json({ result: ['invalid', null] });
  await assert.rejects(getBlessings('alice', false), /Invalid/);
});
