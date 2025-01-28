/*
  Author: André Kreienbring
  Component that represents the sort dialog
*/
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { listClasses } from '@mui/material/List';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'config', label: 'Config' },
  { value: 'cname', label: 'Name' },
  { value: 'name', label: 'Model' },
  { value: 'gen', label: 'Gen' },
];

/**
 * Component that presents several options for sorting
 * the list of devices
 * @param {function} handleSort Called when the list must be sorted
*/
export default function ShellySort({ handleSort }) {
  const [open, setOpen] = useState(null);
  const [selected, setSelected] = useState(0);
  const { t } = useTranslation();

  /*
    Openening / Closing the sort dialog
  */
  const handleOpen = (e) => {
    setOpen(e.currentTarget);
  };
  const handleClose = () => {
    setOpen(null);
  };

  /**
   * Called when a sort option was selected
   * @param {object} e The event
   * @param {number} index The index of the selected sort option
   * @param {function} handleSort Used to handle the selected sort option
   */
  const onMenuItemClick = (e, index) => {
    setOpen(null);
    setSelected(index);
    handleSort(SORT_OPTIONS[index]);
  };

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={handleOpen}
        endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >
        {t('_sortby_')}:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {t(SORT_OPTIONS[selected].label)}
        </Typography>
      </Button>

      <Menu
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              [`& .${listClasses.root}`]: {
                p: 0,
              },
            },
          },
        }}
      >
        {SORT_OPTIONS.map((option, index) => (
          <MenuItem
            key={option.value}
            onClick={(event) => onMenuItemClick(event, index)}
            selected={index === selected}
          >
            {t(option.label)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

ShellySort.propTypes = {
  handleSort: PropTypes.func.isRequired,
};
