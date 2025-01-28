/* eslint-disable no-bitwise */
/*
  Author: André Kreienbring
  Various helpers
*/

/**
  Checks if the input is an email adress.
  @param {string} email The text that pretends to be an email address.
  @return {boolean} true if the input is a valid email address, false if not.
*/
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

/**
 * Creates a UUID 
 * @returns {string} The UUID
 */
// eslint-disable-next-line arrow-body-style
export const createUUID = () => {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
    (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16)
  );
};

/**
  Maps a number to a given range (1 - max) of numbers.
  If n > max the result starts from 1 again. Example
  (1, 3) => 1, (2, 3) => 2, (3, 3) => 3, (4, 3) => 1...
  @param {number} n The number that must be mapped to a range
  @param {number} max The maximun number that can be returned
  @returns {number} The initial number n mapped to the range
*/
export const mapNumberToMax = (n, max) => {
  if (n < max) {
    return n;
  }
  if (n % max === 0) {
    return max;
  }
  return n % max;
};

/**
  UNUSED
  see: https://dev.to/timothee/using-modulo-to-shift-a-value-and-keep-it-inside-a-range-8fm
  mapNumberToMax2(i, 0, 1, 25) does the same as mapNumberToMax(i, 25)
  @param {number} n The number that must be mapped to a range
  @param {number} offset n is shifted by this amount
  @param {number} min is the lowest value of the desired range
  @param {number} max  is the length of the desired range.
  @returns {number} The initial number n mapped to the range
*/
export const mapNumberToMax2 = (n, offset, min, max) =>
  ((n - min + (offset % max) + max) % max) + min;
