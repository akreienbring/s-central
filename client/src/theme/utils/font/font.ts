/* eslint-disable jsdoc/require-jsdoc */
/**
 * Sets the font family.
 *
 * @param {string} [fontName] - The name of the font to set.
 * @returns {string} - The complete font family string.
 *
 * @example
 * const fontFamily = setFont('CustomFont');
 * console.log(fontFamily); // "CustomFont, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol""
 */

const DEFAULT_FONT_FAMILY = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`;

export function setFont(fontName?: string) {
  return fontName ? `"${fontName}", ${DEFAULT_FONT_FAMILY}` : DEFAULT_FONT_FAMILY;
}

// ----------------------------------------------------------------------

/**
 * Converts px to rem.
 *
 * @param {number} value - The pixel value to convert.
 * @returns {string} - The equivalent value in rem.
 * @throws {Error} - Throws an error if the pixel value is invalid.
 *
 * @example
 * const remValue = pxToRem(24);
 * console.log(remValue); // "1.5rem"
 */

export function pxToRem(value: number): string {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(`Invalid pixel value: ${value}`);
  }

  return `${value / 16}rem`;
}
