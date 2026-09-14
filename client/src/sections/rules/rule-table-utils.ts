/*
  Author: André Kreienbring
  Utils to apply sorting and filtering to the User table
*/
import type { SCentralRule } from '@src/types/rule';

type ApplyFilterProps = {
  inputData: SCentralRule[];
  filterName: string;
  comparator: (a: any, b: any) => number;
};

/**
 * Apply sorting and filtering to the User table rows
 * @param {ApplyFilterProps} props
 * @param {SCentralRule[]} props.inputData The Rows to sort / filter
 * @param {string} props.filterName A property name of a row.
 * @param {Function} props.comparator A function that compares values for sorting
 * @returns {SCentralRule[]} The sorted / filtered rows
 */
export function applyRuleFilter({
  inputData,
  comparator,
  filterName,
}: ApplyFilterProps): SCentralRule[] {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (rule) => rule.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}
