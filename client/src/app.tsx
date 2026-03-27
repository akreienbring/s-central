import '@src/global.css';

import Router from '@src/routes/sections';
import { ThemeProvider } from '@src/theme/theme-provider';
import { useScrollToTop } from '@src/hooks/use-scroll-to-top';

import { SCProvider } from './scontext';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <SCProvider>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </SCProvider>
  );
}
