/**
 * Exhaustive check: compare the built pure-TS core against the Yorion engine
 * for every single day in the supported range, in both directions.
 *
 * The unit suite runs a sampled version of this in CI; this is the full sweep
 * you run after regenerating the tables.
 */
const engine = require('./vendor/yorion_engine.js');
const core = require('../../packages/core/dist/index.cjs');

const MS_PER_DAY = 86_400_000;
let checked = 0;
const failures = [];

const fail = (message) => {
  if (failures.length < 25) failures.push(message);
};

for (let year = core.MIN_BS_YEAR; year <= core.MAX_BS_YEAR; year++) {
  for (let month = 1; month <= 12; month++) {
    const length = core.daysInBsMonth(year, month);

    // Month length must match the engine: day `length` exists, `length + 1` does not.
    try {
      engine.bs_to_gregorian(year, month, length);
    } catch {
      fail(`BS ${year}/${month}: core says ${length} days, engine rejects day ${length}`);
    }
    if (length < 32) {
      let overflowed = false;
      try {
        engine.bs_to_gregorian(year, month, length + 1);
        overflowed = true;
      } catch {
        /* expected */
      }
      if (overflowed) {
        fail(`BS ${year}/${month}: core says ${length} days, engine accepts day ${length + 1}`);
      }
    }

    for (let day = 1; day <= length; day++) {
      const expectedAd = engine.bs_to_gregorian(year, month, day);
      const actualAd = core.bsToAdIso({ year, month, day });
      if (actualAd !== expectedAd) {
        fail(`BS ${year}/${month}/${day}: core -> ${actualAd}, engine -> ${expectedAd}`);
      }

      const engineBs = engine.gregorian_to_bs(
        Number(expectedAd.slice(0, 4)),
        Number(expectedAd.slice(5, 7)),
        Number(expectedAd.slice(8, 10)),
      );
      const expectedBs = { year: engineBs.year, month: engineBs.month, day: engineBs.day };
      engineBs.free?.();

      const actualBs = core.adToBs(expectedAd);
      if (
        actualBs.year !== expectedBs.year ||
        actualBs.month !== expectedBs.month ||
        actualBs.day !== expectedBs.day
      ) {
        fail(
          `AD ${expectedAd}: core -> ${actualBs.year}/${actualBs.month}/${actualBs.day}, ` +
            `engine -> ${expectedBs.year}/${expectedBs.month}/${expectedBs.day}`,
        );
      }

      // Weekday, cross-checked against plain JS date maths.
      const jsWeekday = new Date(expectedAd + 'T00:00:00Z').getUTCDay();
      if (core.bsWeekday({ year, month, day }) !== jsWeekday) {
        fail(`BS ${year}/${month}/${day}: weekday mismatch`);
      }

      checked++;
    }
  }
}

console.log(`checked ${checked.toLocaleString()} days across BS ${core.MIN_BS_YEAR}-${core.MAX_BS_YEAR}`);
if (failures.length) {
  console.error(`\n${failures.length} mismatch(es):`);
  for (const failure of failures) console.error('  ' + failure);
  process.exit(1);
}
console.log('core matches the Yorion engine exactly, in both directions.');
