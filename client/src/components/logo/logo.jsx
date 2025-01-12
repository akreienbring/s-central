import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const logo = <Box component="img" src="/assets/logo.svg" sx={{ width: 40, height: 40, ...sx }} />;

  if (disabledLink) {
    return logo;
  }

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <Box sx={{ display: 'contents' }}>{logo}</Box>
      <Typography variant="h6" sx={{ pt: 3 }}>
        Shelly Central
      </Typography>
    </Stack>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
