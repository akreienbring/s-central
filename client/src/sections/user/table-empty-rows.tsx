import { type JSX } from 'react';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

/**
 * Present empty rows at the end of the user table
 * @param {object} props
 * @param {number} props.emptyRows The number of empty rows.
 * @param {number} props.height The height of the element
 * @returns {JSX.Element}
 */
export default function TableEmptyRows({
  emptyRows,
  height,
}: {
  emptyRows: number;
  height: number;
}): JSX.Element | null {
  if (!emptyRows) {
    return null;
  }

  return (
    <TableRow
      sx={{
        ...(height && {
          height: height * emptyRows,
        }),
      }}
    >
      <TableCell colSpan={9} />
    </TableRow>
  );
}
