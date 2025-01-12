/*
Author: André Kreienbring
For the usage of i18next with placholders:
Use something like
{
  "translation": {
    "headerTitle": "My {{appName}} Header Title"
  }
}
in the locale json file an the use
{t('headerTitle', { appName: "Shelly Monitor" })}
for the text that needs to be transleted in the components.
See 'i18n.js' for the initialization of i18next.
*/
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { languages } from 'src/i18n';

export default function LanguagePopover() {
  const [open, setOpen] = useState(null);
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();

  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [languageIndex, setLanguageIndex] = useState(0);

  const handleChangeLanguage = (value, index) => {
    setCurrentLanguage(value);
    setLanguageIndex(index);
    changeLanguage(value);
    // store the current language for reuse after page refresh
    localStorage.setItem('i18nLanguage', value);
    handleClose();
  };

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          ...(open && {
            bgcolor: 'action.selected',
          }),
        }}
      >
        <img
          src={`/assets/icons/flags/${currentLanguage}.svg`}
          alt={t(languages[languageIndex].label)}
        />
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              p: 0,
              mt: 1,
              ml: 0.75,
              width: 180,
            },
          },
        }}
      >
        {languages.map((option, index) => (
          <MenuItem
            key={option.value}
            selected={option.value === languages[languageIndex].value}
            onClick={(event) => handleChangeLanguage(option.value, index)}
            sx={{ typography: 'body2', py: 1 }}
          >
            <Box
              component="img"
              alt={option.label}
              src={`/assets/icons/flags/${option.value}.svg`}
              sx={{ width: 28, mr: 2 }}
            />

            {t(option.label)}
          </MenuItem>
        ))}
      </Popover>
    </>
  );
}
