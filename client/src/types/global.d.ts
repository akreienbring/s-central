/*
  Author: André Kreienbring
  Declares global types that are used in multiple files. Mainly the type WSMessage that is used for all (received / send) websocket messages.
  The type WSMessage is an object with a string 'event' property and a 'data' property that can hold different properties depending on the event.
  The type of the data property is declared as an intersection type of all possible properties that can be received in a ws message.
  This way we can have type checking for all ws messages in one place and we don't have to declare the same types in multiple files.
*/
import type { User } from './user';
import type { Blogpost } from './blogpost';
import type { AuthError } from './digest-auth';
import type { Notification } from '@src/types/scnotification';
import type { Scene, Device, DeviceSwitch, DeviceScript, WifiSettings } from '@src/types/device';

declare global {
  type SortOrder = 'asc' | 'desc';

  /*
  Displays information to the user by using a fading alert
  */
  type UserInfo = {
    open?: boolean;
    text: string;
    severity: 'info' | 'success' | 'error' | 'warning';
    visible: boolean;
    title: string;
  };
  /*
  When the context is reloaded the client tries to reconnect to the ws server
  with a message of this type. channelID will be maintained by the server to
  keep the connection alive.
  */
  type CliReconnectMsg = {
    event: 'user-reconnect';
    source: string;
    message: string;
    channelID: string;
    data: {
      user: User | null;
    };
  };

  /*
    Used for subscriptions when receiving unrequested events from the server.
    Consumed in ShellyCard, ShellyTableRow, NotificationsPopover, Appview
  */
  type SrvEventMsg = {
    event: 'device-update' | 'notification-create';
    eventType?: 'kvs' | 'log' | 'script' | 'device' | 'ws';
    message: string;
    source: string;
    subscriptionId: string;
    data: {
      device?: Device;
      notification?: Notification;
    };
  };

  /*
    The password is never send over the network. Instead this type is
    used in the digest challenge response cycle between client and server
  */
  type CliValidateMsg = {
    event: string;
    message: string;
    source: string;
    requestID?: string;
    secret?: string;
    data: {
      user?: User;
      error?: AuthError;
      auth?: object;
    };
  };

  /*
    Upon the validation request send by the client the server
    answers with this type of message.
  */
  type SrvValidateMsg = {
    event: string;
    message: string;
    source: string;
    secret?: string;
    requestID?: string;
    data: { success?: boolean; user?: User; error?: object; requestResult?: RequestResult };
  };

  /*
    Client components are requesting data and action from the server.
    This type is used for all requests exept validation.
  */
  type CliRequestMsg = {
    event: DBCUDEvent | CliRequestEvent;
    message: string;
    source: string;
    requestID?: string;
    secret?: string;
    data: {
      deviceId?: string;
      ids?: number[] | string[];
      id?: number;
      blogpost?: Blogpost;
      wifisettings?: WifiSettings;
      userid?: number;
      istest?: boolean;
      user?: User;
      scene?: Scene;
      email?: string;
      userdevices?: string[];
      switch?: DeviceSwitch;
      script?: DeviceScript;
      scriptIndex?: number;
    };
  };

  type RequestResult = {
    success: boolean;
    message: string;
    successful?: number;
    total?: number;
    ids?: number[] | string[];
  };

  /*
    When a client component request data the server answers with 
    this type of message.
  */
  type SrvAnswerMsg = {
    event: string;
    message: string;
    source: string;
    requestID?: string;
    secret?: string;
    data: {
      requestResult?: RequestResult;
      wifisettings?: WifiSettings;
      rows?: [];
      roles?: { id: number; name: string }[];
      devices?: Device[];
      device?: Device;
      blogpost?: Blogpost;
      blogposts?: Blogposts[];
      userdevices?: string[];
      users?: User[];
      notifications?: Notification[];
      scenes?: Scene[];
      successful?: number;
      total?: number;
      success?: boolean;
    };
  };

  type DBCUDEvent =
    | 'user-resetpw'
    | 'user-profile-update'
    | 'user-settings-update'
    | 'user-security-update'
    | 'user-create'
    | 'user-delete'
    | 'user-devices-update'
    | 'notification-create'
    | 'notification-update'
    | 'notification-delete'
    | 'notification-delete-all'
    | 'blogpost-delete'
    | 'blogpost-update'
    | 'blogpost-create'
    | 'scene-create'
    | 'scene-delete'
    | 'scene-update';

  type CliRequestEvent =
    | 'notifications-get-all'
    | 'blogposts-get-all'
    | 'blogposts-get-public'
    | 'timeline-get-minute'
    | 'timeline-get-hour'
    | 'timeline-get-day'
    | 'timeline-get-month'
    | 'timeeline-get-year'
    | 'devices-timeline-get'
    | 'devices-get-all'
    | 'device-get'
    | 'devices-beta-update'
    | 'devices-stable-update'
    | 'devices-reboot'
    | 'device-get-wifi-settings'
    | 'device-wifi-update'
    | 'roles-get-all'
    | 'users-get-all'
    | 'user-validate'
    | 'user-devices-get-all'
    | 'scenes-get-all'
    | 'scene-select'
    | 'toggle-switch'
    | 'set-switch'
    | 'toggle-script';

  // Further ideas to specialise types. CURRENTLY UNUSED

  type ClientDBRequestMsg = {
    event: DBCUDEvent;
    message: string;
    source: string;
    requestID?: string;
    secret?: string;
    data: {
      ids?: number[] | string[];
      blogpost?: Blogpost;
      userdevices?: string[];
      user?: User;
    };
  };

  type SrvDBAnswerMsg = {
    event: DBCUDType;
    message: string;
    source: string;
    requestID?: string;
    data: {
      result: RequestResult;
    };
  };

  type SrvReconnectMsg = {
    event: 'user-reconnect';
    data: {
      message: string;
      source: string;
      secret: string;
    };
  };

  /*
    Former, now UNUSED general type for all ws-messages.
    Left here for documentation of the transported data.
  */
  type WSMessage = {
    event: string;
    eventType?: string;
    // Message basics
    message: string;
    source: string;
    // Send via context
    channelID?: string;
    subscriptionID?: string;
    requestID?: string;
    secret?: string;
    data: {
      // toggling a script
      script?: DeviceScript;
      scriptIndex?: number;
      // toggling / setting a switch
      switch?: Switch;
      // receiving, updating, deleting notifications
      notification?: Notification;
      notifications?: Notification[];
      // User creation / updates / receiving all users / assigning devices
      users?: User[];
      user?: User;
      userdevices?: string[];
      // get all devices of a specific user
      userid?: number;
      //ShellyCard / ShellyTableRow / WifiForm requests a device //toggle / set switches
      deviceId?: string;
      // receiving, creating, updating a blogpost,
      blogposts?: Blogpost[];
      blogpost?: Blogpost;
      // deleting / updating notifications, blogposts or users
      // WifiForm updates wifi setting
      // Updating firmware / rebooting devices
      ids?: number[] | string[];
      id?: number;
      // receiving device(s) from server
      // updating device
      device?: Device;
      devices?: Device[]; // or sending User/Device assignments to server
      // selecting a user role for a user
      roles?: { id: number; name: string }[];
      // for testing from User/login form
      isTest?: boolean;
      // Timeline requests
      rows?: [];
      // Validation Request if not authenticated
      error?: AuthError;
      auth?: object;
      email?: string; // also password reset
      // when a result must be displayed to the user after a request
      success?: boolean;
      // receiving / setting / updating wifi settings of a device
      wifisettings?: WifiSettings;
      // Batch Firmware Updates
      successful?: number;
      total?: number;
    };
  };
}
