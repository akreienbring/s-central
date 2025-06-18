import 'src/global.css';

import Router from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import ThemeProvider from 'src/theme';

import { SCProvider } from './sccontext';

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
