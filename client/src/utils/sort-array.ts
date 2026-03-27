/*
    Author: André Kreienbring
    Functions that sort arrays
*/

/**
 * Used to compare two objects for sorting.
 * @param {object} a The first object to compare.
 * @param {object} b The second object to compare.
 * @param {string} orderBy The property name to sort by.
 * @returns {number} Comparison result: 1 if a < b, -1 if a > b, zero if equal.
 */
function descendingComparator<T>(a: T, b: T, orderBy: keyof T): number {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

/**
 * Used as a comparator function for sorting of arrays.
 * @param {string} order Must be 'asc' or 'desc'
 * @param {string} orderBy The property name to sort by.
 * @returns {function} Comparison function.
 */
export function getComparator<Key extends keyof any>(
  order: 'asc' | 'desc',
  orderBy: Key
): (
  a: {
    [key in Key]: number | string;
  },
  b: {
    [key in Key]: number | string;
  }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

/**
 * Calculates the number of empty rows for a table.
 * @param page The current page number.
 * @param rowsPerPage The number of rows per page.
 * @param arrayLength The total length of the data array.
 * @returns The number of empty rows.
 */
export function emptyRows(page: number, rowsPerPage: number, arrayLength: number): number {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}
