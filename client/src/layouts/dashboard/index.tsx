import { useState } from 'react';

import Box from '@mui/material/Box';

import Nav from './nav';
import Main from './main';
import Header from './header';

// ----------------------------------------------------------------------
/**
 * The layout of the S-Central application with the nav bar, the header and
 * the different pages
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @returns
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [openNav, setOpenNav] = useState(false);

  return (
    <>
      <Header onOpenNav={() => setOpenNav(true)} />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />

        <Main>{children}</Main>
      </Box>
    </>
  );
}
