import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';

import UserForm from 'src/sections/user/user-form';
import DeviceCarousel from 'src/sections/login/device-carousel';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Card
        sx={{
          p: 5,
          width: 1,
          maxWidth: 420,
        }}
      >
        <Stack sx={{ alignItems: 'center', justifyContent: 'center', height: 1 }}>
          <Logo sx={{ mt: 3 }} />

          <DeviceCarousel />

          <UserForm type="login" />
        </Stack>
      </Card>
    </Box>
  );
}
