/*
  Used to make global window properties available in Typescript
*/
interface Window {
  scconfig: {
    RECONNECT_MAX: number;
    RECONNECT_DELAY: number;
    WSURL: string;
    WSSURL: string;
    LANDING_PAGE: string;
  };
  scinfo: {
    VERSION: string;
  };
}
