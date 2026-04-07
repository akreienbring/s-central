/*
    Author: André Kreienbring
    Displays the time of the last received websocket message.
    Also indicates if the client is connected to the Shellybroker WS server
*/
import { useNavigate } from 'react-router';
import Iconify from '@src/components/iconify';
import { useTranslation } from 'react-i18next';
import { fDateTime } from '@src/utils/format-time';
import { type JSX, useState, useEffect, useCallback } from 'react';
import { subscribeEvent, unsubscribeEvent } from '@src/events/pubsub';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

/**
  When the wbsocket receives data it publishes the custom event 'lastUpdateAt' with the current time.
  When the websocket is closed it publishes the event 'lastUpdateAt' with a null value.
  During rendering 'lastUpdateAt' may be undefined.
  @returns {JSX.Element | null}
*/
const LastUpdate = (): JSX.Element | null => {
  const [lastUpdateAt, setLastUpdateAt] = useState<null | string | number>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  /**
    @param {object} event Contains the Date/Time of the last update. Displayd in the Title of the view.
      lastUpdatedAt Can be:
      - {date} The time when the last ws msg was received
      - {null} The websocket is disconnected from the server
      - {'connecting'} The websocket is reconnecting to the server
  */
  const handleLastUpdate = useCallback((event: CustomEvent) => {
    if (event !== null) setLastUpdateAt(event.detail);
  }, []);

  useEffect(() => {
    subscribeEvent('lastUpdatedAt', handleLastUpdate as EventListener);

    return () => {
      // cleanup on unmount: unsubscribe from the event
      unsubscribeEvent('lastUpdatedAt', handleLastUpdate as EventListener);
    };
  }, [handleLastUpdate]);

  /**
    When disconnected, this will reload the current location
    and hence reconnect the websocket.
  */
  const handleClick = () => {
    if (lastUpdateAt === null) {
      setLastUpdateAt('connecting');
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
        lastUpdateAt === 'connecting' ? (
          <CircularProgress size={25} variant="indeterminate" sx={{ color: 'common.white' }} />
        ) : (
          <Iconify icon="carbon:update-now" />
        )
      }
      onClick={handleClick}
      sx={{ mr: { sm: 2 } }}
    >
      {lastUpdateAt === null
        ? t('_notconnected_')
        : lastUpdateAt === 'connecting'
          ? t('connecting')
          : fDateTime(lastUpdateAt as number, 'HH:mm:ss')}
    </Button>
  );
};

export default LastUpdate;
