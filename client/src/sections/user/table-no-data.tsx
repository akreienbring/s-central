/*
  Author: André Kreienbring
  The TableNoData component is used in the UserView component to display a message when there are no users to display.
*/
import { type JSX } from 'react';
import { useTranslation } from 'react-i18next';

import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

/**
 * Component that is used to display a message when there are no users to display or when a search query returns no results.
 * @param {string} query The search query that returned no results. Presented in the message.
 * @returns  {JSX.Element}
 */
export default function TableNoData({ query }: { query: string }): JSX.Element {
  const { t } = useTranslation();

  return (
    <TableRow>
      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
        <Paper
          sx={{
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" paragraph>
            {t('_notfound_')}
          </Typography>

          <Typography variant="body2">
            {t('_noresultsfor_')} &nbsp;
            <strong>&quot;{query}&quot;</strong>.
          </Typography>
        </Paper>
      </TableCell>
    </TableRow>
  );
}
