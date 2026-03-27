/*
  Author: André Kreienbring
  Lists notifications that are retrieved from the server.
  Presents functions to manage them.
*/
import type { Subscription } from '@src/types/context';
import type { SCNotification } from '@src/types/scnotification';

import Iconify from '@src/components/iconify';
import { useTranslation } from 'react-i18next';
import { fToNow } from '@src/utils/format-time';
import { createUUID } from '@src/utils/general';
import { useShelly } from '@src/hooks/use-shelly';
import Scrollbar from '@src/components/scrollbar';
import { useRef, type JSX, useState, useEffect, useCallback } from 'react';

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

// ----------------------------------------------------------------------

export default function NotificationsPopover(): JSX.Element {
  const [notifications, setNotifications] = useState<SCNotification[]>([]);
  const totalUnRead = notifications.filter((item) => item.isUnread === true).length;
  const [open, setOpen] = useState<HTMLButtonElement | null>(null);
  const { request, subscribe, unsubscribe, send } = useShelly();
  const subscriptionID = useRef(createUUID());
  const isNotificationLoaded = useRef(false);
  const { t } = useTranslation();

  /**
   * Used to open the Popover
   * @param {*} event
   */
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(event.currentTarget);
  };
  const handleClose = () => {
    setOpen(null);
  };

  /**
    Called after a new notification arrived.
    @param {object} msg The message with a new notification.
  */
  const handleNotificationUpdate = useCallback(
    (msg: SrvEventMsg) => {
      if (typeof msg.data.notification !== 'undefined') {
        const notificationData = msg.data.notification;
        const updatedNotifications = [...notifications];
        const notification: SCNotification = {
          id: notificationData.id,
          type: notificationData.type,
          title: notificationData.title,
          notification: notificationData.notification,
          avatar: '',
          createdAt: new Date(notificationData.ts),
          isUnread: notificationData.isUnread,
        };
        updatedNotifications.push(notification);

        setNotifications(updatedNotifications);
      }
    },
    [notifications]
  );

  /**
    Called when the PopOver is mounted and the list of notifications
    is received from the server. Also when one notification is deleted
    @param {object} msg The message with the initial notifications attached
  */
  const handleNotificationsReceived = useCallback(
    (msg: SrvAnswerMsg) => {
      if (typeof msg.data.notifications !== 'undefined') {
        isNotificationLoaded.current = true;

        const allNotifications: SCNotification[] = msg.data.notifications.map((notification) => ({
          id: notification.id,
          type: notification.type,
          title: notification.title,
          notification: notification.notification,
          avatar: '',
          createdAt: new Date(notification.ts),
          isUnread: notification.isUnread === 1 ? true : false,
        }));

        setNotifications(allNotifications);
        if (allNotifications.length === 0) {
          handleClose();
        }
      }
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
    // don't request or update the devices if a test is running
    const currentSubscriptionID = subscriptionID.current;

    if (!isNotificationLoaded.current) {
      const requestMsg: CliRequestMsg = {
        event: 'notifications-get-all',
        source: 'Notifications Popover',
        message: 'Notifications Popover needs the list of notifications',
        data: {},
      };
      request(requestMsg, handleNotificationsReceived);
    }

    const subscription: Subscription = {
      subscriptionID: subscriptionID.current,
      callback: handleNotificationUpdate,
      all: true,
    };
    subscribe(subscription, ['notification-create']);
    /*
      Clean up the websocket subscription when unmounting the component.
    */
    return () => {
      unsubscribe(currentSubscriptionID, ['notification-create']);
    };
  }, [handleNotificationsReceived, handleNotificationUpdate, subscribe, unsubscribe, request]);

  /**
   * Sets all notifications to read.
   * Only read notifications can be deleted
   */
  const handleMarkAllAsRead = () => {
    const readNotifications: number[] = [];
    const newNotifications = notifications.map((notification) => {
      notification.isUnread = false;
      readNotifications.push(notification.id);
      return notification;
    });

    setNotifications(newNotifications);

    const requestMsg: CliRequestMsg = {
      event: 'notification-update',
      source: 'Notifications Popover',
      message: 'Notifications Popover wants to update notifications',
      data: {
        ids: readNotifications,
      },
    };
    send(requestMsg);
  };

  /**
    When an unread notification is clicked,
    it will be marked as read. An according update is send to the server.
    @param {SCNotification} readNotification The notification that was read
  */
  const handleItemClick = (readNotification: SCNotification) => {
    const readNotifications: number[] = [];

    const newNotifications = notifications.map((notification) => {
      if (readNotification.id === notification.id) {
        notification.isUnread = false;
        readNotifications.push(notification.id);
        return notification;
      }
      return notification;
    });

    setNotifications(newNotifications);
    const requestMsg: CliRequestMsg = {
      event: 'notification-update',
      source: 'Notifications Popover',
      message: 'Notifications Popover wants to update notifications',
      data: {
        ids: readNotifications,
      },
    };
    send(requestMsg);
  };

  /**
   * Deletes a single notification by sending a request to the server.
   * The server answers with the remaining list of notifications.
   * @param {number} id The id of the notification that must be deleted
   */
  const handleItemDelete = (id: number) => {
    const requestMsg: CliRequestMsg = {
      event: 'notification-delete',
      source: 'Notifications Popover',
      message: 'Notifications Popover wants to delete a notification',
      data: {
        id,
      },
    };
    request(requestMsg, handleNotificationsReceived);
  };

  /**
   * Deletes all notifications
   */
  const handleDeleteAll = () => {
    const requestMsg: CliRequestMsg = {
      event: 'notification-delete-all',
      source: 'Notifications Popover',
      message: 'Notifications Popover wants to delete a notification',
      data: {},
    };
    request(requestMsg, handleNotificationsReceived);
  };

  return (
    <>
      <IconButton
        data-testid="open_notifications_popover_button"
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
      >
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
          {totalUnRead === 0 && notifications.length > 0 && (
            <Tooltip title={t('_deleteall_')}>
              <IconButton color="primary" onClick={handleDeleteAll}>
                <Iconify icon="eva:trash-2-outline" />
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
                  handleItemDelete={handleItemDelete}
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
                  handleItemClick={handleItemClick}
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
interface NotificationItemProps {
  notification: SCNotification;
  handleItemClick: (notification: SCNotification) => void;
  handleItemDelete: (id: number) => void;
}

/**
 * This components presents a single notification.
 * @param {SCNotification} notification The notification to show
 * @param {function} handleItemClick Sets the notification to 'read'
 * @param {function} handleItemDelete Deletes the notification
 */
function NotificationItem({
  notification,
  handleItemClick,
  handleItemDelete,
}: NotificationItemProps): JSX.Element {
  const { avatar, title } = renderContent(notification);

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
      <Stack direction="row" spacing={3}>
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
              {fToNow(notification.createdAt)}
            </Typography>
          }
          sx={{ maxWidth: 200, minWidth: 200 }}
        />
        {!notification.isUnread && (
          <IconButton
            onClick={() => {
              handleItemDelete(notification!.id);
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
function renderContent(notification: SCNotification): { avatar: JSX.Element; title: JSX.Element } {
  const title = (
    <>
      <Typography variant="subtitle2">{notification.title} </Typography>
      <Typography
        component="span"
        variant="body2"
        style={{ whiteSpace: 'pre-line' }}
        sx={{ color: 'text.secondary' }}
      >
        {notification.notification}
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
  return { avatar: <div />, title: <p>unknown notification type</p> };
}
