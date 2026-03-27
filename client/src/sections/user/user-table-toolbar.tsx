/*
  Author: André Kreienbring
  The User Table Toolbar component offers functionalities like filtering users and deleting selected users.
  It is part of the UserView component.
*/
import { type JSX } from 'react';
import Iconify from '@src/components/iconify';
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

interface UserTableToolbarProps {
  selected: string[];
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  handleDeleteSelected: () => void;
  showReallyDelete: boolean;
  handleShowReallyDelete: (show: boolean) => void;
}

/**
 * User Table Toolbar that is used in the UserView component
 * @param {array} selected The array of selected user aliases
 * @param {string} filterName The current value of the filter / search
 * @param {function} onFilterName The function to call when the filter / search changes
 * @param {string} placeholder The placeholder text for the filter / search input
 * @param {function} handleDeleteSelected The function to call to delete the selected users
 * @param {boolean} showReallyDelete Whether to show the "really delete" confirmation
 * @param {function} handleShowReallyDelete The function to call to toggle the "really delete" confirmation
 * @returns {JSX.Element}
 */
export default function UserTableToolbar({
  selected,
  filterName,
  onFilterName,
  placeholder,
  handleDeleteSelected,
  showReallyDelete,
  handleShowReallyDelete,
}: UserTableToolbarProps): JSX.Element {
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
