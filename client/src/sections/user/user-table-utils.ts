/*
  Author: André Kreienbring
  Utils to apply sorting and filtering to the User table
*/
import { type User } from '@src/types/user';

type ApplyFilterProps = {
  inputData: User[];
  filterName: string;
  comparator: (a: any, b: any) => number;
};

/**
 * Apply sorting and filtering to the User table rows
 * @param {User[]} inputData The Rows to sort / filter
 * @param {string} filterName A property name of a row.
 * @param {function} comparator A function that compares values for sorting
 * @returns {User[]} The sorted / filtered rows
 */
export function applyUserFilter({ inputData, comparator, filterName }: ApplyFilterProps): User[] {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (user) => user.alias.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}
