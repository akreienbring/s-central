/*
  Author: André Kreienbring
  Utils to apply sorting and filtering to the Shelly Device table
*/
import type { Device, DeviceTableRow } from '@src/types/device';

type ApplyDeviceSortProps = {
  inputData: Device[];
  comparator: (a: any, b: any) => number;
};
/**
 * Sorts the DeviceTableRows
 * @param {ApplyDeviceSortProps} props
 * @param {DeviceTableRow[]} props.inputData The Rows to sort / filter
 * @param {Function} props.comparator A function that compares values for sorting
 * @returns {DeviceTableRow[]} The sorted / filtered rows
 */
export function applyDeviceSort({ inputData, comparator }: ApplyDeviceSortProps): Device[] {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}

type ApplyDeviceTableSortProps = {
  inputData: DeviceTableRow[];
  comparator: (a: any, b: any) => number;
};

/**
 * Sorts the DeviceTableRows
 * @param {ApplyDeviceTableSortProps} props
 * @param {DeviceTableRow[]} props.inputData The Rows to sort / filter
 * @param {Function} props.comparator A function that compares values for sorting
 * @returns {DeviceTableRow[]} The sorted / filtered rows
 */
export function applyDeviceTableSort({
  inputData,
  comparator,
}: ApplyDeviceTableSortProps): DeviceTableRow[] {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
