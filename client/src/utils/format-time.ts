import i18n from 'i18next';
import { es, de, enUS, type Locale } from 'date-fns/locale';
import { format, getTime, fromUnixTime, intervalToDuration, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------
/**
  Maps the currently active i18next language to a date-fns locale.
  @returns {Locale} The corresponding data-fns locale
*/
const getDatefnsLocale = (): Locale => {
  switch (i18n.language) {
    case 'en':
      return enUS;
    case 'de':
      return de;
    case 'es':
      return es;
    default:
      return enUS;
  }
};

/**
 * Formats a date to a given format.
 * @param {number} date The date to format.
 * @param {string} [newFormat] newFormat The format string. Default is 'dd MMM yyyy'.
 * @returns {string} The formatted date string by using the current locale.
 */
export function fDate(date: number, newFormat?: string): string {
  const fm = newFormat || 'dd MMM yyyy';

  return date
    ? format(new Date(date), fm, {
        locale: getDatefnsLocale(),
      })
    : '';
}

/**
 * Formats a date and time to a given format.
 * @param {number} date The date / time as timestamp to format.
 * @param {string} [newFormat] newFormat The format string. Default is 'dd MMM yyyy p'.
 * @returns {string} The formatted date / time string by using the current locale.
 */
export function fDateTime(date: number, newFormat?: string): string {
  const fm = newFormat || 'dd MMM yyyy p';

  return date
    ? format(new Date(date), fm, {
        locale: getDatefnsLocale(),
      })
    : '';
}

/**
 * CURRENTLY NOT IN USE
 * Formats a date to a timestamp.
 * @param {Date} date
 * @returns The timestamp of the date.
 */
export function fTimestamp(date: Date): number | string {
  return date ? getTime(new Date(date)) : '';
}

/**
 * Formats a unix timestamp to a given format.
 * @param {number} time The unix timestamp to format.
 * @param {string} fmt The format string. Example: 'yyyy-MM-dd HH:mm:ss'
 * @returns {string} The formatted date string.
 */
export function fUnixTime(time: number, fmt: string): string {
  return time ? format(fromUnixTime(time), fmt) : '';
}

/**
 * Calculates the time difference between a given date and now.
 * @param {Date} date The date to calculate the time difference for
 * @returns {string} The formatted distance string with suffix (e.g., "5 minutes ago") by using the current locale.
 */
export function fToNow(date: Date): string {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: getDatefnsLocale(),
      })
    : '';
}

/**
  Converts a number of seconds to a formatted time string.
  @param {number}seconds The number of seconds to convert. If 0 or undefined, returns '0'.
  @returns {string} The formatted time string in the format "YYy:MMm:DDd:HHh:MMm:SSs".
*/
export function fSToTime(seconds: number): string {
  if (seconds === 0 || typeof seconds === 'undefined') return '0';
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
  const formatted = `
    ${typeof duration.years !== 'undefined' ? duration.years + 'y:' : ''}
    ${typeof duration.months !== 'undefined' ? duration.months + 'm:' : ''}
    ${typeof duration.days !== 'undefined' ? duration.days + 'd:' : ''}
    ${typeof duration.hours !== 'undefined' ? duration.hours + 'h:' : ''}
    ${typeof duration.minutes !== 'undefined' ? duration.minutes + 'm:' : ''}
    ${typeof duration.seconds !== 'undefined' ? duration.seconds + 's' : ''}
  `;

  return formatted;
}
