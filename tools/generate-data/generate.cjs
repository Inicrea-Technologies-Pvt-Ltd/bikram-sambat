/**
 * Generates `packages/core/src/data.ts` and the golden test fixtures from the
 * Yorion engine (vendored under ./vendor, build-time only).
 *
 * The published core must stay pure TypeScript with zero runtime deps, so the
 * calendar is baked into a compact table here rather than computed at runtime.
 * Because the table is derived from the same engine the backend uses, the two
 * cannot drift.
 */
const fs = require('node:fs');
const path = require('node:path');

const engine = require('./vendor/yorion_engine.js');

const OUT_DATA = path.join(__dirname, '../../packages/core/src/data.ts');
const OUT_FIXTURE = path.join(__dirname, '../../packages/core/test/fixtures.json');

const MS_PER_DAY = 86_400_000;
const utc = (iso) => Date.parse(iso + 'T00:00:00.000Z');

/** BS (y,m,1) -> AD ISO, or null when outside the engine's data. */
function firstOfMonth(y, m) {
  try {
    return engine.bs_to_gregorian(y, m, 1);
  } catch {
    return null;
  }
}

/** Largest valid day in a BS month, found by probing down from 32. */
function probeMonthLength(y, m) {
  for (let d = 32; d >= 28; d--) {
    try {
      engine.bs_to_gregorian(y, m, d);
      return d;
    } catch {
      /* keep probing */
    }
  }
  throw new Error(`no valid day found for BS ${y}/${m}`);
}

// ---- discover the supported BS year range -------------------------------
let minYear = null;
let maxYear = null;
for (let y = 1900; y <= 2200; y++) {
  if (firstOfMonth(y, 1)) {
    if (minYear === null) minYear = y;
    maxYear = y;
  }
}
if (minYear === null) throw new Error('engine returned no usable years');
console.log(`BS range: ${minYear} .. ${maxYear}`);

// ---- month lengths ------------------------------------------------------
/** @type {number[][]} */
const years = [];
for (let y = minYear; y <= maxYear; y++) {
  const months = [];
  for (let m = 1; m <= 12; m++) {
    const start = firstOfMonth(y, m);
    if (!start) throw new Error(`missing BS ${y}/${m}`);
    const nextY = m === 12 ? y + 1 : y;
    const nextM = m === 12 ? 1 : m + 1;
    const next = firstOfMonth(nextY, nextM);
    // The final year has no following month to diff against; probe instead.
    const len = next
      ? Math.round((utc(next) - utc(start)) / MS_PER_DAY)
      : probeMonthLength(y, m);
    if (len < 29 || len > 32) {
      throw new Error(`BS ${y}/${m}: implausible month length ${len}`);
    }
    months.push(len);
  }
  years.push(months);
}

// ---- encode -------------------------------------------------------------
// One char per month, value = daysInMonth - 29 (so '0'..'3'). 12 chars/year.
const encoded = years.map((ms) => ms.map((d) => String(d - 29)).join('')).join('');
if (encoded.length !== years.length * 12) throw new Error('encoding length mismatch');

const epochIso = firstOfMonth(minYear, 1);
const lastMonthLen = years[years.length - 1][11];
const lastIso = engine.bs_to_gregorian(maxYear, 12, lastMonthLen);

// Sanity: total encoded days must line up with the AD span.
const totalDays = years.reduce((sum, ms) => sum + ms.reduce((a, b) => a + b, 0), 0);
const spanDays = Math.round((utc(lastIso) - utc(epochIso)) / MS_PER_DAY) + 1;
if (totalDays !== spanDays) {
  throw new Error(`table spans ${totalDays} days but AD range spans ${spanDays}`);
}
console.log(`encoded ${years.length} years / ${totalDays} days (${encoded.length} chars)`);

// ---- weekend policy -----------------------------------------------------
// Nepal moved from a one-day (Sat) to a two-day (Sat+Sun) weekend. Find the
// exact changeover day rather than a remembered date — and to the day, not the
// month, since the switch lands mid-month.
const location = new engine.Location(27.7172, 85.324, 'Kathmandu', 345);
location.follow_nepal_social_calendar = true;

let cutover = null;
outer: for (let y = 2070; y <= maxYear; y++) {
  for (let m = 1; m <= 12; m++) {
    let cal;
    try {
      cal = engine.get_month_calendar_with_location(y, m, location);
    } catch {
      continue; // astro data is unavailable before ~BS 2027
    }
    for (const d of cal.days) {
      if (cutover === null && d.day_of_week === 0 && d.is_weekend) {
        cutover = { year: y, month: m, day: d.bs_day, ad: d.gregorian_date };
      }
      d.free?.();
    }
    cal.free?.();
    if (cutover) break outer;
  }
}
if (!cutover) throw new Error('could not locate the two-day weekend transition');
console.log(
  `two-day weekend from BS ${cutover.year}-${cutover.month}-${cutover.day} (${cutover.ad})`,
);

