/**
 * Thrown when a date falls outside the supported range or is not a real
 * calendar date. Carries a machine-readable `code` so callers can branch
 * without string-matching the message.
 */
export class BikramRangeError extends RangeError {
  readonly code: 'OUT_OF_RANGE' | 'INVALID_DATE';

  constructor(message: string, code: 'OUT_OF_RANGE' | 'INVALID_DATE' = 'OUT_OF_RANGE') {
    super(message);
    this.name = 'BikramRangeError';
    this.code = code;
    // Keeps `instanceof` working when the package is compiled down to ES5.
    Object.setPrototypeOf(this, BikramRangeError.prototype);
  }
}
