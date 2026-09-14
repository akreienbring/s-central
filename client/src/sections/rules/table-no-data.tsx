/*
  Author: André Kreienbring
  The TableNoData component is used in the rule table component to display a message when there are no users found upon a search.
*/
import { type JSX } from "react";

import Paper from "@mui/material/Paper";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";

/**
 * Component that is used to display a message when when a search query returns no results.
 * @param {string} query The search query that returned no results. Presented in the message.
 * @returns  {JSX.Element}
 */
export default function TableNoData({ query }: { query: string }): JSX.Element {
  return (
    <TableRow>
      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
        <Paper
          sx={{
            textAlign: "center",
          }}
        >
          <Typography variant="h6">Nothing found</Typography>

          <Typography variant="body2">
            No results for &nbsp;
            <strong>&quot;{query}&quot;</strong>.
          </Typography>
        </Paper>
      </TableCell>
    </TableRow>
  );
}
