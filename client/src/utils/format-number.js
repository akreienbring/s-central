import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fNumber(number) {
  return numeral(number).format();
}

export function fCurrency(number) {
  const format = typeof number !== 'undefined' ? numeral(number).format('$0,0.00') : '';

  return result(format, '.00');
}

export function fPercent(number) {
  const format = typeof number !== 'undefined' ? numeral(Number(number) / 100).format('0.0%') : '';

  return result(format, '.0');
}

export function fShortenNumber(number) {
  const format = typeof number !== 'undefined' ? numeral(number).format('0.00a') : '';

  return result(format, '.00');
}

export function fData(number) {
  const format = typeof number !== 'undefined' ? numeral(number).format('0.0 b') : '';

  return result(format, '.0');
}

/*
  Used to display consumption (stored as mw/m) in charts)
  The value is converted to kw/h
  @param {number} The value that must be formatted as kw/h
  @return {string} The formatted value
  */
export function fKWh(number) {
  const format =
    typeof number !== 'undefined' ? `${((number / 1000 / 1000) * 60).toFixed(2)} kw/h` : '';

  return result(format, '');
}

/*
  Used to display consumption (stored as mw/m) in charts)
  The value is converted to w/h
  @param {number} The value that must be formatted as w/h
  @return {string} The formatted value
*/
export function fWh(number) {
  const format = typeof number !== 'undefined' ? `${((number / 1000) * 60).toFixed(2)} w/h` : '';

  return result(format, '');
}

function result(format, key) {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, '') : format;
}