// ---- emit data.ts -------------------------------------------------------
const banner = `/**
 * GENERATED FILE — do not edit by hand.
 *
 * Produced by \`pnpm gendata\` from the Yorion engine v0.4.0
 * (https://github.com/Yorion-io/yorion_engine, MIT OR Apache-2.0).
 * The engine runs at build time only; this table is what ships.
 */`;

const wrapped = encoded.match(/.{1,120}/g).map((s) => `  '${s}'`).join(' +\n');

const dataTs = `${banner}

/** First BS year covered by the table. */
export const MIN_BS_YEAR = ${minYear};

/** Last BS year covered by the table. */
export const MAX_BS_YEAR = ${maxYear};

/** AD date corresponding to BS ${minYear}-01-01, as a UTC epoch in milliseconds. */
export const EPOCH_AD_UTC = Date.UTC(${epochIso.slice(0, 4)}, ${Number(epochIso.slice(5, 7)) - 1}, ${Number(epochIso.slice(8, 10))});

/** ISO form of {@link EPOCH_AD_UTC}, for error messages and docs. */
export const EPOCH_AD_ISO = '${epochIso}';

/** ISO form of the last representable AD date (BS ${maxYear}-12-${String(lastMonthLen).padStart(2, '0')}). */
export const MAX_AD_ISO = '${lastIso}';

/**
 * Month lengths for every covered BS year, 12 chars per year, each char being
 * \`daysInMonth - 29\`. Nepali months run 29-32 days with no closed-form rule,
 * so a table is the only correct approach.
 */
export const MONTH_DAYS_ENCODED =
${wrapped};

/**
 * The day Nepal moved from a one-day weekend (Saturday) to a two-day weekend
 * (Saturday and Sunday). Sundays on or after this date count as weekend.
 */
export const TWO_DAY_WEEKEND_FROM_AD = '${cutover.ad}';

/** {@link TWO_DAY_WEEKEND_FROM_AD} in BS. */
export const TWO_DAY_WEEKEND_FROM_BS = { year: ${cutover.year}, month: ${cutover.month}, day: ${cutover.day} } as const;
`;

fs.writeFileSync(OUT_DATA, dataTs);
console.log(`wrote ${path.relative(process.cwd(), OUT_DATA)} (${dataTs.length} bytes)`);

// ---- emit golden fixtures ----------------------------------------------
// A deterministic spread across the whole range, plus every year boundary and
// every month boundary in a few representative years. CI runs against this;
// `verify.cjs` does the exhaustive day-by-day comparison locally.
const pairs = [];
const push = (y, m, d) => {
  try {
    const iso = engine.bs_to_gregorian(y, m, d);
    const bs = engine.gregorian_to_bs(
      Number(iso.slice(0, 4)),
      Number(iso.slice(5, 7)),
      Number(iso.slice(8, 10)),
    );
    const ok = bs.year === y && bs.month === m && bs.day === d;
    bs.free?.();
    if (!ok) throw new Error(`engine round-trip disagreed at BS ${y}/${m}/${d}`);
    pairs.push({ bs: [y, m, d], ad: iso });
  } catch (err) {
    if (String(err).includes('round-trip')) throw err;
  }
};

for (let y = minYear; y <= maxYear; y++) {
  push(y, 1, 1); // year boundary
  push(y, 12, years[y - minYear][11]); // year end
  // A rotating day/month so the sample sweeps the whole space over the range.
  const m = ((y - minYear) % 12) + 1;
  const d = ((y - minYear) % years[y - minYear][m - 1]) + 1;
  push(y, m, d);
}
for (const y of [1975, 2000, 2050, 2080, 2082, 2083, 2100]) {
  for (let m = 1; m <= 12; m++) {
    const len = years[y - minYear][m - 1];
    push(y, m, 1);
    push(y, m, len);
    push(y, m, Math.ceil(len / 2));
  }
}

const fixtures = {
  generatedFrom: 'yorion_engine v0.4.0',
  range: { minBsYear: minYear, maxBsYear: maxYear, epochAd: epochIso, maxAd: lastIso },
  twoDayWeekendFrom: cutover,
  totalDays,
  pairs,
};
fs.writeFileSync(OUT_FIXTURE, JSON.stringify(fixtures, null, 0) + '\n');
console.log(`wrote ${path.relative(process.cwd(), OUT_FIXTURE)} (${pairs.length} pairs)`);
