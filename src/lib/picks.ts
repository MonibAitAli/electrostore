/**
 * "Today's picks" is random but must not flicker: the same six products stay
 * selected for a whole calendar day, across refreshes and server restarts.
 * We seed a PRNG from the Casablanca date (Morocco is a fixed UTC+1, no DST)
 * and shuffle the candidate pool with it.
 */

function fnv1a(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** `YYYY-MM-DD` in Casablanca, whatever the server's own timezone is. */
export function casablancaDate(now: Date = new Date()): string {
  const shifted = new Date(now.getTime() + 60 * 60 * 1000);
  return shifted.toISOString().slice(0, 10);
}

export function dailySeed(date: string = casablancaDate()): number {
  return fnv1a(`electro-picks-${date}`);
}

/**
 * Fisher-Yates with a seeded generator. Returns at most `count` items and never
 * mutates the input.
 */
export function seededSample<T>(items: readonly T[], count: number, seed: number): T[] {
  const pool = items.slice();
  const random = mulberry32(seed);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}

/**
 * Builds several disjoint windows from one daily shuffle. The page ships every
 * window to the client so "another selection" is a pure state change — no fetch,
 * and no chance of the server and client disagreeing on what to render.
 */
export function pickWindows<T>(
  items: readonly T[],
  count: number,
  maxWindows = 6,
  date: string = casablancaDate(),
): T[][] {
  if (items.length === 0 || count <= 0) return [];

  const windowCount = Math.max(1, Math.min(maxWindows, Math.floor(items.length / count)));
  const shuffled = seededSample(items, windowCount * count, dailySeed(date));

  const windows: T[][] = [];
  for (let i = 0; i < windowCount; i++) {
    const slice = shuffled.slice(i * count, (i + 1) * count);
    if (slice.length > 0) windows.push(slice);
  }
  return windows;
}
