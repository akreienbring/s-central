/*
  Author: André Kreienbring
  If configured in 'globals.js' with LANDING_PAGE: 'blogs' this page presents Blog entries
  and a link to the LoginView.
*/
import { Helmet } from 'react-helmet-async';

import { LandingView } from 'src/sections/landing/view';

export default function LandingPage() {
  return (
    <>
      <Helmet>
        <title> Shelly Central</title>
      </Helmet>

      <LandingView />
    </>
  );
}
