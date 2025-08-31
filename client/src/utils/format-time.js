//  see 'date-fns' and 'date-fns-tz
import { format, getTime, fromUnixTime, intervalToDuration, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fUnixTime(time, fmt) {
  return time ? format(fromUnixTime(time), fmt) : '';
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}

/**
  Converts a number of seconds to a formatted time string.
  @param seconds The number of seconds to convert. If 0 or undefined, returns '0'.
  @returns {string} The formatted time string in the format "DD:HH:MM:SS".
*/
export function fSToTime(seconds) {
  if (seconds === 0 || typeof seconds === 'undefined') return '0';
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

  const zeroPad = (num) => String(num).padStart(2, '0');

  const formatted = [duration.days, duration.hours, duration.minutes, duration.seconds]
    .filter(Boolean)
    .map(zeroPad)
    .join(':');

  return formatted;
}
