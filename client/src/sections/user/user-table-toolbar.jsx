import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableToolbar({
  selected,
  filterName,
  onFilterName,
  placeholder,
  handleDeleteSelected,
  showReallyDelete,
  handleShowReallyDelete,
}) {
  const { t } = useTranslation();

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(selected.length > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {selected.length > 0 ? (
        <Typography component="div" variant="subtitle1">
          {selected.length} {t('selected')}
        </Typography>
      ) : (
        <OutlinedInput
          value={filterName}
          onChange={onFilterName}
          placeholder={placeholder}
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
        />
      )}

      {selected.length > 0 && !showReallyDelete && (
        <Tooltip title={t('Delete')}>
          <IconButton onClick={() => handleShowReallyDelete(true)}>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      )}
      {selected.length > 0 && showReallyDelete && (
        <Button
          color="error"
          variant="contained"
          startIcon={<Iconify icon="eva:question-mark-circle-outline" />}
          onClick={() => {
            handleDeleteSelected();
            handleShowReallyDelete(false);
          }}
        >
          <Typography variant="subtitle1">{t('_reallydelete_')}</Typography>
        </Button>
      )}
    </Toolbar>
  );
}

UserTableToolbar.propTypes = {
  selected: PropTypes.array,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  placeholder: PropTypes.string,
  handleDeleteSelected: PropTypes.func,
  showReallyDelete: PropTypes.bool,
  handleShowReallyDelete: PropTypes.func,
};
