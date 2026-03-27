/*
  Author: André Kreienbring
  Renders the login form view with a device carousel for the devices.
*/
import { type JSX } from 'react';
import Logo from '@src/components/logo';
import UserForm from '@src/sections/user/user-form';
import DeviceCarousel from '@src/sections/login/device-carousel';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

// ----------------------------------------------------------------------

/**
 * Renders the login view with a device carousel and the login form
 * @returns {JSX.Element}
 */
export default function LoginView(): JSX.Element {
  return (
    <Container maxWidth="xl">
      <Box
        display="flex"
        sx={{ justifyContent: 'center', alignItems: 'center', minHeight: '100%' }}
      >
        <Card
          sx={{
            p: 5,
            maxWidth: 420,
            minWidth: 420,
            margin: 20,
          }}
        >
          <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
            <Logo sx={{ mt: 3 }} />

            <DeviceCarousel />

            <UserForm type="login" />
          </Stack>
        </Card>
      </Box>
    </Container>
  );
}
