export const CLAIM_SCRIPT = `
local total = tonumber(redis.call('GET', KEYS[1]) or '0')
if redis.call('EXISTS', KEYS[2]) == 1 then return {total, 1} end
total = redis.call('INCR', KEYS[1])
redis.call('SET', KEYS[2], '1', 'EX', ARGV[1])
return {total, 1}
`;

export function dayInMoscow(now = new Date()) {
  return new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export async function redisCommand(command: (string | number)[]) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Blessings storage is not configured");
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("Blessings storage is unavailable");
  const data = await response.json();
  if (data.error) throw new Error("Blessings storage command failed");
  return data.result;
}

export async function getBlessings(visitor: string, claim: boolean, now = new Date()) {
  const day = dayInMoscow(now);
  const totalKey = "khramam:blessings:total";
  const dailyKey = `khramam:blessings:${day}:${visitor}`;
  const result = claim
    ? await redisCommand(["EVAL", CLAIM_SCRIPT, 2, totalKey, dailyKey, 172800])
    : await redisCommand(["MGET", totalKey, dailyKey]);
  if (!Array.isArray(result) || result.length !== 2) throw new Error("Invalid counter response");
  const total = Number(result[0] ?? 0);
  if (!Number.isSafeInteger(total) || total < 0) throw new Error("Invalid counter value");
  return { total, blessed: String(result[1]) === "1", day };
}
