/*
    Author: André Kreienbring
    Functions that sort arrays
*/

/**
    Sorts an array of objects by the given numric property.
    @param {array} array The array that will be sorted
    @param {string} prop The property of the object that will be used for sorting.
    @return {array} The sorted array
*/
export function sortNumeric(array, prop) {
  return array.sort((a, b) => a[prop] - b[prop]); // b - a for reverse sort
}

/**
    Sorts an array of objects by the given string property.
    @param {array} array The array that will be sorted
    @param {string} prop The property of the object that will be used for sorting.
    @return {array} The sorted array
*/
export function sortText(array, prop) {
  return array.sort((a, b) => a[prop].localeCompare(b[prop]));
}

function descendingComparator(a, b, orderBy) {
  if (a[orderBy] === null) {
    return 1;
  }
  if (b[orderBy] === null) {
    return -1;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function applyFilter({ inputData, comparator, filterName, field }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (user) => user[field].toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}
