/*
  Author: André Kreienbring
  The Header of  the application dashboard layout.
  Offers LastUpdate info, language selection, notifications and account settings.
*/
import { bgBlur } from '@src/theme/css';
import { useLocation } from 'react-router';
import Iconify from '@src/components/iconify';
import { useResponsive } from '@src/hooks/use-responsive';
import FadingAlert from '@src/components/userinfo/fadingalert';
import LastUpdate from '@src/layouts/dashboard/common/lastupdate';
import { type JSX, useState, useEffect, useCallback } from 'react';
import { subscribeEvent, unsubscribeEvent } from '@src/events/pubsub';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { NAV, HEADER } from './config-layout';
import AccountPopover from './common/account-popover';
import LanguagePopover from './common/language-popover';
import NotificationsPopover from './common/notifications-popover';

// ----------------------------------------------------------------------
/**
 * The header display above all other views of the application
 * @param {object} props
 * @param {Function} props.onOpenNav Opens the navigation bar on the left
 * @returns {JSX.Element}
 */
export default function Header({ onOpenNav }: { onOpenNav: () => void }): JSX.Element {
  const [alert, setAlert] = useState<UserInfo>({
    title: '',
    text: '',
    severity: 'info',
    visible: false,
  });
  const theme = useTheme();
  const location = useLocation();
  const lgUp = useResponsive('up', 'lg');

  const handleSetUserInfo = useCallback((event: CustomEvent) => {
    if (event !== null) setAlert(event.detail);
  }, []);

  useEffect(() => {
    subscribeEvent('userInfo', handleSetUserInfo as EventListener);

    return () => {
      // cleanup on unmount: unsubscribe from the event
      unsubscribeEvent('userInfo', handleSetUserInfo as EventListener);
    };
  }, [handleSetUserInfo]);

  const renderContent = (
    <>
      {!lgUp && (
        <IconButton data-testid="nav_open_button" onClick={onOpenNav} sx={{ mr: 1 }}>
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
      )}

      <Box sx={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
        <FadingAlert alert={alert} setAlert={setAlert} />
      </Box>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{
          maxHeight: 40,
          minHeight: 40,
          alignItems: 'center',
        }}
      >
        {(location.pathname === '/dashboard' || location.pathname === '/shellies') && (
          <LastUpdate />
        )}
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 1 }}>
          <LanguagePopover />
          <NotificationsPopover />
          <AccountPopover />
        </Stack>
      </Stack>
    </>
  );

  return (
    <AppBar
      sx={{
        boxShadow: 'none',
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.WIDTH + 1}px)`,
          height: HEADER.H_DESKTOP,
        }),
        ...bgBlur({
          color: theme.palette.background.default,
        }),
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {renderContent}
      </Toolbar>
    </AppBar>
  );
}
