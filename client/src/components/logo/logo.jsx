/*
  Display the S-Central logo together with the application name 'S-Central'
*/

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/**
 * The Logo that is displayed in the app and the name of the app
 * @param {boolean} disabledLink if true only the image is returned
 * @returns {JSX.Element}
 */
const Logo = ({ disabledLink = false, sx }) => {
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
        S-Central
      </Typography>
    </Stack>
  );
};

export default Logo;
