/*
  Author: André Kreienbring
  The Rule Table Toolbar component offers functionalities like filtering rules and deleting selected rules.
  It is part of the RuleView component.
*/
import { type JSX } from 'react';
import Iconify from '@src/components/iconify';

import {
  Button,
  Tooltip,
  Toolbar,
  Typography,
  IconButton,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';

interface RuleTableToolbarProps {
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
 * @param {RuleTableToolbarProps} props
 * @param {Array} props.selected The array of selected user aliases
 * @param {string} props.filterName The current value of the filter / search
 * @param {Function} props.onFilterName The function to call when the filter / search changes
 * @param {string} props.placeholder The placeholder text for the filter / search input
 * @param {Function} props.handleDeleteSelected The function to call to delete the selected users
 * @param {boolean} props.showReallyDelete Whether to show the "really delete" confirmation
 * @param {Function} props.handleShowReallyDelete The function to call to toggle the "really delete" confirmation
 * @returns {JSX.Element}
 */
export default function RuleTableToolbar({
  selected,
  filterName,
  onFilterName,
  placeholder,
  handleDeleteSelected,
  showReallyDelete,
  handleShowReallyDelete,
}: RuleTableToolbarProps): JSX.Element {
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        // eslint-disable-next-line jsdoc/require-jsdoc
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(selected.length > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {selected.length > 0 ? (
        <Typography component="div" variant="subtitle1">
          {selected.length} selected
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
        <Tooltip title="Delete">
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
          <Typography variant="subtitle1">Really delete?</Typography>
        </Button>
      )}
    </Toolbar>
  );
}
