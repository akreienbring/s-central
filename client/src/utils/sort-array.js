/*
    Author: André Kreienbring
    Functions that sort arrays
*/

/*
    Sorts an array of objects by the given numric property.
    @param: {array} array The array that will be sorted
    @param: {string} prop The property of the object that will be used for sorting.
    @return: {array} The sorted array
*/
export function sortNumeric(array, prop) {
  return array.sort((a, b) => a[prop] - b[prop]); // b - a for reverse sort
}

/*
    Sorts an array of objects by the given string property.
    @param: {array} array The array that will be sorted
    @param: {string} prop The property of the object that will be used for sorting.
    @return: {array} The sorted array
*/
export function sortText(array, prop) {
  return array.sort((a, b) => a[prop].localeCompare(b[prop]));
}
