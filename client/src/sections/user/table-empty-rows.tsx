import { type JSX } from 'react';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

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
