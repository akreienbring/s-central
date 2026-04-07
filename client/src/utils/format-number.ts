/*
  Author: André Kreienbring
  Number formatting helpers
*/
import i18n from 'i18next';
import numeral from 'numeral';

// ----------------------------------------------------------------------
/**
  Maps the currently active i18next language to a numeral locale
  such as en, es, en-gb
  @returns {string} The corresponding numeral locale.
*/
const getNumeralLocale = (): string => {
  switch (i18n.language) {
    case 'en':
      return 'en-gb';
    case 'de':
      return 'de';
    case 'es':
      return 'es';
    default:
      return 'en-gb';
  }
};

/**
 * Delete the given key from the given format.
 * @param {string} format A string that may contain the given key
 * @param {string} key  A string to search and delete from the given format
 * @returns {string} The given format string without the key
 */
function result(format: string, key: string): string {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}

/**
 * Format a number to a string that respects the current selected language.
 * @param {number} number The number to format
 * @returns {string} The formatted number
 *
 * @example
 * const myLocalNumber = fNumber(1000);
 * console.log(myLocalNumber); //1.000
 */
export function fNumber(number: number): string {
  numeral.locale(getNumeralLocale());

  return numeral(number).format();
}

/**
 * Format a number to a currency string that respects the current selected language.
 * @param {number} number The number to format
 * @returns {string} The formatted number
 *
 * @example
 * const myLocalNumber = fCurrency(1000.234);
 * console.log(myLocalNumber); //$1,000.23
 */
export function fCurrency(number: number): string {
  numeral.locale(getNumeralLocale());

  const format = typeof number !== 'undefined' ? numeral(number).format('$0,0.00') : '';

  return result(format, '.00');
}

/**
 * Format a number to a percent string
 * @param {number} number The number to format
 * @returns {string} The formatted number
 *
 * @example
 * const myLocalNumber = fCurrency(20);
 * console.log(myLocalNumber); //20%
 */
export function fPercent(number: number): string {
  const format = typeof number !== 'undefined' ? numeral(Number(number) / 100).format('0.0%') : '';

  return result(format, '.0');
}

/**
 * Format a number to a shorter format
 * @param {number} number The number to format
 * @returns {string} The formatted number
 */
export function fShortenNumber(number: number): string {
  const format = typeof number !== 'undefined' ? numeral(number).format('0.00a') : '';

  return result(format, '.00');
}

/**
 * Format a number to a byte format
 * @param {number} number The number to format
 * @returns {string} The formatted number
 *
 * @example 122912
 * const myLocalNumber = fByte(122912);
 * console.log(myLocalNumber); //123 KB
 */
export function fByte(number: number): string {
  const format = typeof number !== 'undefined' ? numeral(number).format('0 b') : '';

  return result(format, '.0');
}

/** 
  Used to display consumption (stored as mw/m) in charts)
  The value is converted to kw/h
  @param {number} number The value that must be formatted as kw/h
  @returns {string} The formatted value
  */
export function fKWh(number: number): string {
  const format =
    typeof number !== 'undefined' ? `${((number / 1000 / 1000) * 60).toFixed(2)} kw/h` : '';

  return result(format, '');
}

/** 
  Used to display consumption (stored as mw/m) in charts)
  The value is converted to w/h
  @param {number} number The value that must be formatted as w/h
  @returns {string} The formatted value
*/
export function fWh(number: number): string {
  const format = typeof number !== 'undefined' ? `${((number / 1000) * 60).toFixed(2)} w/h` : '';

  return result(format, '');
}
