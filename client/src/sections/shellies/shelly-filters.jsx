/*
  Author: André Kreienbring
  The components implements the filter dialog. After selecting divers filters
  a function is called that resides in the ShellyView component and applies the filter.
*/
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

/**
  The component receives the following props:
  @param {boolean} openFilter To determine if the dialog is shown or not
  @param {function} onOpenFilter This will be called when the dialog was 
    opened to maintain the state in the parent component (ShellyView)
  @param {function} onCloseFilter This will be called when the dialog was 
    closed to maintain the state in the parent component (ShellyView)
  @param {object} filter An object that contains filter options and current states about their settings (checked or not)
  @param {function} handleDeviceFilter Will be called when a filter was selected and must be committed to the parent.
*/
export default function ShellyFilters({
  openFilter,
  onOpenFilter,
  onCloseFilter,
  filter,
  handleDeviceFilter,
}) {
  const [mChecked, setMChecked] = useState([]);
  const [gChecked, setGChecked] = useState([]);
  const { t } = useTranslation();

  // init the state of checked states for the filter options
  useEffect(() => {
    setMChecked(Array.from(filter.mChecked));
    setGChecked(Array.from(filter.gChecked));
  }, [filter]);

  if (typeof filter === 'undefined') return null;

  // if a model option is checked or unchecked this must be reflected in the state
  const handleModelFilterChange = (position) => {
    const updatedCheckedState = mChecked.map((item, index) => (index === position ? !item : item));
    setMChecked(updatedCheckedState);
  };

  // if a generation option is checked or unchecked this must be reflected in the state
  const handleGenFilterChange = (position) => {
    const updatedCheckedState = gChecked.map((item, index) => (index === position ? !item : item));
    setGChecked(updatedCheckedState);
  };

  // render the filter options for the available models
  const renderModel = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">{t('Model')}</Typography>
      <FormGroup>
        {filter.models.map((model, index) => (
          <FormControlLabel
            key={model}
            control={
              <Checkbox
                checked={!!mChecked[index]}
                onChange={() => handleModelFilterChange(index)}
              />
            }
            label={model}
          />
        ))}
      </FormGroup>
    </Stack>
  );

  // render the filter options for the available gererations
  const renderGen = (
    <Stack spacing={1}>
      <Typography variant="subtitle2">{t('Generation')}</Typography>
      <FormGroup>
        {filter.generations.map((gen, index) => (
          <FormControlLabel
            key={gen}
            value={gen}
            control={
              <Checkbox checked={!!gChecked[index]} onChange={() => handleGenFilterChange(index)} />
            }
            label={gen !== '' ? `Gen ${gen}` : 'no Gen'}
          />
        ))}
      </FormGroup>
    </Stack>
  );

  // sets all checkboxes to unchecked
  const clearAll = () => {
    setMChecked(new Array(filter.mChecked.length).fill(false));
    setGChecked(new Array(filter.gChecked.length).fill(false));
  };

  return (
    <>
      <Button
        disableRipple
        color={filter.isFilter ? 'success' : 'inherit'}
        endIcon={<Iconify icon="ic:round-filter-list" />}
        onClick={onOpenFilter}
      >
        {t('Filters')}&nbsp;
      </Button>

      <Drawer
        anchor="right"
        open={openFilter}
        onClose={onCloseFilter}
        PaperProps={{
          sx: { width: 300, border: 'none', overflow: 'hidden' },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1, py: 2 }}
        >
          <Typography variant="h6" sx={{ ml: 1 }}>
            {t('Filters')}
          </Typography>
          <IconButton onClick={onCloseFilter}>
            <Iconify icon="eva:close-fill" />
          </IconButton>
        </Stack>

        <Divider />

        <Scrollbar>
          <Stack spacing={3} sx={{ p: 3 }}>
            {renderModel}
            {renderGen}
          </Stack>
        </Scrollbar>

        <Box sx={{ p: 3 }}>
          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              startIcon={<Iconify icon="formkit:submit" />}
              onClick={(e) => handleDeviceFilter(mChecked, gChecked)}
            >
              {t('Submit')}
            </Button>
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              startIcon={<Iconify icon="ic:round-clear-all" />}
              onClick={(e) => clearAll()}
            >
              {t('Clear')}
            </Button>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}

ShellyFilters.propTypes = {
  openFilter: PropTypes.bool.isRequired,
  onOpenFilter: PropTypes.func.isRequired,
  onCloseFilter: PropTypes.func.isRequired,
  filter: PropTypes.object,
  handleDeviceFilter: PropTypes.func.isRequired,
};
