/*
  Author: André Kreienbring
  Lists notifications that are retrieved from the server.
  Presents functions to manage them.
*/
import { es, de, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import { createUUID } from 'src/utils/general';

import { useShelly } from 'src/sccontext';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const [notifications, setNotifications] = useState([]);
  const totalUnRead = notifications.filter((item) => item.isUnread === true).length;
  const [open, setOpen] = useState(null);
  const { request, subscribe, unsubscribe, send } = useShelly();
  const subscriptionID = useRef(createUUID());
  const isNotificationLoaded = useRef(false);
  const { t } = useTranslation();

  /**
    Called after a new notification arrived.
    @param {object} msg The message with a new notification.
  */
  const handleNotificationUpdate = useCallback(
    (msg) => {
      const { notification } = msg.data;
      const updatedNotifications = [...notifications];

      updatedNotifications.push({
        id: notification.id,
        type: notification.type,
        title: notification.title,
        description: notification.notification,
        avatar: null,
        createdAt: new Date(notification.ts),
        isUnread: notification.isUnread === 1,
      });

      setNotifications(updatedNotifications);
    },
    [notifications]
  );

  /**
    Called when the PopOver is mounted and the list of notifications
    is received from the server.
    @param {object} msg The message with the initial notifications attached
  */
  const handleNotificationsReceived = useCallback(
    (msg) => {
      isNotificationLoaded.current = true;

      const allNotifications = msg.data.notifications.map((notification) => ({
        id: notification.id,
        type: notification.type,
        title: notification.title,
        description: notification.notification,
        avatar: null,
        createdAt: new Date(notification.ts),
        isUnread: notification.isUnread === 1,
      }));

      setNotifications(allNotifications);
    },
    [setNotifications]
  );

  // --------------------- Websocket Implementation BEGIN----------------
  /*
    After creation of the page all notifications are requested from the websocket server.
    The components also subscribes to the event 'ScriptError' to receive them as they occur.
    The useEffect is only triggered once and lives as long the page is mounted.
  */
  useEffect(() => {
    const currentSubscriptionID = subscriptionID.current;

    if (!isNotificationLoaded.current)
      request(
        {
          event: 'notifications get all',
          data: {
            source: 'Notifications Popover',
            message: 'Notifications Popover needs the list of notifications',
          },
        },
        handleNotificationsReceived
      );

    subscribe(
      {
        subscriptionID: subscriptionID.current,
        callback: handleNotificationUpdate,
        all: true,
      },
      ['notification create']
    );
    /*
      Clean up the websocket subscription when unmounting the component.
    */
    return () => {
      unsubscribe(currentSubscriptionID, ['notification create']);
    };
  }, [handleNotificationsReceived, handleNotificationUpdate, subscribe, unsubscribe, request]);

  /**
   * Used to open the Popover
   * @param {*} event
   */
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };
  const handleClose = () => {
    setOpen(null);
  };

  /**
   * Sets all notifications to read.
   * Only read notifications can be deleted
   */
  const handleMarkAllAsRead = () => {
    const readNotifications = [];
    const newNotifications = notifications.map((notification) => {
      notification.isUnread = false;
      readNotifications.push(notification.id);
      return notification;
    });

    setNotifications(newNotifications);

    send({
      event: 'notification update',
      data: {
        source: 'Notifications Popover',
        message: 'Notifications Popover wants to update notifications',
        ids: readNotifications,
      },
    });
  };

  /**
    When an unread notification is clicked,
    it will be marked as read. An according update is send to the server.
    @param {object} readNotification The notification that was read
  */
  const handleItemClick = (readNotification) => {
    const readNotifications = [];

    const newNotifications = notifications.map((notification) => {
      if (readNotification.id === notification.id) {
        notification.isUnread = false;
        readNotifications.push(notification.id);
        return notification;
      }
      return notification;
    });

    setNotifications(newNotifications);

    send({
      event: 'notification update',
      data: {
        source: 'Notifications Popover',
        message: 'Notifications Popover wants to update notifications',
        ids: readNotifications,
      },
    });
  };

  /**
   * Deletes a notification by sending a request to the server.
   * The server answers with the remaining list of notifications.
   * @param {number} id The id of the notification that must be deleted
   */
  const handleItemDelete = (id) => {
    request(
      {
        event: 'notification delete',
        data: {
          source: 'Notifications Popover',
          message: 'Notifications Popover wants to delete a notification',
          ids: [id],
        },
      },
      handleNotificationsReceived
    );
  };

  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen}>
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              ml: 0.75,
              width: 360,
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">{t('Notifications')}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('_unreadmessages_', { totalUnRead })}
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title={t('_markallasread_')}>
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                {t('Unread')}
              </ListSubheader>
            }
          >
            {notifications
              .filter((item) => item.isUnread === true)
              .map((notification) => (
                <NotificationItem
                  key={createUUID()}
                  notification={notification}
                  handleItemClick={handleItemClick}
                />
              ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                {t('Read')}
              </ListSubheader>
            }
          >
            {notifications
              .filter((item) => item.isUnread === false)
              .map((notification) => (
                <NotificationItem
                  key={createUUID()}
                  notification={notification}
                  handleItemDelete={handleItemDelete}
                />
              ))}
          </List>
        </Scrollbar>
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------
/**
 * This components presents a single notification.
 * @param {object} notification The notification to show
 * @param {function} handleItemClick Sets the notification to 'read'
 * @param {function} handleItemDelete Deletes the notification
 */
function NotificationItem({ notification, handleItemClick, handleItemDelete }) {
  const { avatar, title } = renderContent(notification);
  const { i18n } = useTranslation();

  /*
    Maps the current i18n language to a date-fns locale
  */
  const getDatefnsLocale = () => {
    switch (i18n.language) {
      case 'en':
        return enUS;
      case 'de':
        return de;
      case 'es':
        return es;
      default:
        return enUS;
    }
  };

  return (
    <ListItemButton
      onClick={() => {
        if (notification.isUnread) handleItemClick(notification);
      }}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(notification.isUnread && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar alt={notification.title} sx={{ bgcolor: 'background.neutral' }}>
          {avatar}
        </Avatar>
      </ListItemAvatar>
      <Stack direction="row" spacing={3} alignItems="start" justifyContent="space-between">
        <ListItemText
          primary={title}
          secondary={
            <Typography
              variant="caption"
              sx={{
                mt: 0.5,
                display: 'flex',
                alignItems: 'center',
                color: 'text.disabled',
              }}
            >
              <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
              {formatDistanceToNow(notification.createdAt, {
                addSuffix: true,
                locale: getDatefnsLocale(),
              })}
            </Typography>
          }
          sx={{ maxWidth: 200 }}
        />
        {!notification.isUnread && (
          <IconButton
            onClick={() => {
              handleItemDelete(notification.id);
            }}
          >
            <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          </IconButton>
        )}
      </Stack>
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------
/**
 * Renders the content of a notification
 * @param {object} notification
 * @returns
 */
function renderContent(notification) {
  const title = (
    <>
      <Typography variant="subtitle2">{notification.title} </Typography>
      <Typography
        component="span"
        variant="body2"
        style={{ whiteSpace: 'pre-line' }}
        sx={{ color: 'text.secondary' }}
      >
        {notification.description}
      </Typography>
    </>
  );

  if (notification.type === 'script-error') {
    return {
      avatar: <img src="/assets/icons/notification/ic_notification_error.svg" />,
      title,
    };
  }

  if (notification.type === 'device-offline') {
    return {
      avatar: <img src="/assets/icons/notification/ic_notification_offline.svg" />,
      title,
    };
  }
  return null;
}
