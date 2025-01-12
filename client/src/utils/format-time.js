//  see 'date-fns' and 'date-fns-tz
import { format, getTime, fromUnixTime, formatDistanceToNow } from 'date-fns';
// eslint-disable-next-line no-unused-vars, perfectionist/sort-imports, unused-imports/no-unused-imports

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
