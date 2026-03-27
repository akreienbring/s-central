/*
  Author: André Kreienbring
  Declares the type (ShellyCentral) Notification that is used for notifications that are sent by the server to the client.
  Properties that describe a notification, such as title, type, avatar, createdAt and so on.
*/
export type SCNotification = {
  id: number;
  title: string;
  isUnread: boolean;
  type: string;
  avatar: string;
  createdAt: Date;
  device_ip?: string;
  device_cname?: string;
  script_id?: number;
  script_name?: string;
  notification: string;
};
