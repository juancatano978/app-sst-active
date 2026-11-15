/**
 * SST-Active System Date Utility
 * Anchors operational timestamps to 2026-10-28 as requested.
 */

export const SYSTEM_BASE_DATE_STR = '2026-10-28';

/**
 * Returns a Date object anchored to 2026-10-28 while preserving the current time of day.
 */
export function getSystemNow(): Date {
  const realNow = new Date();
  const d = new Date('2026-10-28T10:00:00');
  d.setHours(realNow.getHours(), realNow.getMinutes(), realNow.getSeconds(), realNow.getMilliseconds());
  return d;
}

/**
 * Returns a formatted timestamp string 'YYYY-MM-DD HH:mm' anchored to 2026-10-28.
 */
export function getSystemTimestamp(): string {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `${SYSTEM_BASE_DATE_STR} ${hh}:${mm}`;
}

/**
 * Returns a formatted date string 'YYYY-MM-DD' anchored to 2026-10-28.
 */
export function getSystemDateOnly(): string {
  return SYSTEM_BASE_DATE_STR;
}
