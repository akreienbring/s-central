/*
  Author: André Kreienbring
  Number formatting helpers
*/
import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fNumber(number: number): string {
  return numeral(number).format();
}

export function fCurrency(number: number): string {
  const format = typeof number !== 'undefined' ? numeral(number).format('$0,0.00') : '';

  return result(format, '.00');
}

export function fPercent(number: number): string {
  const format = typeof number !== 'undefined' ? numeral(Number(number) / 100).format('0.0%') : '';

  return result(format, '.0');
}

export function fShortenNumber(number: number): string {
  const format = typeof number !== 'undefined' ? numeral(number).format('0.00a') : '';

  return result(format, '.00');
}

export function fData(number: number): string {
  const format = typeof number !== 'undefined' ? numeral(number).format('0.0 b') : '';

  return result(format, '.0');
}

/** 
  Used to display consumption (stored as mw/m) in charts)
  The value is converted to kw/h
  @param {number} The value that must be formatted as kw/h
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
  @param {number} The value that must be formatted as w/h
  @returns {string} The formatted value
*/
export function fWh(number: number): string {
  const format = typeof number !== 'undefined' ? `${((number / 1000) * 60).toFixed(2)} w/h` : '';

  return result(format, '');
}

function result(format: string, key: string): string {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}
