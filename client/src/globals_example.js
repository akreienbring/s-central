/*
Author: André Kreienbring  
Global variables that can be used anywhere in the app.
*/
export const globals = {
  /*
    In development websocket communication is not encrypted.
  */
  WSURL: 'ws://192.168.1.2:3031',
  WSSURL: 'wss://192.168.1.2:3031',
  RECONNECT_DELAY: 2, // in seconds
  RECONNECT_MAX: 10,
  LANDING_PAGE: 'blogs', // either 'login' or 'blogs'
};
