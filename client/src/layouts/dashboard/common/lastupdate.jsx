import { useNavigate } from 'react-router';
/*
    Author: André Kreienbring
    Displays the time of the last received websocket message.
    Also indicates if the client is connected to the Shellybroker WS server
*/
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { fDateTime } from 'src/utils/format-time';

import { subscribeEvent, unsubscribeEvent } from 'src/events/pubsub';

import Iconify from 'src/components/iconify';

/**
  When the wbsocket receives data it publishes the custom event 'lastUpdateAt' with the current time.
  When the websocket is closed it publishes the event 'lastUpdateAt' with a null value.
  During rendering 'lastUpdateAt' may be undefined.
*/
const LastUpdate = () => {
  const [lastUpdateAt, setLastUpdateAt] = useState('connecting');
  const { t } = useTranslation();
  const navigate = useNavigate();

  /**
    @param {object} event Contains the Date/Time of the last update. Displayd in the Title of the view.
      lastUpdatedAt Can be:
      - {date} The time when the last ws msg was received
      - {null} The websocket is disconnected from the server
      - {'connecting'} The websocket is reconnecting to the server
      - {'loading'} The websocket is fetching data from the server
       - 0 The component will not be displayd if no websocket exists
  */
  const handleLastUpdate = useCallback((event) => {
    if (event !== null) setLastUpdateAt(event.detail);
  }, []);

  useEffect(() => {
    subscribeEvent('lastUpdatedAt', handleLastUpdate);

    return () => {
      // cleanup on unmount: unsubscribe from the event
      unsubscribeEvent('lastUpdatedAt');
    };
  }, [handleLastUpdate, lastUpdateAt]);

  /*
    When disconnected, this will reload the current location
    and hence reconnect the websocket.
  */
  const handleClick = () => {
    if (lastUpdateAt === null) {
      setLastUpdateAt(undefined);
      navigate(0);
    }
  };

  if (lastUpdateAt === 0) return null;

  return (
    <Button
      data-testid="info_lastUpdate_button"
      variant="contained"
      color={lastUpdateAt !== null && lastUpdateAt !== 'connecting' ? 'success' : 'error'}
      startIcon={
        lastUpdateAt === 'connecting' || lastUpdateAt === 'loading' ? (
          <CircularProgress size={25} variant="indeterminate" color="common.white" />
        ) : (
          <Iconify icon="carbon:update-now" />
        )
      }
      onClick={handleClick}
    >
      {lastUpdateAt !== null && lastUpdateAt !== 'connecting' && lastUpdateAt !== 'loading'
        ? fDateTime(lastUpdateAt, 'HH:mm:ss')
        : t('_notconnected_')}
    </Button>
  );
};

export default LastUpdate;
