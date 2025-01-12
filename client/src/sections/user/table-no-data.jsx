import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function TableNoData({ query }) {
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

TableNoData.propTypes = {
  query: PropTypes.string,
};
